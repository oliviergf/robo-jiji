import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import TestSession from "./components/TestSession";
import Home from "./components/Home";
import "typeface-roboto";
import "./App.css";
import Button from "@material-ui/core/Button";

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
      userFirstName: ""
    };
  }

  logUser = user => {
    this.setState({
      isLoggedIn: true,
      userFirstName: user.firstname
    });
  };

  render() {
    const { classes } = this.props;
    let loginArea = (
      <Link style={{ textDecoration: "none", color: "white" }} to="/login">
        login
      </Link>
    );
    if (this.state.isLoggedIn)
      loginArea = (
        <Link style={{ textDecoration: "none", color: "white" }} to="/home">
          {this.state.userFirstName}
        </Link>
      );
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
                  to="/register"
                >
                  register
                </Link>
              </Button>
              <Button edge="start" color="inherit">
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/testSession"
                >
                  testSesh
                </Link>
              </Button>
              <Typography variant="h6" className={classes.title}>
                Kijiji Bot App
              </Typography>
              <Button edge="start" color="inherit">
                {loginArea}
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <div className="body">
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login logUserIn={this.logUser} />
            </Route>
            <Route path="/testSession">
              <TestSession />
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
