import React, { useState, useEffect } from "react";
import dictio from "../assets/dictionary";
import { makeStyles } from "@material-ui/core/styles";
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
    dateAvailable: "",
    priceStart: 750,
    priceEnd: 2000,
    rooms: [],
    numberBedrooms: 1,
    furnished: false,
    parkingAvailable: false,
    wheelchairAccessible: false,
    petsAllowed: false
  });

  const handleEditInput = () => {
    console.log("editing em prefs");
  };

  const handleChange = () => {
    console.log("todo");
  };

  const handleChangeRooms = event => {
    setState({ ...state, rooms: event.target.value });
  };
  const rooms = ["1 & ½", "2 & ½", "3 & ½", "4 & ½", "5 & ½", "6 & ½", "7 & ½"];

  const handleChangePrice = (target, newValue) => {
    setState({ ...state, priceStart: newValue[0], priceEnd: newValue[1] });
  };
  return (
    <div>
      <form className="preferenceForm" onSubmit={handleEditInput}>
        <h2>{dictio.preferences[props.language]}</h2>
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
        <Button onClick={handleChange} value="Submit">
          {dictio.cancel[props.language]}
        </Button>
      </form>
    </div>
  );
}
