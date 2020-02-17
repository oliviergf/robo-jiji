import React from "react";
import axios from "./services/axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ZoneMenu from "./components/ZoneMenu";
import "typeface-roboto";
import "./App.css";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Switch, Route, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userFirstName: "",
      anchorEl: null
    };
    this.testBrowserSession();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogOut = () => {
    let self = this;
    axios
      .get("http://localhost:3000/logout")
      .then(function(response) {
        // handle success
        self.setState({
          anchorEl: null,
          isLoggedIn: false,
          userFirstName: "",
          anchorEl: null
        });
        console.log("ici", self.state);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  };

  logUserCredentials = user => {
    this.setState({
      isLoggedIn: true,
      userFirstName: user.firstname
    });
  };

  //test whether the current browser contains a valid session
  testBrowserSession = () => {
    let self = this;
    axios
      .get("http://localhost:3000/sessionLogin")
      .then(function(response) {
        self.logUserCredentials(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    let loginArea;

    if (this.state.isLoggedIn) {
      loginArea = (
        <div>
          <Button
            style={{ textDecoration: "none", color: "white" }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            {this.state.userFirstName}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
            <MenuItem onClick={this.handleClose}>My account</MenuItem>
            <MenuItem onClick={this.handleLogOut}>
              <Link to="/home">Logout</Link>
            </MenuItem>
          </Menu>
        </div>
      );
    } else {
      loginArea = (
        <Button edge="start" color="inherit">
          <Link style={{ textDecoration: "none", color: "white" }} to="/login">
            login
          </Link>
        </Button>
      );
    }
    return (
      <div className="App">
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Button edge="start" color="inherit">
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/home"
                >
                  home
                </Link>
              </Button>
              <Button edge="start" color="inherit">
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/map"
                >
                  Map
                </Link>
              </Button>
              <Typography variant="h6" className={classes.title}>
                Kijiji Bot App
              </Typography>
              {loginArea}
            </Toolbar>
          </AppBar>
        </div>
        <div className="body">
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login logUserIn={this.logUserCredentials} />
            </Route>
            <Route path="/map">
              <ZoneMenu />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

//with Styles is passed as props.
export default withStyles(styles, { withTheme: true })(App);
