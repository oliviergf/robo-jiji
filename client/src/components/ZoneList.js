import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import dictio from "../assets/dictionary";

const selected = (zoneId, onSelect) => {
  //passes zone id to ZoneMenu to change color
  onSelect(zoneId);
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  }
}));

function generate(
  zoneList,
  deleteZoneFunc,
  onSelect,
  selectZoneToDelete,
  zoneIndexDelete,
  language
) {
  if (zoneList.length !== 0) {
    return zoneList.map((zone, index) => (
      <ListItem
        button={true}
        name={zone.id}
        key={zone.id}
        onClick={() => {
          selected(zone.id, onSelect);
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={zone.name} />
        <ListItemSecondaryAction>
          {zoneIndexDelete !== index ? (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => selectZoneToDelete(index)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              onClick={() => deleteZoneFunc(zone.id)}
              color="secondary"
            >
              {dictio.delete[language]}
            </Button>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  } else {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="you have no zones!" />
      </ListItem>
    );
  }
}

export default function InteractiveList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Selected Zones
          </Typography>
          <div className={classes.demo}>
            <List>
              {generate(
                props.zoneList,
                props.deleteZoneFunc,
                props.onSelect,
                props.selectZoneToDelete,
                props.zoneIndexDelete,
                props.language
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
