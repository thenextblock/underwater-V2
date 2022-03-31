import React, { FunctionComponent, useState, useEffect } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import axios from "axios";
import { Markets } from "./Markets";
import { IMarket, ISnapshot } from "./types";
import { Snapshot } from "./Snapshot";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

interface Block {
  blocknumber: number;
}

export const Blocks: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [marketData, setMarketData] = useState<IMarket[]>([]);
  const [data, setData] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number>();
  const [snapshotData, setSnapshotData] = useState<ISnapshot[]>([]);

  const fetrchBlocks = async () => {
    const result = await axios(`${API_URL}/blocks`);
    console.log(result.data.data);
    setData(result.data.data);
  };

  const setBlock = async (blockNumber: number) => {
    // console.log("Block Selected : ", blockNumber);
    // setSelectedBlock(blockNumber);
    // fetchMarketData(blockNumber); // This loads Market Prices and data
    // fetchSnapshoData(blockNumber);
  };

  // const fetchSnapshoData = async (blockNumber: number) => {
  //   const response = await axios.get(`${API_URL}/snapshot/${blockNumber}`);
  //   setSnapshotData(response.data.data);
  // };

  // const fetchMarketData = async (blockNumber: number) => {
  //   const marketResponse = await axios.get(`${API_URL}/blocks/${blockNumber}`);
  //   setMarketData(marketResponse.data.data);
  // };

  useEffect(() => {
    fetrchBlocks();
    setLoading(false);
  }, []);

  if (loading) {
    return <>Loading ....</>;
  }

  return (
    <>
      <hr />
      <Button onClick={() => fetrchBlocks()} variant="primary">
        Blocks
      </Button>{" "}
      <Row>
        <Col sm={1}>
          <Table striped bordered hover size="sm">
            <tbody>
              {data.map((item) => (
                <tr key={item.blocknumber.toString()}>
                  <td>
                    {" "}
                    <Link to={`/blocks/${item.blocknumber}`}>
                      {item.blocknumber}
                    </Link>
                    {/* <Button
                      onClick={() => setBlock(item.blockNumber)}
                      variant="link"
                    >
                      {item.blockNumber}
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col sm={11}>
          {" "}
          {/* <Markets marketData={marketData} /> {" "} */}
          <Snapshot />
        </Col>
      </Row>
      <hr />
    </>
  );
};
