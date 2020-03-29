import MuiAlert from "@material-ui/lab/Alert";
import { Container, Box, Button } from "@material-ui/core";
import { askPushPermission } from "../services/pushManager";
import axios from "../services/axios";
import url from "../assets/serverURL";
import React, { useState, useEffect } from "react";
import dictio from "../assets/dictionary";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

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

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600]
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

export default function Notifications(props) {
  const classes = useStyles();
  const [start, setStart] = useState("00:00");
  const [end, setEnd] = useState("07:30");
  const [checkedG, setCheckedG] = useState(false);

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
  const handleChange = () => {
    setCheckedG(!checkedG);
  };

  const handleTimeForm = evt => {
    axios
      .put(`${url}/subscribeNotif`, {
        start: start,
        end: end,
        checkedG: checkedG
      })
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
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={checkedG}
                    onChange={handleChange}
                    name={dictio.allTheTime[props.language]}
                  />
                }
                label={dictio.allTheTime[props.language]}
              />
              <TextField
                disabled={checkedG}
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
                disabled={checkedG}
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
