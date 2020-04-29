import React, { useState } from "react";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";
import android from "../assets/icons8-android-os-100.png";
import androidColor from "../assets/icons8-android-os-100_color.png";
import apple from "../assets/icons8-apple-logo-100.png";
import appleColor from "../assets/icons8-apple-logo-100_color.png";

export default function Home(props) {
  const [state, setState] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmation: "",
    platform: "apple",
    telephoneNumber: "",
  });

  const next = () => {
    props.nextPage();
  };

  const install = () => {
    console.log(state);
    console.log("installin");
  };

  const platformeClick = () => {
    const isApple = state.platform === "apple";
    setState({ ...state, platform: isApple ? "android" : "apple" });
  };

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };
  const showWizardPageContent = () => {
    let pageContent;
    if (props.wizardPage === 0) {
      pageContent = (
        <div className="question-wizard-container">
          <div className="wizard-question-title">
            <h2>{dictio.creation[props.language]}</h2>
          </div>
          <div className="wizard-question">
            <div>{dictio.email[props.language]}</div>
            <input value={state.email} name="email" onChange={handleChange} />
          </div>
        </div>
      );
    } else if (props.wizardPage === 1) {
      pageContent = (
        <div className="question-wizard-container">
          <div className="wizard-question-title">
            <h2>{dictio.creation[props.language]}</h2>
          </div>
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
        <div className="question-wizard-container">
          <div className="wizard-question-title">
            <h2>{dictio.platForm[props.language]}</h2>
          </div>
          <div className="wizard-question">
            <div>
              The platform is kinda important to use, what's on your mobile?
            </div>
            <img
              src={state.platform === "apple" ? appleColor : apple}
              onClick={platformeClick}
            />
            <img
              src={state.platform === "apple" ? android : androidColor}
              onClick={platformeClick}
            />
          </div>
          {state.platform === "apple" && (
            <div className="wizard-question">
              <div>{dictio.telephoneNumber[props.language]}</div>
              <input
                value={state.telephoneNumber}
                name="telephoneNumber"
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      );
    } else if (props.wizardPage === 3) {
      pageContent = (
        <div className="question-wizard-container">
          <div className="wizard-question-title">
            <h2>{dictio.installation[props.language]}</h2>
          </div>
          <div className="wizard-question">install this shit</div>
        </div>
      );
    }

    return pageContent;
  };

  return (
    <div className="wizard-container">
      {showWizardPageContent()}
      <div className="next-button-wrapper">
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
