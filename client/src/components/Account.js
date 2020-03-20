import MuiAlert from "@material-ui/lab/Alert";
import React from "react";
import { Container, Box, Button } from "@material-ui/core";
import axios from "../services/axios";
import url from "../assets/serverURL";

export default function Account(props) {
  const fetchUserInfo = () => {
    axios
      .get(`${url}/users`)
      .then(function(response) {
        // handle success
        console.log(response);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  };
  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <Button onClick={fetchUserInfo}>api call</Button>
        </div>
        {/* <div>
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
        </div> */}
      </Box>
    </Container>
  );
}
