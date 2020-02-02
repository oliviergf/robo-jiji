import React from "react";
import axios from "axios";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    var self = this;
    axios
      .get("http://localhost:3000/db")
      .then(function(response) {
        // handle success
        console.log(this);
        self.setState({ isLogged: true });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  }

  render() {
    let divToAppear = <div>not logged in</div>;
    if (this.state.isLogged) divToAppear = <div>IS NOW LOGGED IN!</div>;
    return (
      <div>
        press this button to call test db!
        <button onClick={this.handleChange}>press me</button>
        {divToAppear}
      </div>
    );
  }
}
export default Register;
