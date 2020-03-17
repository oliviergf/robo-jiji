import React from "react";
import axios from "axios";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core/";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import dictio from "../assets/dictionary";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * TODO: implement validation and redirect correctly to somewhere when user is logged in
 * https://material-ui.com/components/snackbars/
 */
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      emailConfirmation: "",
      password: "",
      confirmation: "",
      openPassWordError: false,
      openEmailError: false
    };
  }

  triggerErrorEmail = () => {
    this.setState({ openEmailError: true });
  };
  triggerErrorPassword = () => {
    this.setState({ openPassWordError: true });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openPassWordError: false, openEmailError: false });
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    let pushRequest = true;
    if (this.state.password !== this.state.confirmation) {
      pushRequest = false;
      this.triggerErrorPassword();
    }
    if (this.state.email !== this.state.emailConfirmation) {
      pushRequest = false;
      this.triggerErrorEmail();
    }

    if (pushRequest) {
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
    }

    evt.preventDefault();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleRegisterInput}>
          <div>
            <FormControl>
              <InputLabel htmlFor="component-simple">
                {dictio.firstname[this.props.language]}
              </InputLabel>
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
              <InputLabel htmlFor="component-simple">
                {dictio.lastname[this.props.language]}
              </InputLabel>
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
              <InputLabel htmlFor="component-simple">
                {dictio.email[this.props.language]}
              </InputLabel>
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
              <InputLabel htmlFor="component-simple">
                {dictio.confirmation[this.props.language]}
              </InputLabel>
              <Input
                id="component-simple"
                name="emailConfirmation"
                value={this.state.emailConfirmation}
                onChange={this.handleChange}
              />
            </FormControl>
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="component-simple">
                {dictio.password[this.props.language]}
              </InputLabel>
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
              <InputLabel htmlFor="component-simple">
                {dictio.confirmation[this.props.language]}
              </InputLabel>
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
              {dictio.submit[this.props.language]}
            </Button>
          </div>
        </form>
        <Snackbar
          open={this.state.openPassWordError}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Alert severity="error">
            {dictio.pwConfirmError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openEmailError}
          autoHideDuration={6000}
          onClose={this.handleClose}
          TransitionComponent="Fade"
        >
          <Alert severity="error">
            {dictio.emailConfirmError[this.props.language]}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
export default Register;
