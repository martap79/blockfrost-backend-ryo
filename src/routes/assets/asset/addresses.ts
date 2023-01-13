import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../../types/queries/assets.js';
import * as ResponseTypes from '../../../types/responses/assets.js';
import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { getDbSync } from '../../../utils/database.js';
import { handle404 } from '../../../utils/error-handler.js';
import { SQLQuery } from '../../../sql/index.js';
import { validateAsset } from '@blockfrost/blockfrost-utils/lib/validation.js';
import { handleInvalidAsset } from '@blockfrost/blockfrost-utils/lib/fastify.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/assets/:asset/addresses',
    method: 'GET',
    schema: getSchemaForEndpoint('/assets/{asset}/addresses'),
    handler: async (request: FastifyRequest<QueryTypes.RequestAssetsParameters>, reply) => {
      const isAssetValid = validateAsset(request.params.asset);

      if (!isAssetValid) {
        return handleInvalidAsset(reply);
      }

      const clientDbSync = await getDbSync(fastify);

      try {
        const query404 = await clientDbSync.query<QueryTypes.ResultFound>(
          SQLQuery.get('assets_404'),
          [request.params.asset],
        );

        if (query404.rows.length === 0) {
          clientDbSync.release();
          return handle404(reply);
        }

        const { rows }: { rows: ResponseTypes.AssetAddresses } =
          await clientDbSync.query<QueryTypes.AssetAddresses>(
            SQLQuery.get('assets_asset_addresses'),
            [request.query.order, request.query.count, request.query.page, request.params.asset],
          );

        clientDbSync.release();

        if (rows.length === 0) {
          return reply.send([]);
        }

        return reply.send(rows);
      } catch (error) {
        if (clientDbSync) {
          clientDbSync.release();
        }
        throw error;
      }
    },
  });
}

export default route;
