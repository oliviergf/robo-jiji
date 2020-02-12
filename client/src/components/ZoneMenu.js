import React from "react";
import Map from "./Map";
import ZoneList from "./ZoneList";
import { Container, Button } from "@material-ui/core";
import uuidv4 from "uuid/v4";
import { Polygon } from "react-google-maps";

class ZoneMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { test: {}, zones: [], allowDraw: false };
  }

  appendPolygon = () => {
    const coords = [
      { lat: 0, lng: 0 },
      { lat: 1, lng: 1 },
      { lat: 2, lng: 2 }
    ];

    //creates a new polygon. That would be added to the state when querying the zones for a user!
    var flightPath = new window.google.maps.Polygon({
      path: coords,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  };
  /**
   * allows the user to draw on the map
   */
  create = () => {
    this.appendPolygon();

    //allowdraw
    this.setState({ allowDraw: true });

    //todo: send request to backend: should be {userId: 'blablabla',zoneid: id, coords: [...]}
  };

  delete = zoneId => {
    //deletes the targeted zone
    let zoneToDelete = this.state.zones.find(zone => zone.id === zoneId);
    zoneToDelete.polygone.setMap(null);

    //removes it from state zones
    this.setState({
      zones: this.state.zones.filter(zone => zone.id !== zoneToDelete.id)
    });

    //todo: send request to DELETE backend: should be {userId: 'blablabla',zoneid: id, coords: [...]}
  };
  //will be called when a polygon is complete
  onPolygonComplete = value => {
    let newZone = { id: uuidv4(), polygone: value };

    this.setState({
      zones: [...this.state.zones, newZone],
      allowDraw: false
    });
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
