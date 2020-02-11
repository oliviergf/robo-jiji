import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import TestSession from "./components/TestSession";
import "typeface-roboto";
import "./App.css";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { Switch, Route, Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));
function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
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
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/login"
              >
                login
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div className="body">
        <Switch>
          {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/testSession">
            <TestSession />
          </Route>
          <Route path="/">
            <div>This is our home</div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
