import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { HomePage, BlockPage, MevPage, AccountPage } from "./pages/index";
import { Col, Container, Row } from "react-bootstrap";
import { Counter, HeaderMenu, Blocks, Markets } from "./components/index";

export default function App() {
  return (
    <>
      <HeaderMenu />
      <Container fluid>
        <Routes>
          <Route path="/" element={<Blocks />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/blocks/:blocknumber" element={<Blocks />} />
          <Route path="/mev" element={<MevPage />} />
          <Route path="/account/:block/:id" element={<AccountPage />} />
        </Routes>
      </Container>
    </>
  );
}
