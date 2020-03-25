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

function valuetext(value) {
  return `${value}$`;
}

const useStyles = makeStyles({
  root: {
    width: 300
  }
});

export default function Account(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    dateAvailable: "",
    priceStart: 750,
    priceEnd: 2000,
    rooms: 3,
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

  const handleChangePrice = (target, newValue) => {
    setState({ ...state, priceStart: newValue[0], priceEnd: newValue[1] });
  };
  return (
    <div>
      <form className="preferenceForm" onSubmit={handleEditInput}>
        <h2>{dictio.preferences[props.language]}</h2>
        <div className={classes.root}>
          <InputLabel htmlFor="component-simple">
            {dictio.priceRange[props.language]}
          </InputLabel>
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
        <Button onClick={handleChange} value="Submit">
          {dictio.cancel[props.language]}
        </Button>
      </form>
    </div>
  );
}
