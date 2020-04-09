import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import ApartmentIcon from "@material-ui/icons/Apartment";
import ExploreIcon from "@material-ui/icons/Explore";
import BurgerMenu from "./BurgerMenu";
import dictio from "../assets/dictionary";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
    anchorEl: null,
    showMenu: false,
  });

  const handleProfileMenuOpen = (event) => {
    setState({ ...state, anchorEl: event.currentTarget });
  };

  console.log("props.unSeenCount", props.unSeenCount);

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
            <Badge color="secondary" badgeContent={props.unSeenCount}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/apartements"
              >
                <ApartmentIcon />
              </Link>
            </Badge>
          </IconButton>
        </div>
      );
    } else {
      loginButton = (
        <Button color="inherit">
          <Link style={{ textDecoration: "none", color: "white" }} to="/login">
            {dictio.login[props.language]}
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
