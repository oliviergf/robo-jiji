import React from "react";
import axios from "axios";
import { FormControl, InputLabel, Input, Button } from "@material-ui/core/";
import Snackbar from "@material-ui/core/Snackbar";
import dictio from "../assets/dictionary";
import isEmail from "isemail";
import Alert from "./Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router";

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
      openEmailError: false,
      openRequiredFieldsError: false,
      openValidEmailError: false,
      waitingRequest: false,
      registrationSucces: false,
      fireRedirect: false,
      openUsedEmailError: false
    };
  }

  hasAnyBlankField = () => {
    return (
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.email === "" ||
      this.state.emailConfirmation === "" ||
      this.state.password === "" ||
      this.state.confirmation === ""
    );
  };

  triggerErrorEmailUsed = () => {
    this.setState({ openUsedEmailError: true });
  };

  triggerErrorValidEmail = () => {
    this.setState({ openValidEmailError: true });
  };

  triggerErrorRequired = () => {
    this.setState({ openRequiredFieldsError: true });
  };

  triggerErrorEmail = () => {
    this.setState({ openEmailError: true });
  };

  triggerErrorPassword = () => {
    this.setState({ openPassWordError: true });
  };

  handleClose = (event, reason) => {
    this.setState({
      openPassWordError: false,
      openEmailError: false,
      openRequiredFieldsError: false,
      openValidEmailError: false,
      openUsedEmailError: false
    });
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleRegisterInput = evt => {
    if (this.hasAnyBlankField()) {
      this.triggerErrorRequired();
    } else if (!isEmail.validate(this.state.email)) {
      this.triggerErrorValidEmail();
    } else if (this.state.password !== this.state.confirmation) {
      this.triggerErrorPassword();
    } else if (this.state.email !== this.state.emailConfirmation) {
      this.triggerErrorEmail();
    } else {
      this.setState({ waitingRequest: true });
      let self = this;
      axios
        .post("http://localhost:3000/register", {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          password: this.state.password
        })
        .then(function(response) {
          console.log("register response", response);
          if (response.data === "success") {
            self.setState({ waitingRequest: false, registrationSucces: true });
            setTimeout(() => {
              self.setState({ fireRedirect: true });
            }, 1500);
          } else if (response.data === "emailUsed") {
            self.triggerErrorEmailUsed();
          }
        })
        .catch(function(error) {
          this.setState({ waitingRequest: false });

          console.log(error);
        });
    }

    evt.preventDefault();
  };

  render() {
    return (
      <div>
        <form className="registerForm" onSubmit={this.handleRegisterInput}>
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
            {this.state.waitingRequest && <CircularProgress />}
          </div>
        </form>
        <Snackbar
          open={this.state.openRequiredFieldsError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.openRequiredFieldsError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openPassWordError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.pwConfirmError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openEmailError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.emailConfirmError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openValidEmailError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.validEmailError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openUsedEmailError}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="error" onClose={this.handleClose}>
            {dictio.openUsedEmailError[this.props.language]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.registrationSucces}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Alert severity="success" onClose={this.handleClose}>
            {dictio.registerSucces[this.props.language]}
          </Alert>
        </Snackbar>
        {this.state.fireRedirect && <Redirect to={"/home"} />}
      </div>
    );
  }
}
export default Register;
