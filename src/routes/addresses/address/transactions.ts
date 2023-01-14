import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { FastifyInstance, FastifyRequest } from 'fastify';

import { SQLQuery } from '../../../sql/index.js';
import * as QueryTypes from '../../../types/queries/addresses.js';
import * as ResponseTypes from '../../../types/responses/addresses.js';
import { getDbSync } from '../../../utils/database.js';
import { handle400Custom, handle404, handleInvalidAddress } from '../../../utils/error-handler.js';
import { getAdditionalParametersFromRequest } from '../../../utils/string-utils.js';
import { getAddressTypeAndPaymentCred } from '../../../utils/validation.js';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/addresses/:address/transactions',
    method: 'GET',
    schema: getSchemaForEndpoint('/addresses/{address}/transactions'),
    handler: async (request: FastifyRequest<QueryTypes.RequestParametersTransactions>, reply) => {
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

        // in case there are missing parameter,s they are being undefined
        // in node-postgres, undefined is treated as null
        const fromToParameters = getAdditionalParametersFromRequest(
          request.query.from,
          request.query.to,
        );

        if (fromToParameters === 'outOfRangeOrMalformedErr') {
          clientDbSync.release();
          return handle400Custom(
            reply,
            'Invalid (malformed or out of range) from/to parameter(s).',
          );
        }

        const { rows }: { rows: ResponseTypes.AddressTransactions } =
          await clientDbSync.query<QueryTypes.AddressTransactionsQuery>(
            SQLQuery.get('addresses_address_transactions'),
            [
              request.query.order,
              request.query.count,
              request.query.page,
              request.params.address,
              paymentCred,
              fromToParameters[0],
              fromToParameters[1],
              fromToParameters[2],
              fromToParameters[3],
            ],
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
