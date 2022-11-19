import * as ResponseTypes from '../types/responses/network';
import { Network } from '../types/common';

export const ERAS: Record<Network, ResponseTypes.NetworkEras> = {
  mainnet: [
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 89856000,
        slot: 4492800,
        epoch: 208,
      },
      parameters: {
        epochLength: 21600,
        slotLength: 20,
        safeZone: 4320,
      },
    },
    {
      start: {
        time: 89856000,
        slot: 4492800,
        epoch: 208,
      },
      end: {
        time: 101952000,
        slot: 16588800,
        epoch: 236,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 101952000,
        slot: 16588800,
        epoch: 236,
      },
      end: {
        time: 108432000,
        slot: 23068800,
        epoch: 251,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 108432000,
        slot: 23068800,
        epoch: 251,
      },
      end: {
        time: 125280000,
        slot: 39916800,
        epoch: 290,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 125280000,
        slot: 39916800,
        epoch: 290,
      },
      end: {
        time: 157680000,
        slot: 72316800,
        epoch: 365,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 157680000,
        slot: 72316800,
        epoch: 365,
      },
      end: {
        time: 162864000,
        slot: 77500800,
        epoch: 377,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
  ],
  testnet: [
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 31968000,
        slot: 1598400,
        epoch: 74,
      },
      parameters: {
        epochLength: 21600,
        slotLength: 20,
        safeZone: 4320,
      },
    },
    {
      start: {
        time: 31968000,
        slot: 1598400,
        epoch: 74,
      },
      end: {
        time: 44064000,
        slot: 13694400,
        epoch: 102,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 44064000,
        slot: 13694400,
        epoch: 102,
      },
      end: {
        time: 48384000,
        slot: 18014400,
        epoch: 112,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 48384000,
        slot: 18014400,
        epoch: 112,
      },
      end: {
        time: 66528000,
        slot: 36158400,
        epoch: 154,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 66528000,
        slot: 36158400,
        epoch: 154,
      },
      end: {
        time: 92880000,
        slot: 62510400,
        epoch: 215,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 92880000,
        slot: 62510400,
        epoch: 215,
      },
      end: {
        time: 105408000,
        slot: 75038400,
        epoch: 244,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
  ],
  preview: [
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      parameters: {
        epochLength: 4320,
        slotLength: 20,
        safeZone: 864,
      },
    },
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      parameters: {
        epochLength: 86400,
        slotLength: 1,
        safeZone: 25920,
      },
    },
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      parameters: {
        epochLength: 86400,
        slotLength: 1,
        safeZone: 25920,
      },
    },
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      parameters: {
        epochLength: 86400,
        slotLength: 1,
        safeZone: 25920,
      },
    },
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 259200,
        slot: 259200,
        epoch: 3,
      },
      parameters: {
        epochLength: 86400,
        slotLength: 1,
        safeZone: 25920,
      },
    },
    {
      start: {
        time: 259200,
        slot: 259200,
        epoch: 3,
      },
      end: {
        time: 2332800,
        slot: 2332800,
        epoch: 27,
      },
      parameters: {
        epochLength: 86400,
        slotLength: 1,
        safeZone: 25920,
      },
    },
  ],
  preprod: [
    {
      start: {
        time: 0,
        slot: 0,
        epoch: 0,
      },
      end: {
        time: 1728000,
        slot: 86400,
        epoch: 4,
      },
      parameters: {
        epochLength: 21600,
        slotLength: 20,
        safeZone: 4320,
      },
    },
    {
      start: {
        time: 1728000,
        slot: 86400,
        epoch: 4,
      },
      end: {
        time: 2160000,
        slot: 518400,
        epoch: 5,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 2160000,
        slot: 518400,
        epoch: 5,
      },
      end: {
        time: 2592000,
        slot: 950400,
        epoch: 6,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 2592000,
        slot: 950400,
        epoch: 6,
      },
      end: {
        time: 3024000,
        slot: 1382400,
        epoch: 7,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 3024000,
        slot: 1382400,
        epoch: 7,
      },
      end: {
        time: 5184000,
        slot: 3542400,
        epoch: 12,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
    {
      start: {
        time: 5184000,
        slot: 3542400,
        epoch: 12,
      },
      end: {
        time: 15120000,
        slot: 13478400,
        epoch: 35,
      },
      parameters: {
        epochLength: 432000,
        slotLength: 1,
        safeZone: 129600,
      },
    },
  ],
};
