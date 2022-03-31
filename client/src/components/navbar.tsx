import React, { FunctionComponent, useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export const HeaderMenu: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar>Navbar</Navbar>
          <Nav className="me-auto">
            <Nav.Link href="#home">
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link href="#blocks">
              <Link to="/blocks">Block Page</Link>
            </Nav.Link>
            <Nav.Link href="#mev">
              <Link to="/mev">Mev Page</Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
