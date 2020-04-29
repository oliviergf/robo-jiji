import React, { useState } from "react";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";

export default function Home(props) {
  const [state, setState] = React.useState({
    email: false,
  });

  const next = () => {
    props.nextPage();
  };

  const showPageContent = () => {
    let pageContent;
    if (props.wizardPage === 0) {
      pageContent = <div>Hello c,est quoi ton email</div>;
    } else if (props.wizardPage === 1) {
      pageContent = <div>sucks</div>;
    } else if (props.wizardPage === 2) {
      pageContent = <div>ass</div>;
    }

    return pageContent;
  };

  return (
    <div className="wizard-container">
      {showPageContent()}
      <div>
        <button onClick={next} className="check-in-button next">
          {dictio.next[props.language]}
        </button>
      </div>
    </div>
  );
}
