import React, { FunctionComponent } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AccountSnapshot } from "../components/AccountSnapshot";

export const AccountPage: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  return (
    <div className="App">
      <h3>Account Details </h3>
      <AccountSnapshot />
    </div>
  );
};
