import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import url from "../assets/serverURL";
import axios from "../services/axios";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  images: {
    maxWidth: 100,
    maxHeight: 100,
  },
}));

export default function ApartModal(props) {
  const createUrls = () => {
    const shortlink = props.apartInfo.link.substring(22);
    const dir = `/${shortlink.replace(/\//g, ".")}/`;
    let urls = [];
    for (let i = 0; i < props.apartInfo.photoSize; i++) {
      const urlToFetch = url + dir + i + ".jpeg";
      urls.push(urlToFetch);
    }
    return urls;
  };

  const [state, setState] = useState({
    photoUrls: createUrls(),
  });

  const putImages = () => {
    return state.photoUrls.map((url, index) => {
      return <img className={classes.images} key={index} src={url} />;
    });
  };

  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          {putImages()}
          {/* <img src="https://localhost:3000/v-chambres-a-louer-colocataire.ville-de-montreal.chambre-superbe-maison-metro-jarry-villeray.1495342377/4.jpeg" /> */}
          <h2 id="transition-modal-title">Transition modal</h2>
          <p id="transition-modal-description">
            react-transition-group animates me.
          </p>
        </div>
      </Fade>
    </Modal>
  );
}
