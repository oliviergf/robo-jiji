import MuiAlert from "@material-ui/lab/Alert";
import { Container, Box, Button } from "@material-ui/core";
import { askPushPermission } from "../services/pushManager";
import axios from "../services/axios";
import url from "../assets/serverURL";
import React from "react";
import dictio from "../assets/dictionary";
export default function Notifications(props) {
  const testNotification = () => {
    // Make a request for a user with a given ID
    axios
      .get(`${url}/subscribeNotif`)
      .then(function(response) {
        // handle success
        console.log(response);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  };
  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <Button
            onClick={() => {
              askPushPermission();
            }}
          >
            {dictio.enablePush[props.language]}
          </Button>
          <Button onClick={testNotification}>test Notifications</Button>
        </div>
      </Box>
    </Container>
  );
}
