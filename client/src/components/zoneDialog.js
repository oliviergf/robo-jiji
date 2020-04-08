import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { FormControl, InputLabel, Input } from "@material-ui/core/";
import dictio from "../assets/dictionary";

export default function ZoneDialog(props) {
  const [name, setName] = useState(props.defaultZoneName);

  const handleChange = evt => {
    setName(evt.target.value);
  };

  useEffect(() => {
    if (name === "") setName(props.defaultZoneName);
  });

  const closeDialog = () => {
    props.acceptZone(name);
    setName("");
  };
  return (
    <div>
      <Dialog
        onClose={props.closeDialog}
        aria-labelledby="simple-dialog-title"
        open={props.isOpen}
      >
        <DialogTitle id="simple-dialog-title">
          {dictio.zoneDialogTitle[props.language]}
        </DialogTitle>
        <DialogContent dividers>
          <div>
            <FormControl>
              <InputLabel htmlFor="component-simple">
                {dictio.zoneName[props.language]}
              </InputLabel>
              <Input
                id="component-simple"
                name="name"
                defaultValue={name}
                onChange={handleChange}
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.cancelZone} color="primary">
            {dictio.cancel[props.language]}
          </Button>
          <Button onClick={closeDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
