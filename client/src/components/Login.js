import React from "react";
import axios from "../services/axios";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core/";
import { Redirect } from "react-router";
import dictio from "../assets/dictionary";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "./Alert";
import url from "../assets/serverURL";

/**
 * TODO: ajouter validation du input et afficher a l'utilisateur why son nom fuck
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fireRedirect: false,
      openLoginError: false
    };
  }

  triggerError = () => {
    this.setState({
      openLoginError: true
    });
  };

  handleClose = (event, reason) => {
    this.setState({
      openLoginError: false
    });
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    if (this.state.email !== "" && this.state.password !== "") {
      let self = this;
      axios
        .post(`${url}/login`, {
          email: this.state.email,
          password: this.state.password
        })
        .then(function(response) {
          if (response.status === 200) {
            self.props.logUserIn(response.data);
            self.setState({ fireRedirect: true });
          }
        })
        .catch(function(error) {
          console.log(error);
          if (error.response && error.response.status === 401) {
            self.triggerError();
          }
        });
    }

    evt.preventDefault();
  };

  render() {
    const { fireRedirect } = this.state;
    return (
      <div>
        <form onSubmit={this.handleRegisterInput}>
          <div>
            <FormControl>
              <InputLabel htmlFor="component-simple">email</InputLabel>
              <Input
                id="component-simple"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormControl>
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="component-simple">password</InputLabel>
              <Input
                id="component-simple"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </FormControl>
          </div>
          <div>
            <Button type="submit" value="login">
              {dictio.enter[this.props.language]}
            </Button>
          </div>
        </form>
        <Snackbar
          open={this.state.openLoginError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.badLogin[this.props.language]}
          </Alert>
        </Snackbar>
        {fireRedirect && <Redirect to={"/home"} />}
      </div>
    );
  }
}
export default Login;
