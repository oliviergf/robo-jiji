import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import BurgerMenu from "./BurgerMenu";
import dictio from "../assets/dictionary";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";

export default function ButtonAppBar(props) {
  const [state, setState] = React.useState({
    left: false,
    anchorEl: null,
    showMenu: false,
  });
  const open = Boolean(state.anchorEl);

  const loginArea = () => {
    return (
      <Button className="loginButton">
        <Link to="/login">{dictio.login[props.language]}</Link>
      </Button>
    );
  };

  const backButton = () => {
    return (
      <Button
        className="backButton"
        onClick={() => {
          props.backClicked();
        }}
      >
        {"<"}
      </Button>
    );
  };

  const logoArea = () => {
    return (
      <Button>
        <Link style={{ textDecoration: "none", color: "white" }} to="/home">
          {/* <img src={logo} alt="Logo"></img> */}
          jijibot
        </Link>
      </Button>
    );
  };

  const openProfileOptions = (evt) => {
    setState({ ...state, anchorEl: evt.currentTarget });
  };
  const handleClose = () => {
    setState({ ...state, anchorEl: null });
  };

  const profileAndOtherStuff = () => {
    return (
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={openProfileOptions}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={state.anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {props.isLoggedIn && backButton()}
          {profileAndOtherStuff()}
          {logoArea()}
          {loginArea()}
        </Toolbar>
      </AppBar>
    </div>
  );
}
