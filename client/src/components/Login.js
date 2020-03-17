import React from "react";
import axios from "../services/axios";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core/";
import { Redirect } from "react-router";
import dictio from "../assets/dictionary";

/**
 * TODO: ajouter validation du input et afficher a l'utilisateur why son nom fuck
 */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fireRedirect: false
    };
  }

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    let self = this;
    axios
      .post("http://localhost:3000/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(function(response) {
        //send back userdata to App component
        self.props.logUserIn(response.data);
        self.setState({ fireRedirect: true });
        //redirects to home
        // history.push("/home");
      })
      .catch(function(error) {
        console.log(error);
      });

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
        {fireRedirect && <Redirect to={"/home"} />}
      </div>
    );
  }
}
export default Login;
