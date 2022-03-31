import React, { FunctionComponent } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

export const BlockPage: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  return (
    <div className="App">
      <h1>Block Page !!! </h1>
    </div>
  );
};
