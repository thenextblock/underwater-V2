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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IComptrollerInterface extends ethers.utils.Interface {
  functions: {
    "getAssetsIn(address)": FunctionFragment;
    "markets(address)": FunctionFragment;
    "oracle()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getAssetsIn", values: [string]): string;
  encodeFunctionData(functionFragment: "markets", values: [string]): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getAssetsIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "markets", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;

  events: {};
}

export class IComptroller extends BaseContract {
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

  interface: IComptrollerInterface;

  functions: {
    getAssetsIn(
      account: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    markets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, boolean] & {
        isListed: boolean;
        collateralFactorMantissa: BigNumber;
        isComped: boolean;
      }
    >;

    oracle(overrides?: CallOverrides): Promise<[string]>;
  };

  getAssetsIn(account: string, overrides?: CallOverrides): Promise<string[]>;

  markets(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, boolean] & {
      isListed: boolean;
      collateralFactorMantissa: BigNumber;
      isComped: boolean;
    }
  >;

  oracle(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getAssetsIn(account: string, overrides?: CallOverrides): Promise<string[]>;

    markets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, boolean] & {
        isListed: boolean;
        collateralFactorMantissa: BigNumber;
        isComped: boolean;
      }
    >;

    oracle(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getAssetsIn(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    markets(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getAssetsIn(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    markets(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}