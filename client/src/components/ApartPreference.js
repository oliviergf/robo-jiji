import React, { useState, useEffect } from "react";
import dictio from "../assets/dictionary";

import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormLabel,
  FormControlLabel
} from "@material-ui/core/";

export default function Account(props) {
  const [state, setState] = useState({ bro: "yes" });

  const handleEditInput = () => {
    console.log("editing em prefs");
  };

  const handleChange = () => {
    console.log("todo");
  };
  return (
    <div>
      <form className="preferenceForm" onSubmit={handleEditInput}>
        <h2>{dictio.preferences[props.language]}</h2>

        <div>
          <FormControl>
            <InputLabel htmlFor="component-simple">
              {dictio.confirmation[props.language]}
            </InputLabel>
            <Input
              id="component-simple"
              name="newPasswordConf"
              value="newPasswordConf"
              onChange={handleChange}
            />
          </FormControl>
        </div>
        <Button onClick={handleChange} value="Submit">
          {dictio.cancel[props.language]}
        </Button>
      </form>
    </div>
  );
}
