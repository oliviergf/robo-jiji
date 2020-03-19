import React from "react";
import { Container, Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";
import { askPushPermission } from "../services/pushManager";
import logo from "../assets/roboticon.png";
import Test from "./Test";

export default function Home(props) {
  console.log("props home", props);
  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <img className="logoimg" src={logo} />
        </div>
        <div>{dictio.description[props.language]}</div>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/register"
          >
            {dictio.subscribe[props.language]}
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/informations"
          >
            {dictio.informations[props.language]}
          </Link>
        </Button>
        <Test />
        {/* <Button onClick={askPushPermission}>push permission</Button> */}
      </Box>
    </Container>
  );
}
