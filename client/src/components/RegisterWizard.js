import React, { useState } from "react";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";

export default function Home(props) {
  const [state, setState] = React.useState({
    page: false,
  });

  const next = () => {
    props.nextPage();
  };

  const showPageContent = () => {
    return <div>Hello c,est quoi ton email</div>;
  };

  return (
    <div className="home-container">
      {showPageContent()}
      <div>
        <button onClick={next} className="check-in-button">
          {dictio.next[props.language]}
        </button>
      </div>
    </div>
  );
}
