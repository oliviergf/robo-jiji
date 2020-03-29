import React from "react";
import axios from "./services/axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ZoneMenu from "./components/ZoneMenu";
import Notifications from "./components/Notifications";
import Informations from "./components/Information";
import Bar from "./components/Bar";
import Account from "./components/Account";
import url from "./assets/serverURL";
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
      anchorEl: null,
      width: window.innerWidth,
      height: window.innerHeight,
      language: 0
    };
    this.testBrowserSession();
  }

  changeLanguage = () => {
    this.setState(prevState => ({
      language: prevState.language === 0 ? 1 : 0
    }));
  };

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
      .get(`${url}/sessionLogin`)
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
            changeLanguage={this.changeLanguage}
            isLoggedIn={this.state.isLoggedIn}
            userFirstName={this.state.userFirstName}
            language={this.state.language}
          />
        </div>
        <div className="body">
          <Switch>
            <Route path="/apartements">
              <Home language={this.state.language} />
            </Route>
            <Route path="/informations">
              <Informations language={this.state.language} />
            </Route>
            <Route path="/register">
              <Register language={this.state.language} />
            </Route>
            <Route path="/login">
              <Login
                logUserIn={this.logUserCredentials}
                language={this.state.language}
              />
            </Route>
            <Route path="/account">
              <Account language={this.state.language} />
            </Route>
            <Route path="/map">
              <ZoneMenu language={this.state.language} />
            </Route>
            <Route path="/notifs">
              <Notifications language={this.state.language} />
            </Route>
            <Route path="/">
              <Home language={this.state.language} />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

//with Styles is passed as props.
export default withStyles(styles, { withTheme: true })(App);
