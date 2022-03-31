import React, { FunctionComponent } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

export const HomePage: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  return (
    <div className="App">
      <h1>Home !!! </h1>
    </div>
  );
};
