import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import axios from "../services/axios";
import dictio from "../assets/dictionary";
import ApartmentIcon from "@material-ui/icons/Apartment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExploreIcon from "@material-ui/icons/Explore";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TranslateIcon from "@material-ui/icons/Translate";

const useStyles = makeStyles({
  list: {
    width: 250
  }
});

export default function TemporaryDrawer(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    left: false
  });

  const handleLogOut = () => {
    axios
      .get("http://localhost:3000/logout")
      .then(function(response) {
        // handle success
        props.userLoggedOut();
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  };

  const handleSideClick = text => {
    console.log("what the goddamn text", text);
    if (text === dictio.langue[props.language]) {
      console.log("change it now! in burgmenu");
      props.changeLanguage();
    } else if (text === dictio.logout[props.language]) {
      handleLogOut();
    }
  };

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  /**
   * todo: will need to be patching stuff up here as app goes
   * @param {*} text
   */
  const returnSideItem = text => {
    switch (text) {
      case dictio.account[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      case dictio.maps[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      case dictio.dashboard[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <ApartmentIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      case dictio.settings[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      case dictio.logout[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      case dictio.langue[props.language]:
        return (
          <ListItem
            button
            key={text}
            onClick={() => {
              handleSideClick(text);
            }}
          >
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        );
      default:
    }
  };

  const tabList = [
    dictio.account[props.language],
    dictio.maps[props.language],
    dictio.dashboard[props.language],
    dictio.settings[props.language],
    dictio.logout[props.language],
    dictio.langue[props.language]
  ];

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>{tabList.map(text => returnSideItem(text))}</List>
    </div>
  );

  return (
    <div>
      <Button
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer("left", true)}
      >
        <MenuIcon />
      </Button>
      <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
        {sideList("left")}
      </Drawer>
    </div>
  );
}
