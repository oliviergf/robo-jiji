import React from "react";
import axios from "../services/axios";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core/";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    axios
      .post("http://localhost:3000/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(function(response) {
        //sends back username
      })
      .catch(function(error) {
        console.log(error);
      });

    evt.preventDefault();
  };

  render() {
    return (
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
            login
          </Button>
        </div>
      </form>
    );
  }
}
export default Login;
