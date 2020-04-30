import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import dictio from "../assets/dictionary";
import MenuItem from "@material-ui/core/MenuItem";
import PersonIcon from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 5,
  },
  appBar: {
    backgroundColor: "white",
  },
  toolBar: {
    justifyContent: "space-between",
  },
  icon: {
    color: "black",
  },
  backIcon: {
    color: "black",
    fontSize: "medium",
  },
  profileAndOtherStuff: {
    border: "120px",
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
    anchorEl: null,
    showMenu: false,
  });
  const open = Boolean(state.anchorEl);

  const openProfileOptions = (evt) => {
    setState({ ...state, anchorEl: evt.currentTarget });
  };
  const handleClose = () => {
    setState({ ...state, anchorEl: null });
  };
  const logout = () => {
    handleClose();
    props.userLoggedOut();
  };

  const loginArea = () => {
    return (
      <Link style={{ textDecoration: "none", color: "black" }} to="/login">
        <Button>{dictio.login[props.language]}</Button>
      </Link>
    );
  };

  const backButton = () => {
    return props.wizardPage === 0 ? (
      <Link style={{ textDecoration: "none", color: "black" }} to="/home">
        <Button
          className="backButton"
          onClick={() => {
            props.backClicked();
          }}
        >
          {" "}
          <ArrowBackIosIcon className={classes.backIcon} />
        </Button>
      </Link>
    ) : (
      <Button
        className="backButton"
        onClick={() => {
          props.backClicked();
        }}
      >
        {" "}
        <ArrowBackIosIcon className={classes.backIcon} />
      </Button>
    );
  };

  const logoArea = () => {
    return (
      <Link style={{ textDecoration: "none", color: "black" }} to="/home">
        <Button onClick={props.returnHome}>Kiji-bot</Button>
      </Link>
    );
  };
  const switchLanguage = () => {
    handleClose();
    props.changeLanguage();
  };

  const profileAndOtherStuff = () => {
    return (
      <div className={classes.profileAndOtherStuff}>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={openProfileOptions}
          color="inherit"
        >
          <PersonIcon className={classes.icon} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={state.anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            {dictio.account[props.language]}
          </MenuItem>
          <MenuItem onClick={handleClose}>
            {dictio.parameters[props.language]}
          </MenuItem>
          <MenuItem onClick={logout}>{dictio.logout[props.language]}</MenuItem>
          <MenuItem onClick={switchLanguage}>
            {dictio.langue[props.language]}
          </MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <div className="AppBarDivContainer">
      <AppBar elevation={0} className={classes.appBar} position="static">
        <Toolbar className={classes.toolBar}>
          {props.isInsideWizzard && backButton()}
          {logoArea()}
          {!props.isLoggedIn && loginArea()}
          {props.isLoggedIn && profileAndOtherStuff()}
        </Toolbar>
      </AppBar>
    </div>
  );
}
