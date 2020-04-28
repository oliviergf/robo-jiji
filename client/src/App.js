import React from "react";
import axios from "./services/axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import ZoneMenu from "./components/ZoneMenu";
import Notifications from "./components/Notifications";
import Informations from "./components/Information";
import Apartements from "./components/ApartDashboard";
import Bar from "./components/Bar";
import Account from "./components/Account";
import url from "./assets/serverURL";
import { askPushPermission } from "./services/pushManager";

import "typeface-roboto";
import "./style/App.css";

import { Switch, Route } from "react-router-dom";

// use this to geek flexbox https://flexboxfroggy.com/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userFirstName: "",
      anchorEl: null,
      language: 0,
      isInsideWizzard: false,
    };
    this.testBrowserSession();
  }

  changeLanguage = () => {
    this.setState((prevState) => ({
      language: prevState.language === 0 ? 1 : 0,
    }));
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logoutHandeler = () => {
    this.setState({ isLoggedIn: false, userFirstName: "" });
  };

  logUserCredentials = (user) => {
    this.setState({
      isLoggedIn: true,
      userFirstName: user.firstname,
      unSeenCount: user.unSeenCount,
    });

    if (user.userSubscription !== 0)
      askPushPermission(this.onNotificationReception);
  };

  onNotificationReception = (payload) => {
    const aparts = JSON.parse(payload.data.aparts);
    let unSeenCount = this.state.unSeenCount + aparts.length;
    this.setState({ unSeenCount: unSeenCount });
  };

  clearSeenAparts = () => {
    this.setState({ unSeenCount: 0 });
  };

  clickSeenApart = () => {
    if (this.state.unSeenCount === 0) return;
    let unSeenCount = this.state.unSeenCount - 1;

    this.setState({ unSeenCount: unSeenCount });
  };

  //gets called when user press back button in nav bar
  backClicked = () => {
    console.log("backed pressed");
  };

  //test whether the current browser contains a valid session
  testBrowserSession = () => {
    let self = this;
    axios
      .get(`${url}/sessionLogin`)
      .then(function (response) {
        self.logUserCredentials(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <div>
          <Bar
            isLoggedIn={this.state.isLoggedIn}
            userLoggedOut={this.logoutHandeler}
            changeLanguage={this.changeLanguage}
            userFirstName={this.state.userFirstName}
            language={this.state.language}
            backClicked={this.backClicked}
            isInsideWizzard={this.state.isInsideWizzard}
          />
        </div>
        <div className="body">
          <Switch>
            <Route path="/apartements">
              <Apartements
                language={this.state.language}
                clickSeenApart={this.clickSeenApart}
                clearSeenAparts={this.clearSeenAparts}
              />
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
              <Notifications
                language={this.state.language}
                onNotificationReception={this.onNotificationReception}
              />
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
export default App;
