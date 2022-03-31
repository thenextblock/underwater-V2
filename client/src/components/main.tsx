import React, { FunctionComponent, useState } from "react";
import { Button } from "react-bootstrap";

// our components props accept a number for the initial value
export const Counter: FunctionComponent<{ initial?: number }> = ({ initial = 0 }) => {
  const [clicks, setClicks] = useState(initial);

  return (
    <>
      <p>Clicks: {clicks}</p>

      <Button variant="primary" onClick={() => setClicks(clicks + 1)}>
        +
      </Button>

      <br />
      <Button variant="secondary" onClick={() => setClicks(clicks - 1)}>
        +
      </Button>
    </>
  );
};
