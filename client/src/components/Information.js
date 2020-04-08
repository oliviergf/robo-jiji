import React from "react";
import { Container, Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";
import { askPushPermission } from "../services/pushManager";
import logo from "../assets/roboticon.png";
import dictionary from "../assets/dictionary";

export default function Information(props) {
  return (
    <Container className="home">
      <div>{dictio.info1[props.language]}</div>
      <br />
      <div>{dictio.info2[props.language]}</div>
      <br />
      <div>{dictio.info3[props.language]}</div>
      <br />
      <Button>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          {dictio.return[props.language]}
        </Link>
      </Button>
      <Button>
        <Link to="/register" style={{ textDecoration: "none", color: "black" }}>
          {dictio.subscribe[props.language]}
        </Link>
      </Button>
    </Container>
  );
}
