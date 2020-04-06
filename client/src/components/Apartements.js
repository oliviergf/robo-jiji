import MuiAlert from "@material-ui/lab/Alert";

import { Container, Box, Button } from "@material-ui/core";
import dictio from "../assets/dictionary";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import url from "../assets/serverURL";
import axios from "../services/axios";
import moment from "moment";
const useStyles = makeStyles({ colWidth: "1rem" });

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData(1, 159, 6.0, 24, 4.0),
//   createData(2, 237, 9.0, 37, 4.3),
//   createData(3, 262, 16.0, 24, 6.0),
//   createData(4, 305, 3.7, 67, 4.3),
//   createData(5, 356, 16.0, 49, 3.9),
// ];

export default function Apartements(props) {
  // will only be called once
  useEffect(() => {
    fetchUserApartementList();
  }, []);

  const parseAparts = (aparts) => {
    console.log(aparts);
    aparts.map((apart) => {
      const today = moment();
      const creationDate = moment(apart.createdAt);
      if (creationDate.isBefore(today, "d")) {
        apart.createdAt = creationDate.format("D/M");
      } else {
        apart.createdAt = creationDate.format("HH:mm");
      }
    });
    return aparts;
  };

  const fetchUserApartementList = () => {
    axios
      .get(`${url}/apartements`)
      .then(function (response) {
        // handle success
        const parsedAparts = parseAparts(response.data.data);
        setState({ ...state, aparts: parsedAparts });
        console.log(state);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };
  const classes = useStyles();
  const [state, setState] = useState({ aparts: [] });
  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <h1>apartements</h1>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow className={classes.colWidth}>
                  <TableCell> :) </TableCell>
                  <TableCell>#</TableCell>
                  <TableCell align="right">
                    {dictio.timeFetch[props.language]}
                  </TableCell>
                  <TableCell align="right">
                    {dictio.price[props.language]}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.aparts.length !== 0 &&
                  state.aparts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        :)
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row._id}
                      </TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </Container>
  );
}
