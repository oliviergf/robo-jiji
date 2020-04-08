import React from "react";
import { Polygon } from "react-google-maps";
const { compose, withProps } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");
const {
  DrawingManager
} = require("react-google-maps/lib/components/drawing/DrawingManager");

//https://blog.logrocket.com/using-recompose-to-write-clean-higher-order-components-3019a6daf44c/
//todo: transform this with recompose and highorder component.... need to learn bout that shit. and call useeffect to call component didmount in zonemenu
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
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: props.userLocation.lat, lng: props.userLocation.lng }}
    options={{ gestureHandling: "greedy", disableDefaultUI: true }}
  >
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
    {props.zonesToDisplay.map(zone => {
      console.log(zone.polygon);
      return <Polygon key={zone.id} path={zone.polygon.getPath()} />;
    })}
  </GoogleMap>
));

export default MyMapComponent;
