/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { AccountInfo, AccountInfoInterface } from "../AccountInfo";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "comptroller_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newComptroller",
        type: "address",
      },
    ],
    name: "changeComptroller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "comptroller",
    outputs: [
      {
        internalType: "contract IComptroller",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "getLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "error",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrows",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract PriceOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610af3380380610af383398101604081905261002f916100f4565b600080546001600160a01b0319166001600160a01b038316908117909155604080516307dc0d1d60e41b81529051637dc0d1d0916004808201926020929091908290030181865afa158015610088573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100ac91906100f4565b600180546001600160a01b03929092166001600160a01b0319928316179055600280549091163317905550610118565b6001600160a01b03811681146100f157600080fd5b50565b60006020828403121561010657600080fd5b8151610111816100dc565b9392505050565b6109cc806101276000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80634c6ee1161461005c5780635fe3b567146100715780637dc0d1d0146100a1578063a747b93b146100b4578063f851a440146100e2575b600080fd5b61006f61006a366004610700565b6100f5565b005b600054610084906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b600154610084906001600160a01b031681565b6100c76100c2366004610700565b610163565b60408051938452602084019290925290820152606001610098565b600254610084906001600160a01b031681565b6002546001600160a01b031633146101415760405162461bcd60e51b815260206004820152600a60248201526927b7363c9020b236b4b760b11b60448201526064015b60405180910390fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000806000610170610646565b60008054604051632aff3bff60e21b81526001600160a01b03888116600483015292965086955085945084928392169063abfceffc90602401600060405180830381865afa1580156101c6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101ee9190810190610743565b905060005b815181101561046d57600082828151811061021057610210610808565b60209081029190910101516040516361bfb47160e11b81526001600160a01b038b811660048301529192509082169063c37f68e290602401608060405180830381865afa158015610265573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610289919061081e565b608089015260608801526040870152935083156102b55760008060009750975097505050505050610480565b60008054604051638e8f294b60e01b81526001600160a01b03848116600483015290911690638e8f294b90602401606060405180830381865afa158015610300573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103249190610864565b50604080516020808201835283825260c08b01919091528151908101825260808a0151815260e08a0152600154905163fc57d4df60e01b81526001600160a01b0386811660048301529294509116915063fc57d4df90602401602060405180830381865afa15801561039a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103be91906108a0565b60a087018190526000036103e2576001600080985098509850505050505050610480565b604080516020810190915260a0870151815261010087015260c086015160e087015161041c9161041191610487565b876101000151610487565b6101208701819052604087015187516104369291906104cf565b8652610100860151606087015160208801516104539291906104cf565b602087015250819050610465816108cf565b9150506101f3565b5082600001519450826020015193505050505b9193909250565b6040805160208101909152600081526040518060200160405280670de0b6b3a76400006104bc866000015186600001516104fb565b6104c691906108e8565b90529392505050565b6000806104dc858561053d565b90506104f06104ea82610565565b84610583565b9150505b9392505050565b60006104f483836040518060400160405280601781526020017f6d756c7469706c69636174696f6e206f766572666c6f770000000000000000008152506105b9565b60408051602081019091526000815260405180602001604052806104c68560000151856104fb565b805160009061057d90670de0b6b3a7640000906108e8565b92915050565b60006104f48383604051806040016040528060118152602001706164646974696f6e206f766572666c6f7760781b815250610615565b60008315806105c6575082155b156105d3575060006104f4565b60006105df848661090a565b9050836105ec86836108e8565b14839061060c5760405162461bcd60e51b81526004016101389190610929565b50949350505050565b600080610622848661097e565b9050828582101561060c5760405162461bcd60e51b81526004016101389190610929565b6040518061014001604052806000815260200160008152602001600081526020016000815260200160008152602001600081526020016106926040518060200160405280600081525090565b81526020016106ad6040518060200160405280600081525090565b81526020016106c86040518060200160405280600081525090565b81526020016106e36040518060200160405280600081525090565b905290565b6001600160a01b03811681146106fd57600080fd5b50565b60006020828403121561071257600080fd5b81356104f4816106e8565b634e487b7160e01b600052604160045260246000fd5b805161073e816106e8565b919050565b6000602080838503121561075657600080fd5b825167ffffffffffffffff8082111561076e57600080fd5b818501915085601f83011261078257600080fd5b8151818111156107945761079461071d565b8060051b604051601f19603f830116810181811085821117156107b9576107b961071d565b6040529182528482019250838101850191888311156107d757600080fd5b938501935b828510156107fc576107ed85610733565b845293850193928501926107dc565b98975050505050505050565b634e487b7160e01b600052603260045260246000fd5b6000806000806080858703121561083457600080fd5b505082516020840151604085015160609095015191969095509092509050565b8051801515811461073e57600080fd5b60008060006060848603121561087957600080fd5b61088284610854565b92506020840151915061089760408501610854565b90509250925092565b6000602082840312156108b257600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b6000600182016108e1576108e16108b9565b5060010190565b60008261090557634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615610924576109246108b9565b500290565b600060208083528351808285015260005b818110156109565785810183015185820160400152820161093a565b81811115610968576000604083870101525b50601f01601f1916929092016040019392505050565b60008219821115610991576109916108b9565b50019056fea2646970667358221220020d276872314c726752691a1a4b93e2f49b3f64216333f3a5d1e4493727acb464736f6c634300080d0033";

export class AccountInfo__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    comptroller_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AccountInfo> {
    return super.deploy(comptroller_, overrides || {}) as Promise<AccountInfo>;
  }
  getDeployTransaction(
    comptroller_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(comptroller_, overrides || {});
  }
  attach(address: string): AccountInfo {
    return super.attach(address) as AccountInfo;
  }
  connect(signer: Signer): AccountInfo__factory {
    return super.connect(signer) as AccountInfo__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AccountInfoInterface {
    return new utils.Interface(_abi) as AccountInfoInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AccountInfo {
    return new Contract(address, _abi, signerOrProvider) as AccountInfo;
  }
}
