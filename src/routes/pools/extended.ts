import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../sql/index.js';
import * as QueryTypes from '../../types/queries/pools.js';
import * as ResponseTypes from '../../types/responses/pools.js';
import { getDbSync } from '../../utils/database.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/pools/extended',
    method: 'GET',
    schema: getSchemaForEndpoint('/pools/extended'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParameters>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows }: { rows: ResponseTypes.PoolsExtended } =
          await clientDbSync.query<QueryTypes.PoolsExtended>(SQLQuery.get('pools_extended'), [
            request.query.order,
            request.query.count,
            request.query.page,
          ]);

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
