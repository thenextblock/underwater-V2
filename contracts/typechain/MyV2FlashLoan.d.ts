/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface MyV2FlashLoanInterface extends ethers.utils.Interface {
  functions: {
    "ADDRESSES_PROVIDER()": FunctionFragment;
    "LENDING_POOL()": FunctionFragment;
    "executeOperation(address[],uint256[],uint256[],address,bytes)": FunctionFragment;
    "factory()": FunctionFragment;
    "myFlashLoanCall(address,uint256,address,address)": FunctionFragment;
    "uniswapRouter()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ADDRESSES_PROVIDER",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "LENDING_POOL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "executeOperation",
    values: [string[], BigNumberish[], BigNumberish[], string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "myFlashLoanCall",
    values: [string, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapRouter",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "ADDRESSES_PROVIDER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "LENDING_POOL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "myFlashLoanCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapRouter",
    data: BytesLike
  ): Result;

  events: {};
}

export class MyV2FlashLoan extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MyV2FlashLoanInterface;

  functions: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<[string]>;

    LENDING_POOL(overrides?: CallOverrides): Promise<[string]>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    myFlashLoanCall(
      _borrower: string,
      _repayAmount: BigNumberish,
      _cTokenRepay: string,
      _cTokenCollateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapRouter(overrides?: CallOverrides): Promise<[string]>;
  };

  ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>;

  LENDING_POOL(overrides?: CallOverrides): Promise<string>;

  executeOperation(
    assets: string[],
    amounts: BigNumberish[],
    premiums: BigNumberish[],
    initiator: string,
    params: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  factory(overrides?: CallOverrides): Promise<string>;

  myFlashLoanCall(
    _borrower: string,
    _repayAmount: BigNumberish,
    _cTokenRepay: string,
    _cTokenCollateral: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapRouter(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>;

    LENDING_POOL(overrides?: CallOverrides): Promise<string>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: string,
      params: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    factory(overrides?: CallOverrides): Promise<string>;

    myFlashLoanCall(
      _borrower: string,
      _repayAmount: BigNumberish,
      _cTokenRepay: string,
      _cTokenCollateral: string,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapRouter(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;

    LENDING_POOL(overrides?: CallOverrides): Promise<BigNumber>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    myFlashLoanCall(
      _borrower: string,
      _repayAmount: BigNumberish,
      _cTokenRepay: string,
      _cTokenCollateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapRouter(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ADDRESSES_PROVIDER(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    LENDING_POOL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    executeOperation(
      assets: string[],
      amounts: BigNumberish[],
      premiums: BigNumberish[],
      initiator: string,
      params: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    myFlashLoanCall(
      _borrower: string,
      _repayAmount: BigNumberish,
      _cTokenRepay: string,
      _cTokenCollateral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
