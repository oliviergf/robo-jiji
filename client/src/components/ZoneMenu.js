import React from "react";
import Map from "./Map";
import { Container } from "@material-ui/core";

class ZoneMenu extends React.Component {
  onPolygonComplete = value => {
    console.log("in zone menu");
    console.log(value);
  };
  render() {
    return (
      <Container className="home">
        thats our boy
        <Map isMarkerShown complete={this.onPolygonComplete} />
        // Map with a drawing manager
      </Container>
    );
  }
}

export default ZoneMenu;
