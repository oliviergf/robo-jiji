import React from "react";
import { Polygon } from "react-google-maps";
const { compose, withProps } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");
const {
  DrawingManager
} = require("react-google-maps/lib/components/drawing/DrawingManager");

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnIReQN29uQlQ9XPcplFlm5R8XnU2n0i4&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
    {props.showDrawManager && (
      <DrawingManager
        defaultDrawingMode={"polygon"}
        defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: "",
            drawingModes: ["polygon"]
          },
          polygonOptions: {
            editable: false
          }
        }}
        onPolygonComplete={value => props.complete(value)}
      />
    )}
  </GoogleMap>
));

export default MyMapComponent;
