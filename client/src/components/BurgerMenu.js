import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import axios from "../services/axios";
import dictio from "../assets/dictionary";
import ApartmentIcon from "@material-ui/icons/Apartment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExploreIcon from "@material-ui/icons/Explore";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TranslateIcon from "@material-ui/icons/Translate";
import { Link } from "react-router-dom";
import url from "../assets/serverURL";

const useStyles = makeStyles({
  list: {
    width: 250
  }
});

export default function SideBurgMenu(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    left: false
  });

  const tabList = [
    dictio.account[props.language],
    dictio.maps[props.language],
    dictio.dashboard[props.language],
    dictio.settings[props.language],
    dictio.logout[props.language],
    dictio.langue[props.language]
  ];

  const handleSideClick = text => {
    if (text === dictio.langue[props.language]) {
      props.changeLanguage();
    } else if (text === dictio.logout[props.language]) {
      axios
        .get(`${url}/logout`)
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
  const returnSideItem = (text, index) => {
    switch (text) {
      case dictio.account[props.language]:
        return (
          <Link
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
            to="/home"
          >
            <ListItem
              button
              onClick={() => {
                handleSideClick(text);
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        );
      case dictio.maps[props.language]:
        return (
          <Link
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
            to="/map"
          >
            <ListItem
              button
              onClick={() => {
                handleSideClick(text);
              }}
            >
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        );
      case dictio.dashboard[props.language]:
        return (
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/dashboard"
            key={index}
          >
            <ListItem
              button
              onClick={() => {
                handleSideClick(text);
              }}
            >
              <ListItemIcon>
                <ApartmentIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        );
      case dictio.settings[props.language]:
        return (
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/settings"
            key={index}
          >
            <ListItem
              button
              onClick={() => {
                handleSideClick(text);
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </Link>
        );
      case dictio.logout[props.language]:
        return (
          <ListItem
            button
            key={index}
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
            key={index}
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

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>{tabList.map((text, index) => returnSideItem(text, index))}</List>
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
