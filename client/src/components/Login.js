import React from "react";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
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
      .post("http://localhost:3000/login", {
        username: this.state.email,
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
          email:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>
        <label>
          password:
          <input
            type="text"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>

        <input type="submit" value="Login" />
      </form>
    );
  }
}
export default Login;
