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

interface SimplePriceOracleInterface extends ethers.utils.Interface {
  functions: {
    "assetPrices(address)": FunctionFragment;
    "getUnderlyingPrice(address)": FunctionFragment;
    "isPriceOracle()": FunctionFragment;
    "setDirectPrice(address,uint256)": FunctionFragment;
    "setUnderlyingPrice(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "assetPrices", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getUnderlyingPrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isPriceOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDirectPrice",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setUnderlyingPrice",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "assetPrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnderlyingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPriceOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDirectPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUnderlyingPrice",
    data: BytesLike
  ): Result;

  events: {
    "PricePosted(address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PricePosted"): EventFragment;
}

export type PricePostedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber] & {
    asset: string;
    previousPriceMantissa: BigNumber;
    requestedPriceMantissa: BigNumber;
    newPriceMantissa: BigNumber;
  }
>;

export class SimplePriceOracle extends BaseContract {
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

  interface: SimplePriceOracleInterface;

  functions: {
    assetPrices(asset: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isPriceOracle(overrides?: CallOverrides): Promise<[boolean]>;

    setDirectPrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setUnderlyingPrice(
      cToken: string,
      underlyingPriceMantissa: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  assetPrices(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

  getUnderlyingPrice(
    cToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isPriceOracle(overrides?: CallOverrides): Promise<boolean>;

  setDirectPrice(
    asset: string,
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setUnderlyingPrice(
    cToken: string,
    underlyingPriceMantissa: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    assetPrices(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isPriceOracle(overrides?: CallOverrides): Promise<boolean>;

    setDirectPrice(
      asset: string,
      price: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setUnderlyingPrice(
      cToken: string,
      underlyingPriceMantissa: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "PricePosted(address,uint256,uint256,uint256)"(
      asset?: null,
      previousPriceMantissa?: null,
      requestedPriceMantissa?: null,
      newPriceMantissa?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        asset: string;
        previousPriceMantissa: BigNumber;
        requestedPriceMantissa: BigNumber;
        newPriceMantissa: BigNumber;
      }
    >;

    PricePosted(
      asset?: null,
      previousPriceMantissa?: null,
      requestedPriceMantissa?: null,
      newPriceMantissa?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        asset: string;
        previousPriceMantissa: BigNumber;
        requestedPriceMantissa: BigNumber;
        newPriceMantissa: BigNumber;
      }
    >;
  };

  estimateGas: {
    assetPrices(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isPriceOracle(overrides?: CallOverrides): Promise<BigNumber>;

    setDirectPrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setUnderlyingPrice(
      cToken: string,
      underlyingPriceMantissa: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    assetPrices(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUnderlyingPrice(
      cToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isPriceOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setDirectPrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setUnderlyingPrice(
      cToken: string,
      underlyingPriceMantissa: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
