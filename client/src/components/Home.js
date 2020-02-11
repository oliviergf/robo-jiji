import React from "react";
import { Container, Box, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

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
        </Box>
      </Container>
    );
  }
}

export default Home;
