import React, { useState } from "react";
import { Button } from "@material-ui/core";

export default function InteractiveList(props) {
  const [state, setState] = useState({
    bruh: true,
    fame: 10,
    failed: ["once", "twice"],
    mynigga: { name: "james", age: 10 }
  });

  let bruh = () => {
    console.log("before", state);

    setState({
      ...state,
      bruh: "oh shittt",
      fame: 69,
      mynigga: { ...state.mynigga, sex: true }
    });
    console.log("bruh");
    console.log("after", state.mynigga);
  };

  return (
    <div>
      bruh this is a goddamn test
      <Button onClick={bruh}>bruh my</Button>
    </div>
  );
}
