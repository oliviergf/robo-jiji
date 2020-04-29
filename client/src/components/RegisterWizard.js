import React, { useState } from "react";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";

export default function Home(props) {
  const [state, setState] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmation: "",
    platForm: "apple",
    telephoneNumber: "",
  });

  const next = () => {
    props.nextPage();
  };

  const install = () => {
    console.log(state);
    console.log("installin");
  };

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };
  const showWizardPageContent = () => {
    let pageContent;
    if (props.wizardPage === 0) {
      pageContent = (
        <div className="wizard-container">
          <div className="wizard-question">
            <div>{dictio.email[props.language]}</div>
            <input value={state.email} name="email" onChange={handleChange} />
          </div>
          <div className="wizard-question">
            <div>username firstname last name</div>
            <input
              value={state.username}
              name="username"
              onChange={handleChange}
            />
          </div>
        </div>
      );
    } else if (props.wizardPage === 1) {
      pageContent = (
        <div className="wizard-container">
          <div className="wizard-question">
            <div>{dictio.password[props.language]}</div>
            <input
              value={state.password}
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="wizard-question">
            <div>{dictio.confirmation[props.language]}</div>
            <input
              value={state.confirmation}
              name="confirmation"
              onChange={handleChange}
            />
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
            <div>whats ur platfome dude</div>
            <input type="radio" onChange={handleChange} />
            <input type="radio" onChange={handleChange} />
          </div>
          <div className="wizard-question">
            <div>{dictio.telephoneNumber[props.language]}</div>
            <input
              value={state.telephoneNumber}
              name="telephoneNumber"
              onChange={handleChange}
            />
          </div>
        </div>
      );
    } else if (props.wizardPage === 3) {
      pageContent = (
        <div className="wizard-container">
          <div>
            <h2>{dictio.installation[props.language]}</h2>
          </div>
          <div className="wizard-question">install this shit</div>
        </div>
      );
    }

    return pageContent;
  };

  return (
    <div>
      {showWizardPageContent()}
      <div>
        <button
          onClick={() => {
            props.wizardPage === 3 ? install() : next();
          }}
          className="next-button  next"
        >
          {props.wizardPage === 3
            ? dictio.installation[props.language]
            : dictio.next[props.language]}
        </button>
      </div>
    </div>
  );
}
