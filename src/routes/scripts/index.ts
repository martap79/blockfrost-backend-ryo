import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../types/queries/scripts.js';
import * as ResponseTypes from '../../types/responses/scripts.js';
import { getDbSync } from '../../utils/database.js';
import { SQLQuery } from '../../sql/index.js';
import { getSchemaForEndpoint } from '@blockfrost/openapi';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/scripts',
    method: 'GET',
    schema: getSchemaForEndpoint('/scripts'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParameters>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows }: { rows: ResponseTypes.Scripts } =
          await clientDbSync.query<QueryTypes.Scripts>(SQLQuery.get('scripts'), [
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
