import React, { FunctionComponent } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

export const MevPage: FunctionComponent<{ initial?: number }> = ({
  initial = 0,
}) => {
  return (
    <div className="App">
      <h1>MevPage ... </h1>
    </div>
  );
};
