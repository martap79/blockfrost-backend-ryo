import { FastifyInstance, FastifyRequest } from 'fastify';
import * as QueryTypes from '../../types/queries/network';
import * as ResponseTypes from '../../types/responses/network';
import { getSchemaForEndpoint } from '@blockfrost/openapi';
import { getDbSync } from '../../utils/database';
import { SQLQuery } from '../../sql';
import { getConfig } from '../../config';
import { ERAS } from '../../constants/network.ts';

async function network(fastify: FastifyInstance) {
  fastify.route({
    url: '/network',
    method: 'GET',
    schema: getSchemaForEndpoint('/network'),
    handler: async (_request: FastifyRequest, reply) => {
      const clientDbSync = await getDbSync(fastify);

      try {
        const { rows }: { rows: ResponseTypes.Network[] } =
          await clientDbSync.query<QueryTypes.Network>(SQLQuery.get('network'));

        clientDbSync.release();
        return reply.send(rows[0]);
      } catch (error) {
        if (clientDbSync) {
          clientDbSync.release();
        }
        throw error;
      }
    },
  });

  fastify.route({
    url: '/network/eras',
    method: 'GET',
    schema: getSchemaForEndpoint('/network/eras'),
    handler: async (_request, reply) => {
      const network = getConfig().network;
      const networkErasData: ResponseTypes.NetworkEras | undefined = ERAS[network];

      if (networkErasData) {
        return reply.send(networkErasData);
      } else {
        return reply.code(500).header('Content-Type', 'application/json; charset=utf-8').send({
          error: 'Internal Server Error',
          message: 'Internal Server Error',
          status_code: 500,
        });
      }
    },
  });


}

module.exports = network;
