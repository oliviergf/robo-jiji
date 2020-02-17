import React from "react";
import axios from "./services/axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ZoneMenu from "./components/ZoneMenu";
import Bar from "./components/Bar";
import "typeface-roboto";
import "./App.css";

import { Switch, Route } from "react-router-dom";
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

  logoutHandeler = () => {
    this.setState({ isLoggedIn: false, userFirstName: "" });
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

    return (
      <div className="App">
        <div className={classes.root}>
          <Bar
            userLoggedOut={this.logoutHandeler}
            isLoggedIn={this.state.isLoggedIn}
            userFirstName={this.state.userFirstName}
          />
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
