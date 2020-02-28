import React from "react";
import Map from "./Map";
import ZoneList from "./ZoneList";
import { Container, Button } from "@material-ui/core";
import uuidv4 from "uuid/v4";
import axios from "../services/axios";

// todo: implement select zone in list
class ZoneMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: {},
      zones: [],
      allowDraw: false,
      userLocation: this.findUserCoord() //or call findUserCoord but fucks sometime...
    };
  }

  findUserCoord = () => {
    let userPosition = {};
    navigator.geolocation.getCurrentPosition(
      pos => {
        userPosition.lat = pos.coords.latitude;
        userPosition.lng = pos.coords.longitude;
      },
      () => {
        //error handeler
        userPosition.lat = 45.496205;
        userPosition.lng = -73.571895;
      }
    );

    return userPosition;
  };

  componentDidMount = () => {
    let self = this;
    // total hack; we had to wait for map component to render before using the GoogleMap object,
    // its necessary for appending new zones to the map

    // todo: fix this shit; add
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
    }, 300);
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
    this.setState({
      zones: zonesToDisplay
    });
  };

  //todo:does not work :  shit it
  onZoneSelect = zoneId => {
    console.log(zoneId);
    // //doesnt work
    // const zonesColored = this.state.zones.map(zone => {
    //   if (zone.id === zoneId) {
    //     let poly = zone.polygon;
    //     poly.setOptions({ fillColor: "#FF00FF" });
    //     return {
    //       polygon: poly,
    //       id: zone.id
    //     };
    //   } else {
    //     let poly = zone.polygon;
    //     poly.setOptions({ fillColor: "#FF00FF" });
    //     return {
    //       polygon: poly,
    //       id: zone.id
    //     };
    //   }
    // });

    // this.setState({ zones: zonesColored });

    //might want to trigger rerender to pass zones to zonelist?
  };

  /**
   * allows the user to draw on the map
   */
  onCreateClick = () => {
    //allowdraw
    this.setState({ allowDraw: true });
  };

  onDeleteClick = zoneId => {
    let self = this;
    axios
      .delete("http://localhost:3000/zone", {
        data: {
          zoneId: zoneId
        }
      })
      .then(function(response) {
        //if everything is OK, delete the zone from state too
        if (response.status === 200) {
          //deletes the targeted zone
          let zoneToDelete = self.state.zones.find(zone => zone.id === zoneId);
          zoneToDelete.polygon.setMap(null);

          //removes it from state zones
          self.setState({
            zones: self.state.zones.filter(zone => zone.id !== zoneToDelete.id)
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
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
    value.getPath().i.map(pos => points.push([pos.lat(), pos.lng()]));

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
          userLocation={this.state.userLocation}
        />
        <ZoneList
          zoneList={this.state.zones}
          deleteZoneFunc={this.onDeleteClick}
          onSelect={this.onZoneSelect}
        />
      </Container>
    );
  }
}

export default ZoneMenu;
