import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function precise(x) {
  return Number.parseFloat(x).toFixed(2);
}

function createData(CodecName, MacAddress, Time, Trip, CarbonFootprint) {
  return { CodecName, MacAddress, Time, Trip, CarbonFootprint };
}

function totalSum(allData) {
  let total = { hours: 0, trips: 0, carbon: 0 };
  let name;
  let hours;
  let trips;
  let carbon;
  allData.forEach(e => {
    hours = e.duration_car + e.duration_plane + e.duration_train;
    trips = e.nb_trajet_avion + e.nb_trajet_train + e.nb_trajet_voiture;
    carbon = e.avion + e.train + e.voiture;
    total.hours = total.hours + hours;
    total.trips = total.trips + trips;
    total.carbon = total.carbon + carbon;
  });
  return total;
}

function fillTable(allData) {
  console.log("here", allData[0]);
  let tab = [];

  let name;
  let mac;
  let hours;
  let trips;
  let carbon;
  allData.forEach(e => {
    name = e.macAddress.name;
    mac = e.macAddress.mac;
    hours = e.duration_car + e.duration_plane + e.duration_train;
    trips = e.nb_trajet_avion + e.nb_trajet_train + e.nb_trajet_voiture;
    carbon = e.avion + e.train + e.voiture;
    tab.push(createData(name, mac, hours, trips, carbon));
  });
  return tab;
}

class ResumeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      totalValues: {}
    };
  }
  componentDidMount() {
    this.setState({
      isLoaded: true,
      rows: fillTable(this.props.test),
      totalValues: totalSum(this.props.test)
    });
  }

  render() {
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "midnightblue" }}>
              <TableCell>
                <strong style={{ color: "white", fontSize: "large" }}>
                  Codec Name
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong style={{ color: "white", fontSize: "large" }}>
                  Time Saved
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong style={{ color: "white", fontSize: "large" }}>
                  Trip Saved
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong style={{ color: "white", fontSize: "large" }}>
                  Carbon Footprint
                </strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <a
                    href={
                      "http://websrv2.ciscofrance.com:15124/" + row.MacAddress
                    }
                    style={{ textDecoration: "none" }}
                  >
                    {row.CodecName}
                  </a>
                </TableCell>
                <TableCell align="right">
                  {precise(row.Time)} {row.Time > 0 ? "hours" : "hour"}
                </TableCell>
                <TableCell align="right">{row.Trip} trips</TableCell>
                <TableCell align="right">
                  {precise(row.CarbonFootprint)} t of CO2
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                component="th"
                scope="row"
                style={{ color: "green", fontSize: "large" }}
              >
                <strong>TOTAL SAVED</strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {precise(this.state.totalValues.hours)}{" "}
                  {this.state.totalValues.hours > 0 ? "hours" : "hour"}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>{this.state.totalValues.trips} trips</strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {precise(this.state.totalValues.carbon)} t of CO2
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default ResumeTable;
