/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.9
  Forc version: 0.64.0
  Fuel-Core version: 0.36.0
*/

import { Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  AbstractAddress,
  BigNumberish,
  BN,
  FunctionFragment,
  InvokeFunction,
} from 'fuels';

import type { Enum, Result } from "./common";

export enum ErrorInput { VrfRequestFailed = 'VrfRequestFailed', RoundIsInProgres = 'RoundIsInProgres', InsufficientBalance = 'InsufficientBalance', RandomnessRequestNotFound = 'RandomnessRequestNotFound', AmountMustBeGreaterThanZero = 'AmountMustBeGreaterThanZero', GamblePoolExceeded = 'GamblePoolExceeded' };
export enum ErrorOutput { VrfRequestFailed = 'VrfRequestFailed', RoundIsInProgres = 'RoundIsInProgres', InsufficientBalance = 'InsufficientBalance', RandomnessRequestNotFound = 'RandomnessRequestNotFound', AmountMustBeGreaterThanZero = 'AmountMustBeGreaterThanZero', GamblePoolExceeded = 'GamblePoolExceeded' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type DepositLogEventInput = { identifier: IdentityInput, amount: BigNumberish, asset_id: AssetIdInput };
export type DepositLogEventOutput = { identifier: IdentityOutput, amount: BN, asset_id: AssetIdOutput };

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "enum error::Error",
      "concreteTypeId": "98ba681212c5293b46b67c3ecb774e0a2e3d324008580c35fc533e1c1a762d7e",
      "metadataTypeId": 1
    },
    {
      "type": "enum std::result::Result<(),enum error::Error>",
      "concreteTypeId": "47d526bb28c49cc34ef6e1af01ecff7688d9d66974ca3696d69ebcefc42419ef",
      "metadataTypeId": 3,
      "typeArguments": [
        "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
        "98ba681212c5293b46b67c3ecb774e0a2e3d324008580c35fc533e1c1a762d7e"
      ]
    },
    {
      "type": "struct DepositLogEvent",
      "concreteTypeId": "3201a119c76261e2a66d7afef95e4f952900c848101bf63399058332ebb3e47e",
      "metadataTypeId": 6
    },
    {
      "type": "u64",
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    }
  ],
  "metadataTypes": [
    {
      "type": "b256",
      "metadataTypeId": 0
    },
    {
      "type": "enum error::Error",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "VrfRequestFailed",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "RoundIsInProgres",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "InsufficientBalance",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "RandomnessRequestNotFound",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AmountMustBeGreaterThanZero",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "GamblePoolExceeded",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "Address",
          "typeId": 7
        },
        {
          "name": "ContractId",
          "typeId": 9
        }
      ]
    },
    {
      "type": "enum std::result::Result",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "Ok",
          "typeId": 5
        },
        {
          "name": "Err",
          "typeId": 4
        }
      ],
      "typeParameters": [
        5,
        4
      ]
    },
    {
      "type": "generic E",
      "metadataTypeId": 4
    },
    {
      "type": "generic T",
      "metadataTypeId": 5
    },
    {
      "type": "struct DepositLogEvent",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "identifier",
          "typeId": 2
        },
        {
          "name": "amount",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "asset_id",
          "typeId": 8
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 7,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::asset_id::AssetId",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "bits",
          "typeId": 0
        }
      ]
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "deposit",
      "output": "47d526bb28c49cc34ef6e1af01ecff7688d9d66974ca3696d69ebcefc42419ef",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_gamble_pool",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_stake_pool",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "amount",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "withdraw",
      "output": "47d526bb28c49cc34ef6e1af01ecff7688d9d66974ca3696d69ebcefc42419ef",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "3603338308964475362",
      "concreteTypeId": "3201a119c76261e2a66d7afef95e4f952900c848101bf63399058332ebb3e47e"
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const storageSlots: StorageSlot[] = [
  {
    "key": "f39a611259c060a61501a6cade7445631862814bdca8bb73c160d7f14995a10d",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class LudiContractInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    deposit: FunctionFragment;
    get_gamble_pool: FunctionFragment;
    get_stake_pool: FunctionFragment;
    withdraw: FunctionFragment;
  };
}

export class LudiContract extends Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: LudiContractInterface;
  declare functions: {
    deposit: InvokeFunction<[], Result<void, ErrorOutput>>;
    get_gamble_pool: InvokeFunction<[], BN>;
    get_stake_pool: InvokeFunction<[], BN>;
    withdraw: InvokeFunction<[amount: BigNumberish], Result<void, ErrorOutput>>;
  };

  constructor(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
