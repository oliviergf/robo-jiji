import MuiAlert from "@material-ui/lab/Alert";
import { Container, Box, Button } from "@material-ui/core";
import { askPushPermission } from "../services/pushManager";
import axios from "../services/axios";
import url from "../assets/serverURL";
import React, { useState } from "react";
import dictio from "../assets/dictionary";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

export default function Notifications(props) {
  const classes = useStyles();
  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("07:30");

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
  const handleClockBegin = evt => {
    setStart(evt.target.value);
  };
  const handleClockEnd = evt => {
    setEnd(evt.target.value);
  };

  const handleTimeForm = evt => {
    console.log(start);
    console.log(end);
    evt.preventDefault();
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
          <div>
            <form className={classes.container} onSubmit={handleTimeForm}>
              <TextField
                id="time"
                label={dictio.beginning[props.language]}
                type="time"
                value={start}
                onChange={handleClockBegin}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 min
                }}
              />
              <TextField
                value={end}
                id="time"
                label={dictio.ending[props.language]}
                type="time"
                onChange={handleClockEnd}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  step: 300 // 5 min
                }}
              />
              <Button type="submit" value="Submit">
                {dictio.apply[props.language]}
              </Button>
            </form>
          </div>
        </div>
      </Box>
    </Container>
  );
}
