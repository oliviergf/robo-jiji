import React from "react";
import Register from "./components/Register";
import "./App.css";

function App() {
  function handleClick(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }

  return (
    <div className="App">
      bonjour hi!
      <Register />
    </div>
  );
}

export default App;
