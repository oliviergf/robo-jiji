import React from "react";
import Map from "./Map";
import ZoneList from "./ZoneList";
import { Container, Button } from "@material-ui/core";
import uuidv4 from "uuid/v4";

class ZoneMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { zones: [], allowDraw: false };
  }

  /**
   * allows the user to draw on the map
   */
  create = () => {
    //allowdraw
    this.setState({ allowDraw: true });
  };

  delete = zoneId => {
    //deletes the targeted zone
    let zoneToDelete = this.state.zones.find(zone => zone.id === zoneId);
    zoneToDelete.polygone.setMap(null);

    //removes it from state zones
    this.setState({
      zones: this.state.zones.filter(zone => zone.id !== zoneToDelete.id)
    });
  };
  //will be called when a polygon is complete
  onPolygonComplete = value => {
    console.log("in zone menu");
    console.log(value);

    let newZone = { id: uuidv4(), polygone: value };

    this.setState({
      zones: [...this.state.zones, newZone],
      allowDraw: false
    });
    console.log(this.state);
  };

  render() {
    return (
      <Container className="home">
        <Button onClick={this.create}>create</Button>
        <Map
          isMarkerShown
          complete={this.onPolygonComplete}
          showDrawManager={this.state.allowDraw}
        />
        <ZoneList zoneList={this.state.zones} deleteZoneFunc={this.delete} />
      </Container>
    );
  }
}

export default ZoneMenu;
