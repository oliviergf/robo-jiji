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
}));

export default function ApartModal(props) {
  const classes = useStyles();

  //todo: must figure out how to fetch images from here.
  //and build relevant JSX
  const ImagesGallery = () => {
    if (!props.apartInfo) return <div>no images</div>;
    let images;
    const shortlink = props.apartInfo.link.substring(22);
    const dir = `/${shortlink.replace(/\//g, ".")}/`;
    let urls = [];
    for (let i = 0; i < props.apartInfo.photoSize; i++) {
      const urlToFetch = url + dir + i + ".jpeg";
      console.log(urlToFetch);
      urls.push(urlToFetch);
    }

    return <div>bruh</div>;
  };

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
