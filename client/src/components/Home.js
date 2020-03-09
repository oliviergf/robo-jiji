import React from "react";
import { Container, Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  askPushPermission,
  subscribeUserToPush
} from "../services/pushManager";

class Home extends React.Component {
  render() {
    return (
      <Container className="home">
        <Box justifyContent="center" alignItems="center">
          <div>put nice image here</div>
          <div>description of what we do</div>
          <Button>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/register"
            >
              Subscribe
            </Link>
          </Button>
          <Button>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/login"
            >
              Login
            </Link>
          </Button>
          <Button onClick={askPushPermission}>push permission</Button>
          <Button onClick={subscribeUserToPush}>push sub</Button>
        </Box>
      </Container>
    );
  }
}

export default Home;
