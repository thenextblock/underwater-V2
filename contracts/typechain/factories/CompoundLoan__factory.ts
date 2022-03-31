/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CompoundLoan, CompoundLoanInterface } from "../CompoundLoan";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_comptroller",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_cToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_borrowAmount",
        type: "uint256",
      },
    ],
    name: "borrowAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "comptroller",
    outputs: [
      {
        internalType: "contract ComptrollerInterface",
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
        internalType: "address[]",
        name: "_cTokens",
        type: "address[]",
      },
    ],
    name: "enterMarkets",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_cToken",
        type: "address",
      },
    ],
    name: "getContractCTokenBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        internalType: "address",
        name: "_cTokenRepay",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_repayAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_cTokenCollateral",
        type: "address",
      },
    ],
    name: "liquidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600080546001600160a01b031916734ddc2d193948926d02f9b1fe9e1daa0718270ed517905534801561003657600080fd5b50604051610acf380380610acf8339818101604052602081101561005957600080fd5b5051600180546001600160a01b0319166001600160a01b03909216919091179055610a46806100896000396000f3fe60806040526004361061004a5760003560e01c80630f07645a1461004f5780633de2f6b21461008a578063513a7bdd146100d35780635fe3b56714610118578063c299823814610149575b600080fd5b34801561005b57600080fd5b506100886004803603604081101561007257600080fd5b506001600160a01b0381351690602001356101ec565b005b34801561009657600080fd5b50610088600480360360808110156100ad57600080fd5b506001600160a01b038135811691602081013582169160408201359160600135166101fc565b3480156100df57600080fd5b50610106600480360360208110156100f657600080fd5b50356001600160a01b03166102c1565b60408051918252519081900360200190f35b34801561012457600080fd5b5061012d610344565b604080516001600160a01b039092168252519081900360200190f35b6100886004803603602081101561015f57600080fd5b81019060208101813564010000000081111561017a57600080fd5b82018360208201111561018c57600080fd5b803590602001918460208302840111640100000000831117156101ae57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610353945050505050565b6101f6828261050e565b50505050565b600080610209858561050e565b90925090506102226001600160a01b0383168683610619565b60408051637af1e23160e11b81526001600160a01b038881166004830152602482018790528581166044830152915160009288169163f5e3c46291606480830192602092919082900301818787803b15801561027d57600080fd5b505af1158015610291573d6000803e3d6000fd5b505050506040513d60208110156102a757600080fd5b5051905060006102b685610731565b505050505050505050565b6000816001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561031057600080fd5b505afa158015610324573d6000803e3d6000fd5b505050506040513d602081101561033a57600080fd5b505190505b919050565b6001546001600160a01b031681565b600154604051631853304760e31b81526020600482018181528451602484015284516001600160a01b039094169363c29982389386938392604490920191818601910280838360005b838110156103b457818101518382015260200161039c565b5050505090500192505050600060405180830381600087803b1580156103d957600080fd5b505af11580156103ed573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052602081101561041657600080fd5b810190808051604051939291908464010000000082111561043657600080fd5b90830190602082018581111561044b57600080fd5b825186602082028301116401000000008211171561046857600080fd5b82525081516020918201928201910280838360005b8381101561049557818101518382015260200161047d565b5050505090500160405250505050806000815181106104b057fe5b60200260200101516001600160a01b0316631249c58b346040518263ffffffff1660e01b81526004016000604051808303818588803b1580156104f257600080fd5b505af1158015610506573d6000803e3d6000fd5b505050505050565b600080836001600160a01b031663c5ebeaec846040518263ffffffff1660e01b815260040180828152602001915050602060405180830381600087803b15801561055757600080fd5b505af115801561056b573d6000803e3d6000fd5b505050506040513d602081101561058157600080fd5b506000905061058f85610731565b90506000816001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156105e057600080fd5b505afa1580156105f4573d6000803e3d6000fd5b505050506040513d602081101561060a57600080fd5b50519196919550909350505050565b80158061069f575060408051636eb1769f60e11b81523060048201526001600160a01b03848116602483015291519185169163dd62ed3e91604480820192602092909190829003018186803b15801561067157600080fd5b505afa158015610685573d6000803e3d6000fd5b505050506040513d602081101561069b57600080fd5b5051155b6106da5760405162461bcd60e51b81526004018080602001828103825260368152602001806109db6036913960400191505060405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b17905261072c9084906107bc565b505050565b600080546001600160a01b03838116911614156107505750600061033f565b816001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b15801561078957600080fd5b505afa15801561079d573d6000803e3d6000fd5b505050506040513d60208110156107b357600080fd5b5051905061033f565b6107ce826001600160a01b0316610974565b61081f576040805162461bcd60e51b815260206004820152601f60248201527f5361666545524332303a2063616c6c20746f206e6f6e2d636f6e747261637400604482015290519081900360640190fd5b60006060836001600160a01b0316836040518082805190602001908083835b6020831061085d5780518252601f19909201916020918201910161083e565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146108bf576040519150601f19603f3d011682016040523d82523d6000602084013e6108c4565b606091505b50915091508161091b576040805162461bcd60e51b815260206004820181905260248201527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564604482015290519081900360640190fd5b8051156101f65780806020019051602081101561093757600080fd5b50516101f65760405162461bcd60e51b815260040180806020018281038252602a8152602001806109b1602a913960400191505060405180910390fd5b6000813f7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4708181148015906109a857508115155b94935050505056fe5361666545524332303a204552433230206f7065726174696f6e20646964206e6f7420737563636565645361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f20746f206e6f6e2d7a65726f20616c6c6f77616e6365a2646970667358221220de6c0f09ff5b4051768b15d4a0fa6e8436d35de04981c38848ca937bec17776b64736f6c634300060c0033";

export class CompoundLoan__factory extends ContractFactory {
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
    _comptroller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CompoundLoan> {
    return super.deploy(_comptroller, overrides || {}) as Promise<CompoundLoan>;
  }
  getDeployTransaction(
    _comptroller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_comptroller, overrides || {});
  }
  attach(address: string): CompoundLoan {
    return super.attach(address) as CompoundLoan;
  }
  connect(signer: Signer): CompoundLoan__factory {
    return super.connect(signer) as CompoundLoan__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CompoundLoanInterface {
    return new utils.Interface(_abi) as CompoundLoanInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CompoundLoan {
    return new Contract(address, _abi, signerOrProvider) as CompoundLoan;
  }
}