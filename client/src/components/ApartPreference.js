import React, { useState, useEffect } from "react";
import dictio from "../assets/dictionary";
import { makeStyles } from "@material-ui/core/styles";
import url from "../assets/serverURL";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormLabel,
  FormControlLabel
} from "@material-ui/core/";
import Slider from "@material-ui/core/Slider";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import MomentUtils from "@date-io/moment";
import axios from "../services/axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "./Alert";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
function valuetext(value) {
  return `${value}$`;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles({
  root: {
    width: 300
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300
  }
});

export default function Account(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    dateAvailable: moment(),
    priceStart: 750,
    priceEnd: 2000,
    rooms: ["3 & ½"],
    numberBedrooms: ["1"],
    furnished: false,
    parkingAvailable: false,
    wheelchairAccessible: false,
    petsAllowed: false,
    showSucces: false,
    showError: false
  });
  const rooms = ["1 & ½", "2 & ½", "3 & ½", "4 & ½", "5 & ½", "6 & ½", "7 & ½"];
  const bedRooms = ["1", "2", "3", "4", "5"];

  const handleClose = () => {
    setState({ ...state, showSucces: false, showError: false });
  };

  // will only be called once
  useEffect(() => {
    axios
      .get(`${url}/preferences`)
      .then(function(response) {
        setState({
          dateAvailable: response.data.dateAvailable || moment(),
          priceStart: response.data.priceStart || 750,
          priceEnd: response.data.priceEnd || 2000,
          rooms: response.data.rooms || ["3 & ½"],
          numberBedrooms: response.data.numberBedrooms || ["1"],
          furnished: response.data.furnished || false,
          parkingAvailable: response.data.parkingAvailable || false,
          wheelchairAccessible: response.data.wheelchairAccessible || false,
          petsAllowed: response.data.petsAllowed || false
        });
      }, [])
      .catch(function(error) {
        console.log("error fetching preferences");
        console.log(error);
      });
  }, []);

  const handleEditInput = evt => {
    axios
      .put(`${url}/preferences`, {
        data: state
      })
      .then(function(response) {
        setState({ ...state, showSucces: true });
      })
      .catch(function(error) {
        setState({ ...state, showError: true });
        console.log(error);
      });

    evt.preventDefault();
  };

  const handleChange = evt => {
    setState({ ...state, [evt.target.name]: evt.target.checked });
  };

  const handleChangeRooms = event => {
    setState({ ...state, rooms: event.target.value });
  };

  const handleChangeBedRooms = event => {
    setState({ ...state, numberBedrooms: event.target.value });
  };

  const handleChangePrice = (target, newValue) => {
    setState({ ...state, priceStart: newValue[0], priceEnd: newValue[1] });
  };

  const handleDateChange = date => {
    setState({ ...state, dateAvailable: date });
  };
  return (
    <div>
      <form className="preferenceForm" onSubmit={handleEditInput}>
        <h2>{dictio.preferences[props.language]}</h2>
        <div>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="DD/MM/YY"
              margin="normal"
              id="date-picker-inline"
              label={dictio.dateAvailable[props.language]}
              value={state.dateAvailable}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.root}>
          <InputLabel>{dictio.priceRange[props.language]}</InputLabel>
          <Slider
            value={[state.priceStart, state.priceEnd]}
            onChange={handleChangePrice}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
            min={100}
            max={5000}
          />
          {`[${state.priceStart},${state.priceEnd}]`}
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">
              {dictio.rooms[props.language]}
            </InputLabel>
            <Select
              multiple
              value={state.rooms}
              onChange={handleChangeRooms}
              input={<Input />}
              renderValue={selected => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {rooms.map((room, index) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={state.rooms.indexOf(room) > -1} />
                  <ListItemText primary={room} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">
              {dictio.bedrooms[props.language]}
            </InputLabel>
            <Select
              multiple
              value={state.numberBedrooms}
              onChange={handleChangeBedRooms}
              input={<Input />}
              renderValue={selected => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {bedRooms.map((room, index) => (
                <MenuItem key={room} value={room}>
                  <Checkbox checked={state.numberBedrooms.indexOf(room) > -1} />
                  <ListItemText primary={room} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Options</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.furnished}
                    onChange={handleChange}
                    name="furnished"
                  />
                }
                label={dictio.furnished[props.language]}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.parkingAvailable}
                    onChange={handleChange}
                    name="parkingAvailable"
                  />
                }
                label={dictio.parkingAvailable[props.language]}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.wheelchairAccessible}
                    onChange={handleChange}
                    name="wheelchairAccessible"
                  />
                }
                label={dictio.wheelchairAccessible[props.language]}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.petsAllowed}
                    onChange={handleChange}
                    name="petsAllowed"
                  />
                }
                label={dictio.petsAllowed[props.language]}
              />
            </FormGroup>
            <FormHelperText>
              attention ces cases peuvent severement restraindre la recherche
            </FormHelperText>
          </FormControl>
        </div>
        <Button type="submit" value="Submit">
          {dictio.apply[props.language]}
        </Button>
      </form>
      <Snackbar
        open={state.showSucces}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert severity="success" onClose={handleClose}>
          {dictio.success[props.language]}
        </Alert>
      </Snackbar>
      <Snackbar
        open={state.showError}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          {dictio.Error[props.language]}
        </Alert>
      </Snackbar>
    </div>
  );
}
