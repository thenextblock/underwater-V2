import React, { FunctionComponent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { IAccountSnapshot, IAccountRowSnapshot } from "./types";
import axios from "axios";
import NumberFormat from "react-number-format";

const API_URL = process.env.REACT_APP_API_URL;

export const AccountSnapshot: FunctionComponent<{
  snapShotData?: IAccountSnapshot[];
}> = ({ snapShotData = [] }) => {
  const { id, block } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [accounSnapshotData, setAccountSnapshotData] = useState<
    IAccountSnapshot[]
  >([]);

  const [accounyRowSnapshotData, setAccounyRowSnapshotData] = useState<
    IAccountRowSnapshot[]
  >([]);

  const fetchAccountSnapshot = async (account: string, blockNumber: string) => {
    const result = await axios(`${API_URL}/snapshot/${blockNumber}/${account}`);
    setAccountSnapshotData(result.data.data);
  };

  // const fetchAccountRowSnapshot = async (
  //   account: string,
  //   blockNumber: string
  // ) => {
  //   const result = await axios(
  //     `${API_URL}/snapshot/row/${blockNumber}/${account}`
  //   );
  //   setAccounyRowSnapshotData(result.data.data);
  // };

  useEffect(() => {
    if (id && block) {
      fetchAccountSnapshot(id, block);
      // fetchAccountRowSnapshot(id, block);
    }
    setLoading(false);
  }, [id, block]);

  if (loading) {
    return <p>Loading ... </p>;
  }

  return (
    <>
      <p>
        Account Snapshot:{" "}
        <a
          href={"https://etherscan.io/address/" + id}
          target="_blank"
          rel="noopener noreferrer"
        >
          {id}
        </a>
      </p>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Market</th>
            <th>market Symbol</th>
            <th>Collateral *USD</th>
            <th>Borrow *USD</th>

            <th>Collateral(row)</th>
            <th>Borrow (row)</th>
          </tr>
        </thead>
        <tbody>
          {accounSnapshotData.map((item, id) => (
            <tr key={item.account}>
              <td>{id + 1}</td>
              <td>
                <a
                  href={"https://etherscan.io/address/" + item.market}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.market}
                </a>
              </td>
              <td>{item.marketsymbol}</td>
              <td>
                <NumberFormat
                  value={item.collateral}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={""}
                />
              </td>
              <td>
                <NumberFormat
                  value={item.borrow}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={""}
                />
              </td>
              <td>{"-"}</td>
              <td>{"-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <p>Row Data</p>
      <hr />
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Market</th>
            <th>market Symbol</th>
            <th>Ctoken Balance</th>
            <th>Exchange Rate(compound)</th>
            <th>Oracle Price</th>
            <th>Collateral Factor</th>
          </tr>
        </thead>
        <tbody>
          {accounyRowSnapshotData.map((item, id) => (
            <tr key={item.account}>
              <td>{id + 1}</td>
              <a
                href={"https://etherscan.io/address/" + item.market}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.market}
              </a>
              <td>{item.marketsymbol}</td>
              <td>{item.cTokenBalance}</td>
              <td>{item.exchangeRateMantissa}</td>
              <td>{item.oraclePriceMantissa}</td>
              <td>{item.collateralFactor}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </>
  );
};
