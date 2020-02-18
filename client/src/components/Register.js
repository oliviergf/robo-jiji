import React from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Link
} from "@material-ui/core/";

/**
 * TODO: implement validation and redirect correctly to somewhere when user is logged in
 */
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmation: ""
    };
  }

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    axios
      .post("http://localhost:3000/register", {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        password: this.state.password
      })
      .then(function(response) {
        console.log(response);
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
            <InputLabel htmlFor="component-simple">firstname</InputLabel>
            <Input
              id="component-simple"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleChange}
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <InputLabel htmlFor="component-simple">lastname</InputLabel>
            <Input
              id="component-simple"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handleChange}
            />
          </FormControl>
        </div>
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
          <FormControl>
            <InputLabel htmlFor="component-simple">confirmation</InputLabel>
            <Input
              id="component-simple"
              name="confirmation"
              value={this.state.confirmation}
              onChange={this.handleChange}
            />
          </FormControl>
        </div>
        <div>
          <Button type="submit" value="Submit">
            Submit
          </Button>
        </div>
      </form>
    );
  }
}
export default Register;
