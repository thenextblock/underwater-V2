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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface MaximillionInterface extends ethers.utils.Interface {
  functions: {
    "cEther()": FunctionFragment;
    "repayBehalf(address)": FunctionFragment;
    "repayBehalfExplicit(address,address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "cEther", values?: undefined): string;
  encodeFunctionData(functionFragment: "repayBehalf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "repayBehalfExplicit",
    values: [string, string]
  ): string;

  decodeFunctionResult(functionFragment: "cEther", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "repayBehalf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "repayBehalfExplicit",
    data: BytesLike
  ): Result;

  events: {};
}

export class Maximillion extends BaseContract {
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

  interface: MaximillionInterface;

  functions: {
    cEther(overrides?: CallOverrides): Promise<[string]>;

    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    repayBehalfExplicit(
      borrower: string,
      cEther_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  cEther(overrides?: CallOverrides): Promise<string>;

  repayBehalf(
    borrower: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  repayBehalfExplicit(
    borrower: string,
    cEther_: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    cEther(overrides?: CallOverrides): Promise<string>;

    repayBehalf(borrower: string, overrides?: CallOverrides): Promise<void>;

    repayBehalfExplicit(
      borrower: string,
      cEther_: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    cEther(overrides?: CallOverrides): Promise<BigNumber>;

    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    repayBehalfExplicit(
      borrower: string,
      cEther_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cEther(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    repayBehalf(
      borrower: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    repayBehalfExplicit(
      borrower: string,
      cEther_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
