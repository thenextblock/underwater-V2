import React, { FunctionComponent, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { IMarket } from "./types";

export const Markets: FunctionComponent<{ marketData: IMarket[] }> = ({
  marketData = [],
}) => {
  return (
    <>
      <p>Market Data ....</p>
      <Table striped bordered hover size="sm">
        <tbody>
          {marketData.map((item) => (
            <tr key={item.id}>
              <td>{item.blockNumber}</td>
              <td>{item.marketsymbol}</td>
              <td>{item.market}</td>
              <td>{item.oraclePriceMantissa.toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
