import React from "react";
import axios from "axios";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = { firstname: "", lastname: "", email: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      [evt.target.name]: value
    });
    console.log(this.state);
  }

  handleSubmit(event) {
    // Make a request for a user with a given ID
    axios
      .post("http://localhost:3000/register", {
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        email: this.state.email
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default Register;
