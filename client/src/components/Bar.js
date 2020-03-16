import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import dictio from "../assets/dictionary";
import axios from "../services/axios";
import logo from "../assets/roboticon.png";
import ApartmentIcon from "@material-ui/icons/Apartment";
import ExploreIcon from "@material-ui/icons/Explore";
import BurgerMenu from "./BurgerMenu";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  list: {
    width: 250
  }
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
    anchorEl: null,
    showMenu: false
  });

  useEffect(() => {
    console.log("props", props);
  });

  const handleProfileMenuOpen = event => {
    setState({ ...state, anchorEl: event.currentTarget });
  };

  const loginArea = () => {
    let loginButton;
    if (props.isLoggedIn) {
      loginButton = (
        <div>
          <IconButton
            edge="end"
            aria-label="maps"
            aria-haspopup="true"
            color="inherit"
          >
            <Link style={{ textDecoration: "none", color: "white" }} to="/map">
              <ExploreIcon />
            </Link>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/dashboard"
            >
              <ApartmentIcon />
            </Link>
          </IconButton>
        </div>
      );
    } else {
      loginButton = (
        <Button color="inherit">
          <Link style={{ textDecoration: "none", color: "white" }} to="/login">
            login
          </Link>
        </Button>
      );
    }
    return loginButton;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {props.isLoggedIn && (
            <BurgerMenu
              changeLanguage={() => {
                props.changeLanguage();
              }}
              userLoggedOut={props.userLoggedOut}
              language={props.language}
            />
          )}
          <Typography variant="h6" className={classes.title}>
            <IconButton edge="start">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/home"
              >
                {/* <img src={logo} alt="Logo"></img> */}
                jijibot
              </Link>
            </IconButton>
          </Typography>
          {loginArea()}
        </Toolbar>
      </AppBar>
    </div>
  );
}
