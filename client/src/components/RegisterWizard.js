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
      pageContent = (
        <div className="wizard-container">
          <div className="wizard-question">
            <div>{dictio.email[props.language]}</div>
            <input />
          </div>
          <div className="wizard-question">
            <div>username firstname last name</div>
            <input />
          </div>
        </div>
      );
    } else if (props.wizardPage === 1) {
      pageContent = (
        <div className="wizard-container">
          <div className="wizard-question">
            <div>{dictio.password[props.language]}</div>
            <input />
          </div>
          <div className="wizard-question">
            <div>{dictio.confirmation[props.language]}</div>
            <input />
          </div>
        </div>
      );
    } else if (props.wizardPage === 2) {
      pageContent = (
        <div className="wizard-container">
          <div>
            <h2>{dictio.platForm[props.language]}</h2>
          </div>
          <div className="wizard-question">
            <div>{dictio.email[props.language]}</div>
            <input />
          </div>
          <div className="wizard-question">
            <div>username firstname last name</div>
            <input />
          </div>
        </div>
      );
    }

    return pageContent;
  };

  return (
    <div>
      {showPageContent()}
      <div>
        <button onClick={next} className="next-button  next">
          {dictio.next[props.language]}
        </button>
      </div>
    </div>
  );
}
