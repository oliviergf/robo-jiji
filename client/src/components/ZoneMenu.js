import React from "react";
import Map from "./Map";
import { Container, Box, Button } from "@material-ui/core";

class ZoneMenu extends React.Component {
  render() {
    return (
      <Container className="home">
        thats our boy
        <Map isMarkerShown />
        // Map with a Marker
      </Container>
    );
  }
}

export default ZoneMenu;
