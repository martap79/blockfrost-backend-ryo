import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../../types/queries/metadata.js';
import * as ResponseTypes from '../../../types/responses/metadata.js';
import { getDbSync } from '../../../utils/database.js';
import { SQLQuery } from '../../../sql/index.js';
import { getSchemaForEndpoint } from '@blockfrost/openapi';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/metadata/txs/labels',
    method: 'GET',
    schema: getSchemaForEndpoint('/metadata/txs/labels'),
    handler: async (request: FastifyRequest<QueryTypes.RequestLabels>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows }: { rows: ResponseTypes.MetadataTxLabels } =
          await clientDbSync.query<QueryTypes.MetadataTxLabels>(
            SQLQuery.get('metadata_txs_labels'),
            [request.query.order, request.query.count, request.query.page],
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
