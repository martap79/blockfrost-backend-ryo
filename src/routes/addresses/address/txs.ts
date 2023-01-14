import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../../sql/index.js';
import * as QueryTypes from '../../../types/queries/addresses.js';
import { getDbSync } from '../../../utils/database.js';
import { handle404, handleInvalidAddress } from '../../../utils/error-handler.js';
import { getAddressTypeAndPaymentCred } from '../../../utils/validation.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/addresses/:address/txs',
    method: 'GET',
    schema: getSchemaForEndpoint('/addresses/{address}/txs'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParametersTxs>, reply) => {
      const { addressType, paymentCred } = getAddressTypeAndPaymentCred(request.params.address);

      if (!addressType) {
        return handleInvalidAddress(reply);
      }

      const clientDbSync = await getDbSync(fastify);

      try {
        const query404 = await clientDbSync.query<QueryTypes.ResultFound>(
          SQLQuery.get('addresses_404'),
          [request.params.address, paymentCred],
        );

        if (query404.rows.length === 0) {
          clientDbSync.release();
          return handle404(reply);
        }

        const { rows } = await clientDbSync.query<QueryTypes.AddressTx>(
          SQLQuery.get('addresses_address_txs'),
          [
            request.query.order,
            request.query.count,
            request.query.page,
            request.params.address,
            paymentCred,
          ],
        );

        clientDbSync.release();

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
