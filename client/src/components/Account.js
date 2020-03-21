import MuiAlert from "@material-ui/lab/Alert";
import dictio from "../assets/dictionary";
import React, { useState, useEffect } from "react";
import { Container, Box } from "@material-ui/core";
import axios from "../services/axios";
import url from "../assets/serverURL";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import isEmail from "isemail";

import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormLabel,
  FormControlLabel
} from "@material-ui/core/";

export default function Account(props) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [telephoneConfirmation, setTelephoneConfirmation] = useState("");
  const [platform, setPlatform] = useState("");
  const [fireRedirect, setFireRedirect] = useState(false);
  const [waitingRequest, setWaitingRequest] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorTelephone, setErrorTelephone] = useState(false);
  const [modify, setModify] = useState(false);

  const hasInvalidPhoneNumber = () => {
    if (platform === "apple") return false;
    const isnum = /^\d+$/.test(telephone);

    return (
      (platform === "android" && !isnum) ||
      telephone !== telephoneConfirmation ||
      telephone === "" ||
      telephoneConfirmation === ""
    );
  };

  const handleModify = () => {
    setModify(true);
  };

  const handleCancel = () => {
    fetchUserInfo();
    setModify(false);
  };

  const lookForTriggers = () => {
    let sendRequest = true;
    if (!isEmail.validate(email) || email !== emailConfirmation) {
      setErrorEmail(true);
      sendRequest = false;
    } else if (hasInvalidPhoneNumber()) {
      setErrorTelephone(true);
      sendRequest = false;
    }
  };

  const fetchUserInfo = () => {
    setWaitingRequest(true);
    axios
      .get(`${url}/users`)
      .then(function(response) {
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setTelephone(response.data.telephone);
        setPlatform(response.data.platform);
        setEmail(response.data.email);
        setWaitingRequest(false);
      })
      .catch(function(error) {
        console.log(error);
        setWaitingRequest(false);
      });
  };

  const handleChange = evt => {
    if (evt.target.name === "firstname") setFirstname(evt.target.value);
    if (evt.target.name === "lastname") setLastname(evt.target.value);
    if (evt.target.name === "email") setEmail(evt.target.value);
    if (evt.target.name === "telephone") setTelephone(evt.target.value);
    if (evt.target.name === "platform") setPlatform(evt.target.value);
    if (evt.target.name === "emailConfirmation")
      setEmailConfirmation(evt.target.value);
    if (evt.target.name === "telephoneConfirmation")
      setTelephoneConfirmation(evt.target.value);
  };

  const handleEditInput = () => {
    if (lookForTriggers()) {
      // axios
      //   .put(`${url}/users`, {
      //     zoneId: newZone.id,
      //     path: points,
      //     name: name
      //   })
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <form className="registerForm" onSubmit={handleEditInput}>
            <div>
              <FormControl>
                <InputLabel htmlFor="component-simple">
                  {dictio.firstname[props.language]}
                </InputLabel>
                <Input
                  id="component-simple"
                  name="firstname"
                  value={firstname}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="component-simple">
                  {dictio.lastname[props.language]}
                </InputLabel>
                <Input
                  id="component-simple"
                  name="lastname"
                  value={lastname}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="component-simple">
                  {dictio.email[props.language]}
                </InputLabel>
                <Input
                  id="component-simple"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </FormControl>
            </div>
            {modify && (
              <div>
                <FormControl>
                  <InputLabel htmlFor="component-simple">
                    {dictio.confirmation[props.language]}
                  </InputLabel>
                  <Input
                    id="component-simple"
                    name="emailConfirmation"
                    value={emailConfirmation}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
            )}
            <div>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Platforme"
                  name="platform"
                  value={platform}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="apple"
                    control={<Radio />}
                    label="Apple"
                  />
                  <FormControlLabel
                    value="android"
                    control={<Radio />}
                    label="Android"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div>
              {platform === "android" && (
                <div>
                  <FormControl>
                    <InputLabel htmlFor="component-simple">
                      {dictio.telephoneNumber[props.language]}
                    </InputLabel>
                    <Input
                      id="component-simple"
                      name="telephone"
                      value={telephone}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}
              {platform === "android" && modify && (
                <div>
                  <FormControl>
                    <InputLabel htmlFor="component-simple">
                      {dictio.telephoneNumberConfirmation[props.language]}
                    </InputLabel>
                    <Input
                      id="component-simple"
                      name="telephoneConfirmation"
                      value={telephoneConfirmation}
                      onChange={handleChange}
                    />
                  </FormControl>
                </div>
              )}
            </div>

            {/* <div>
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
            </div> */}
            {/* <div>
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
            </div> */}
            <div>
              {modify ? (
                <Button onClick={handleCancel} value="Submit">
                  {dictio.cancel[props.language]}
                </Button>
              ) : (
                <Button onClick={handleModify} value="Submit">
                  {dictio.modify[props.language]}
                </Button>
              )}

              {modify && (
                <Button type="submit" value="Submit">
                  {dictio.submit[props.language]}
                </Button>
              )}
              {waitingRequest && <CircularProgress />}
            </div>
          </form>
          {/* <Snackbar
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
          </Snackbar> */}
          {fireRedirect && <Redirect to={"/home"} />}
        </div>
      </Box>
    </Container>
  );
}
