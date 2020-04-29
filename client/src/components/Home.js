import React from "react";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";

export default function Home(props) {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="punch-line">
          <h2>{dictio.punchLine[props.language]}</h2>
        </div>
        <div>{dictio.welcome[props.language]}</div>
        <div>
          <button onClick={props.startWizard} className="check-in-button">
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/register"
            >
              {dictio.checking[props.language]}
            </Link>
          </button>
        </div>
      </div>
      <div className="home-content">
        <div className="punch-line">
          <h2>{dictio.moreInfo[props.language]}</h2>
        </div>
        <div className="information-line">{dictio.info1[props.language]}</div>
        <div className="punch-line">
          <h2>{dictio.moreInfo2[props.language]}</h2>
        </div>
        <div className="information-line">{dictio.info2[props.language]}</div>
        <div className="punch-line">
          <h2>{dictio.moreInfo3[props.language]}</h2>
        </div>
        <div className="information-line">{dictio.info3[props.language]}</div>
      </div>
    </div>
  );
}
