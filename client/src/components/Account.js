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

/**
 * TODO:
 *       faire le call d'api
 *       mettre les messages d'erreur
 */

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
  const [modify, setModify] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorTelephone, setErrorTelephone] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorOldPassword, setOldErrorPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");

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
    setChangePassword(false);
  };

  const handleClose = () => {};

  const formIsClean = () => {
    let isClean = true;
    if (!isEmail.validate(email) || email !== emailConfirmation) {
      setErrorEmail(true);
      isClean = false;
    } else if (hasInvalidPhoneNumber()) {
      setErrorTelephone(true);
      isClean = false;
    } else if (
      changePassword &&
      (newPassword !== newPasswordConf ||
        newPassword === "" ||
        newPasswordConf === "")
    ) {
      setErrorPassword(true);
      isClean = false;
    }
    console.log("isClean", isClean);
    return isClean;
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

  const handleChangePassword = () => {
    setChangePassword(true);
  };

  const handleChange = evt => {
    if (evt.target.name === "firstname") setFirstname(evt.target.value);
    if (evt.target.name === "lastname") setLastname(evt.target.value);
    if (evt.target.name === "email") setEmail(evt.target.value);
    if (evt.target.name === "telephone") setTelephone(evt.target.value);
    if (evt.target.name === "platform") setPlatform(evt.target.value);
    if (evt.target.name === "oldPassword") setOldPassword(evt.target.value);
    if (evt.target.name === "newPassword") setNewPassword(evt.target.value);
    if (evt.target.name === "newPasswordConf")
      setNewPasswordConf(evt.target.value);
    if (evt.target.name === "emailConfirmation")
      setEmailConfirmation(evt.target.value);
    if (evt.target.name === "telephoneConfirmation")
      setTelephoneConfirmation(evt.target.value);
  };

  const handleEditInput = evt => {
    if (formIsClean()) {
      console.log("sending request");
      //should be put but it doesnt work apparently
      axios
        .put(`${url}/users`, {
          firstname: firstname,
          lastname: lastname,
          email: email,
          telephone: telephone,
          changePassword: changePassword,
          platform: platform,
          oldPassword: oldPassword,
          newPassword: newPassword
        })
        .then(function(response) {
          console.log(response);
          console.log("sending request post?");
        })
        .catch(function(error) {
          console.log("sending request post?");

          console.log(error);
        });
    }
    evt.preventDefault();
  };

  // will only be called once
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
            {changePassword && (
              <div>
                <FormControl>
                  <InputLabel htmlFor="component-simple">
                    {dictio.oldPassword[props.language]}
                  </InputLabel>
                  <Input
                    id="component-simple"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-simple">
                    {dictio.changePassword[props.language]}
                  </InputLabel>
                  <Input
                    id="component-simple"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="component-simple">
                    {dictio.confirmation[props.language]}
                  </InputLabel>
                  <Input
                    id="component-simple"
                    name="newPasswordConf"
                    value={newPasswordConf}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
            )}
            <div>
              {modify ? (
                <div>
                  <Button onClick={handleCancel} value="Submit">
                    {dictio.cancel[props.language]}
                  </Button>
                  <Button onClick={handleChangePassword} value="Submit">
                    {dictio.changePassword[props.language]}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleModify} value="Submit">
                  {dictio.modify[props.language]}
                </Button>
              )}

              {modify && (
                <Button type="submit" value="Submit">
                  {dictio.apply[props.language]}
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
