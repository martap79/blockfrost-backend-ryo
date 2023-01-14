import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../../../../types/queries/metadata.js';
import * as ResponseTypes from '../../../../../types/responses/metadata.js';
import { getDbSync } from '../../../../../utils/database.js';
import { handle400Custom, handle404 } from '../../../../../utils/error-handler.js';
import { validatePositiveInRangeSignedBigInt } from '../../../../../utils/validation.js';
import { SQLQuery } from '../../../../../sql/index.js';
import { getSchemaForEndpoint } from '@blockfrost/openapi';

async function route(fastify: FastifyInstance) {
  fastify.route({
    url: '/metadata/txs/labels/:label/cbor',
    method: 'GET',
    schema: getSchemaForEndpoint('/metadata/txs/labels/{label}/cbor'),
    handler: async (request: FastifyRequest<QueryTypes.RequestLabelParameters>, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        if (!validatePositiveInRangeSignedBigInt(request.params.label)) {
          clientDbSync.release();
          return handle400Custom(reply, 'Missing, out of range or malformed label.');
        }

        const { rows }: { rows: ResponseTypes.TxMetadataLabelNumberCbor } =
          await clientDbSync.query<QueryTypes.MetadataTxLabelCbor>(
            SQLQuery.get('metadata_txs_labels_label_cbor'),
            [request.query.order, request.query.count, request.query.page, request.params.label],
          );

        clientDbSync.release();

        if (rows.length === 0) {
          return handle404(reply);
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
