import React from "react";
import Map from "./Map";
import ZoneList from "./ZoneList";
import { Container, Button } from "@material-ui/core";
import uuidv4 from "uuid/v4";
import axios from "../services/axios";
import url from "../assets/serverURL";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Dialog from "./zoneDialog";
import dictio from "../assets/dictionary";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "./Alert";

// todo: implement select zone in list
class ZoneMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: {},
      zones: [],
      allowDraw: false,
      openDrawer: false,
      openDialog: false,
      tempZoneValue: "",
      userLocation: { lat: 45.496205, lng: -73.571895 }, //or call findUserCoord but fucks sometime...
      defaultZoneName: "",
      zoneSelectedToDelete: -1,
      showMaxZoneReach: false,
    };
    this.findUserCoord();
  }

  findUserCoord = async () => {
    let self = this;
    await navigator.geolocation.getCurrentPosition((pos) => {
      self.setState({
        userLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      });
    });
  };

  handleClose = () => {
    this.setState({ showMaxZoneReach: false });
  };
  toggleDrawer = (open) => {
    this.setState({ openDrawer: open });
  };

  selectZoneToDelete = (index) => {
    this.setState({ zoneSelectedToDelete: index });
  };

  // total hack; we had to wait for map component to render before using the GoogleMap object,
  // its necessary for appending new zones to the map
  // todo: fix this shit; add
  componentDidMount = () => {
    let self = this;

    setTimeout(function () {
      axios
        .get(`${url}/zone`)
        .then(function (response) {
          // handle success
          self.initZones(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
    }, 300);
  };

  /**
   * Receives the zones the user has and append them to state to be displayed
   */
  initZones = (zones) => {
    let zonesToDisplay = [];
    zones.map((zone) => {
      const coords = zone.path.map((pos) => ({
        lat: pos[0],
        lng: pos[1],
      }));
      const newPolygon = new window.google.maps.Polygon({
        path: coords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      //create a new zone to be used in state
      zonesToDisplay.push({
        id: zone.zoneId,
        polygon: newPolygon,
        name: zone.name,
      });
    });

    this.setState({
      zones: zonesToDisplay,
      defaultZoneName: `zone ${zonesToDisplay.length + 1}`,
    });
  };

  //zoneId works; if ever want to attempt to change colors
  onZoneSelect = (zoneId) => {
    this.setState({ zoneSelectedToDelete: -1 });
  };

  onCreateClick = () => {
    if (this.state.zones.length >= 5) {
      this.setState({ showMaxZoneReach: true });
    } else {
      this.setState({ allowDraw: true });
    }
  };

  onDeleteSelect = () => {};

  onDeleteClick = (zoneId) => {
    let self = this;
    axios
      .delete(`${url}/zone`, {
        data: {
          zoneId: zoneId,
        },
      })
      .then(function (response) {
        //if everything is OK, delete the zone from state too
        if (response.status === 200) {
          //deletes the targeted zone
          let zoneToDelete = self.state.zones.find(
            (zone) => zone.id === zoneId
          );
          zoneToDelete.polygon.setMap(null);

          //removes it from state zones
          self.setState({
            zones: self.state.zones.filter(
              (zone) => zone.id !== zoneToDelete.id
            ),
            zoneSelectedToDelete: -1,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  saveAndUploadZone = (name) => {
    const value = this.state.tempZoneValue;
    let newZone = { id: uuidv4(), polygon: value, name: name };
    this.setState({
      zones: [...this.state.zones, newZone],
      allowDraw: false,
      tempZoneValue: "",
    });

    let points = [];
    //adds the path of the newly created zone
    value.getPath().i.map((pos) => points.push([pos.lat(), pos.lng()]));

    axios
      .post(`${url}/zone`, {
        zoneId: newZone.id,
        path: points,
        name: name,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //will be called when a polygon is complete;
  onPolygonComplete = (value) => {
    this.setState({
      openDialog: true,
      allowDraw: false,
      tempZoneValue: value,
      defaultZoneName: `zone ${this.state.zones.length + 1}`,
    });
  };

  closeDialog = () => {
    this.setState({ openDialog: false, tempZoneValue: "" });
  };

  cancelZone = () => {
    this.state.tempZoneValue.setMap(null);
    this.closeDialog();
  };

  cancelZoneInProgress = () => {
    this.setState({ allowDraw: false, tempZoneValue: "" });
  };
  acceptZone = (name) => {
    this.saveAndUploadZone(name);
    this.closeDialog();
  };

  render() {
    return (
      <Container className="home">
        {this.state.allowDraw ? (
          <Button onClick={this.cancelZoneInProgress}>
            {dictio.cancel[this.props.language]}
          </Button>
        ) : (
          <Button onClick={this.onCreateClick}>
            {dictio.new[this.props.language]}
          </Button>
        )}

        <Button
          onClick={() => {
            this.toggleDrawer(true);
          }}
        >
          {dictio.open[this.props.language]}
        </Button>
        <Map
          isMarkerShown
          complete={this.onPolygonComplete}
          showDrawManager={this.state.allowDraw}
          zonesToDisplay={this.state.zones}
          userLocation={this.state.userLocation}
        />
        <SwipeableDrawer
          anchor="bottom"
          open={this.state.openDrawer}
          onClose={() => {
            this.toggleDrawer(false);
          }}
          onOpen={() => {
            this.toggleDrawer(true);
          }}
        >
          <ZoneList
            zoneList={this.state.zones}
            deleteZoneFunc={this.onDeleteClick}
            onSelect={this.onZoneSelect}
            selectZoneToDelete={this.selectZoneToDelete}
            zoneIndexDelete={this.state.zoneSelectedToDelete}
            language={this.props.language}
          />
        </SwipeableDrawer>
        <Dialog
          closeDialog={this.closeDialog}
          isOpen={this.state.openDialog}
          acceptZone={this.acceptZone}
          cancelZone={this.cancelZone}
          language={this.props.language}
          defaultZoneName={this.state.defaultZoneName}
        />
        <Snackbar
          open={this.state.showMaxZoneReach}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.maxZonesReached[this.props.language]}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default ZoneMenu;
