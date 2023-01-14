import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../../sql/index.js';
import * as QueryTypes from '../../../types/queries/blocks.js';
import { getDbSync } from '../../../utils/database.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/blocks/latest/txs',
    method: 'GET',
    schema: getSchemaForEndpoint('/blocks/latest/txs'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParametersLatest>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows } = await clientDbSync.query<QueryTypes.BlockTxs>(
          SQLQuery.get('blocks_latest_txs'),
          [request.query.order, request.query.count, request.query.page],
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
