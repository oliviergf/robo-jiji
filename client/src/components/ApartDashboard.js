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
import ApartModal from "./ApartModal";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { askPushPermission } from "../services/pushManager";

import VisibilityIcon from "@material-ui/icons/Visibility";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
const useStyles = makeStyles({
  colWidth: "1rem",
  container: {
    maxHeight: 440,
  },
});

export default function Apartements(props) {
  const classes = useStyles();
  const [seeAllUserAparts, setseeAllUserAparts] = useState(false);
  const [state, setState] = useState({
    aparts: [],
    sorter: "",
    direction: "desc",
    sortDate: false,
    sortPrice: false,
    openModal: false,
    apartInfo: null,
    lookedApart: "",
  });

  useEffect(() => {
    fetchUserApartementList(seeAllUserAparts);
  }, []);

  const parseAparts = (aparts) => {
    aparts.map((apart) => {
      const today = moment();
      const creationDate = moment(apart.createdAt);

      if (creationDate.isBefore(today, "d")) {
        //is not today
        apart.absoluteDate = creationDate;
        apart.createdAt = creationDate.format("D/M");
      } else {
        apart.absoluteDate = creationDate;
        apart.createdAt = creationDate.format("HH:mm");
      }
    });
    return aparts;
  };

  //seeAllUserApartsParam is not state because setstate is async and  we change it
  //before query when smashing button handleSeeAllUserApart
  const fetchUserApartementList = (seeAllUserApartsParam) => {
    axios
      .get(`${url}/apartements`, {
        params: {
          seeAllUserAparts: seeAllUserApartsParam,
        },
      })
      .then(function (response) {
        // handle success
        let parsedAparts = parseAparts(response.data.data);
        const sortedAparts = parsedAparts.sort((a, b) => {
          return b.absoluteDate.diff(a.absoluteDate);
        });
        setState({ ...state, aparts: sortedAparts });
      })
      .catch(function (error) {
        // handle error hello
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const sortAparts = (type) => {
    if (!state.aparts) return;
    const sortedArray = state.aparts.sort((a, b) => {
      if (type === "date") {
        if (state.direction === "asc") {
          return a.absoluteDate.diff(b.absoluteDate);
        } else {
          return b.absoluteDate.diff(a.absoluteDate);
        }
      } else {
        if (state.direction === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      }
    });

    return sortedArray;
  };

  const sortHandeler = (type) => {
    if (type === "date") {
      setState({
        ...state,
        sortDate: true,
        sortPrice: false,
        direction: state.direction === "asc" ? "desc" : "asc",
        aparts: sortAparts("date"),
      });
    } else {
      setState({
        ...state,
        sortDate: false,
        sortPrice: true,
        direction: state.direction === "asc" ? "desc" : "asc",
        aparts: sortAparts("price"),
      });
    }
  };

  const sortHandelerDate = () => {
    sortHandeler("date");
  };
  const sortHandelerPrice = () => {
    sortHandeler("price");
  };

  const handleSeeAllUserApart = () => {
    setseeAllUserAparts(!seeAllUserAparts);
    fetchUserApartementList(!seeAllUserAparts);
  };

  const seenApart = (apartId) => {
    axios
      .post(`${url}/apartVue`, {
        apartId: apartId,
      })
      .then(function (response) {})
      .catch(function (error) {});
    props.clickSeenApart();
  };

  const handleOpen = (id) => {
    axios
      .get(`${url}/apartVue`, {
        params: {
          id: id,
        },
      })
      .then(function (response) {
        setState({
          ...state,
          openModal: true,
          fetchedApart: response.data.apartInfos,
          lookedApart: id,
        });
        seenApart(id);
      })
      .catch(function (error) {
        // handle error hello
        console.log(error);
      })
      .then(function () {});
  };

  const handleClear = () => {
    axios
      .put(`${url}/etcAparts`)
      .then(function (response) {
        fetchUserApartementList(seeAllUserAparts);
        props.clearSeenAparts();
      })
      .catch(function (error) {
        // handle error hello
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const handleClose = () => {
    let apartsWithSeenOne = state.aparts.map((apt) => {
      if (apt._id === state.lookedApart) {
        apt.seen = true;
      }
      return apt;
    });
    setState({
      ...state,
      openModal: false,
      aparts: apartsWithSeenOne,
    });
  };

  return (
    <Container className="home">
      <Box justifyContent="center" alignItems="center">
        <div>
          <h1>apartements</h1>
          <TableContainer className={classes.container} component={Paper}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className={classes.table}
            >
              <TableHead>
                <TableRow className={classes.colWidth}>
                  <TableCell>#</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Zone</TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={state.sortDate}
                      direction={state.direction}
                      onClick={sortHandelerDate}
                      name="date"
                    >
                      {dictio.timeFetch[props.language]}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={state.sortPrice}
                      direction={state.direction}
                      onClick={sortHandelerPrice}
                      name="price"
                    >
                      {dictio.price[props.language]}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.aparts.length !== 0 &&
                  state.aparts.map((row, index) => (
                    <TableRow
                      key={row._id}
                      onClick={() => {
                        handleOpen(row._id);
                      }}
                      name={row._id}
                    >
                      <TableCell component="th" scope="row">
                        {row._id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {!row.seen && <NewReleasesIcon />}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.zoneName}
                      </TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <Button onClick={handleClear}>clear</Button>
          </div>
          <div>
            <Button
              color={seeAllUserAparts ? "primary" : "secondary"}
              onClick={handleSeeAllUserApart}
            >
              see all userAparts
            </Button>
          </div>
          {state.openModal && (
            <ApartModal
              open={state.openModal}
              apartInfo={state.fetchedApart}
              handleClose={handleClose}
            />
          )}
        </div>
      </Box>
    </Container>
  );
}
