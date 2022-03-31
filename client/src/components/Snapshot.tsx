import React, { FunctionComponent, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { ISnapshot } from "./types";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const Snapshot: FunctionComponent<{ _blockNumber?: number }> = ({
  _blockNumber = 0,
}) => {
  const { blocknumber } = useParams();
  console.log("SNAPSHOT: ", blocknumber);

  const [loading, setLoading] = useState<boolean>(false);
  const [snapshotData, setSnapshotData] = useState<ISnapshot[]>([]);

  const fetchSnapshoData = async (blockNumber: string) => {
    const response = await axios.get(`${API_URL}/snapshot/${blockNumber}`);
    setSnapshotData(response.data.data);
  };

  useEffect(() => {
    if (blocknumber) {
      fetchSnapshoData(blocknumber);
    }
    setLoading(false);
  }, [blocknumber]);

  if (loading) {
    return <p>Loading ... </p>;
  }

  return (
    <>
      <p>Snapshot Data ...</p>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <td>Block Number</td>
            <td>Account</td>
            <td>Total Collateral</td>
            <td>Total Borrow</td>
          </tr>
        </thead>
        <tbody>
          {snapshotData.map((item) => (
            <tr key={item.account}>
              <td>{item.blocknumber}</td>
              <td>
                <Link to={`/account/${item.blocknumber}/${item.account}`}>
                  {item.account}
                </Link>
              </td>
              <td>{item.totalcollateral}</td>
              <td>{item.totalborrow}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
