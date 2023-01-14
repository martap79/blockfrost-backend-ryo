import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../../../sql/index.js';
import * as QueryTypes from '../../../../types/queries/epochs.js';
import { getDbSync } from '../../../../utils/database.js';
import { handle404, handle400Custom } from '../../../../utils/error-handler.js';
import { validatePositiveInRangeSignedInt } from '../../../../utils/validation.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/epochs/:number/blocks',
    method: 'GET',
    schema: getSchemaForEndpoint('/epochs/{number}/blocks'),
    handler: async (request: FastifyRequest<QueryTypes.RequestBlockParameters>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        if (!validatePositiveInRangeSignedInt(request.params.number)) {
          clientDbSync.release();
          return handle400Custom(reply, 'Missing, out of range or malformed epoch_number.');
        }

        const query404 = await clientDbSync.query<QueryTypes.ResultFound>(
          SQLQuery.get('epochs_404'),
          [request.params.number],
        );

        if (query404.rows.length === 0) {
          clientDbSync.release();
          return handle404(reply);
        }

        const { rows } = await clientDbSync.query<QueryTypes.EpochBlocks>(
          SQLQuery.get('epochs_number_blocks'),
          [request.query.order, request.query.count, request.query.page, request.params.number],
        );

        clientDbSync.release();

        if (rows.length === 0) {
          return reply.send([]);
        }

        const list: string[] = [];

        for (const row of rows) {
          list.push(row.hash);
        }

        return reply.send(list);
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
