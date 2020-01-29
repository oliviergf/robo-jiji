import React from "react";
import axios from "axios";

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

    this.handleChange = this.handleChange.bind(this);
    this.handleRegisterInput = this.handleRegisterInput.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      [evt.target.name]: value
    });
    console.log(this.state);
  }

  handleRegisterInput(event) {
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

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleRegisterInput}>
        <label>
          firstname:
          <input
            type="text"
            name="firstname"
            value={this.state.firstname}
            onChange={this.handleChange}
          />
        </label>
        <label>
          lastname:
          <input
            type="text"
            name="lastname"
            value={this.state.lastname}
            onChange={this.handleChange}
          />
        </label>
        <label>
          email:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>
        <label>
          password :
          <input
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <label>
          confirmation :
          <input
            type="text"
            name="confirmation"
            value={this.state.confirmation}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default Register;
