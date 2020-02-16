import React from "react";
import Map from "./Map";
import ZoneList from "./ZoneList";
import { Container, Button } from "@material-ui/core";
import uuidv4 from "uuid/v4";
import axios from "../services/axios";

class ZoneMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { test: {}, zones: [], allowDraw: false };
  }

  componentDidMount = () => {
    let self = this;

    // total hack; we had to wait for map component to render before using the GoogleMap object,
    // its necessary for appending new zones to the map
    setTimeout(function() {
      axios
        .get("http://localhost:3000/zone")
        .then(function(response) {
          // handle success
          self.initZones(response.data);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    }, 100);
  };

  /**
   * Receives the zones the user has and append them to state to be displayed
   */
  initZones = zones => {
    let zonesToDisplay = [];
    zones.map(zone => {
      const coords = zone.path.map(pos => ({
        lat: pos[0],
        lng: pos[1]
      }));
      const newPolygon = new window.google.maps.Polygon({
        path: coords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      //create a new zone to be used in state
      zonesToDisplay.push({ id: zone.zoneId, polygon: newPolygon });
    });
    console.log("zonesToDisplay", zonesToDisplay);
    this.setState({
      zones: zonesToDisplay
    });
  };

  /**
   * allows the user to draw on the map
   */
  onCreateClick = () => {
    //allowdraw
    this.setState({ allowDraw: true });
  };

  onDeleteClick = zoneId => {
    //deletes the targeted zone
    let zoneToDelete = this.state.zones.find(zone => zone.id === zoneId);
    zoneToDelete.polygon.setMap(null);

    //removes it from state zones
    this.setState({
      zones: this.state.zones.filter(zone => zone.id !== zoneToDelete.id)
    });

    //todo: send request to DELETE backend: should be {userId: 'blablabla',zoneid: id, coords: [...]}
  };

  //will be called when a polygon is complete; value is the gmaps formated polygon
  onPolygonComplete = value => {
    //create a new zone to be used in state
    let newZone = { id: uuidv4(), polygon: value };
    this.setState({
      zones: [...this.state.zones, newZone],
      allowDraw: false
    });

    let points = [];
    //adds the path of the newly created zone
    value.getPath().g.map(pos => points.push([pos.lat(), pos.lng()]));

    axios
      .post("http://localhost:3000/zone", {
        zoneId: newZone.id,
        path: points
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <Container className="home">
        <Button onClick={this.onCreateClick}>create</Button>
        <Map
          isMarkerShown
          complete={this.onPolygonComplete}
          showDrawManager={this.state.allowDraw}
          zonesToDisplay={this.state.zones}
        />
        <ZoneList
          zoneList={this.state.zones}
          deleteZoneFunc={this.onDeleteClick}
        />
      </Container>
    );
  }
}

export default ZoneMenu;
