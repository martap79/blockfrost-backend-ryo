import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../../sql/index.js';
import * as QueryTypes from '../../../types/queries/nutlink.js';
import * as ResponseTypes from '../../../types/responses/nutlink.js';
import { getDbSync } from '../../../utils/database.js';
import { handle404 } from '../../../utils/error-handler.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/nutlink/tickers/:ticker',
    method: 'GET',
    schema: getSchemaForEndpoint('/nutlink/tickers/{ticker}'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParametersTicker>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const query404 = await clientDbSync.query<QueryTypes.ResultFound>(
          SQLQuery.get('nutlink_ticker_404'),
          [request.params.ticker],
        );

        if (query404.rows.length === 0) {
          clientDbSync.release();
          return handle404(reply);
        }

        const { rows }: { rows: ResponseTypes.NutlinkTickersTicker } =
          await clientDbSync.query<QueryTypes.NutlinkTickersTicker>(
            SQLQuery.get('nutlink_tickers_ticker'),
            [request.query.order, request.query.count, request.query.page, request.params.ticker],
          );

        clientDbSync.release();

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
