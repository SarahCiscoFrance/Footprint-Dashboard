import React, { Component } from "react";
import "./EmissionCard.css";

function precise(x) {
  return Number.parseFloat(x).toPrecision(3);
}

class EmissionCard extends Component {
  // constructor(props){
  //     super(props);
  //     this.state = {
  //     }
  // }

  render() {
    console.log("avion: " + this.props.emission.duration_plane);
    console.log("train: " + this.props.emission.duration_train);
    console.log("voiture: " + this.props.emission.duration_car);
    return (
      <div className="card">
        <h1
          style={{
            textAlign: "center",
            color: "white",
            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
          }}
        >
          {process.env.REACT_APP_LANG === "EN"
            ? "In the current month I made "
            : "Ce mois-ci j'ai effectué "}
          <strong style={{ color: "yellowgreen", fontSize: "115%" }}>
            {this.props.nbCallMonth}
          </strong>
          {process.env.REACT_APP_LANG === "EN"
            ? " calls and saved :"
            : " et permis d'économiser: "}
        </h1>
        <div className="container-card">
          <div className="car">
            <i className="material-icons" style={{ alignSelf: "center" }}>
              directions_car
            </i>
            <h3>
              <strong>{precise(this.props.emission.voiture)}</strong>t
              {process.env.REACT_APP_LANG === "EN" ? " of " : " de "} CO2
            </h3>
            <h3>
              <strong>{this.props.emission.nb_trajet_voiture}</strong>
              {process.env.REACT_APP_LANG === "EN" ? " trip" : " trajet"}
              {this.props.emission.nb_trajet_voiture > 1 ? "s" : ""}
            </h3>
            <h3>
              <strong>{Math.round(this.props.emission.duration_car)}</strong>
              {Math.round(this.props.emission.duration_car) > 1
                ? " hours"
                : " hour"}
            </h3>
          </div>

          <div className="train">
            <i
              className="material-icons"
              style={{ alignSelf: "center", color: "teal" }}
            >
              train
            </i>
            <h3>
              <strong>{precise(this.props.emission.train)}</strong>t
              {process.env.REACT_APP_LANG === "EN" ? " of " : " de "} CO2
            </h3>
            <h3>
              <strong>{this.props.emission.nb_trajet_train}</strong>
              {process.env.REACT_APP_LANG === "EN" ? " trip" : " trajet"}
              {this.props.emission.nb_trajet_train > 1 ? "s" : ""}
            </h3>
            <h3>
              <strong>{Math.round(this.props.emission.duration_train)}</strong>
              {Math.round(this.props.emission.duration_train) > 1
                ? " hours"
                : " hour"}
            </h3>
          </div>

          <div className="flight">
            <i
              className="material-icons"
              style={{ alignSelf: "center", color: "chocolate" }}
            >
              flight
            </i>
            <h3>
              <strong>{precise(this.props.emission.avion)}</strong>t
              {process.env.REACT_APP_LANG === "EN" ? " of " : " de "} CO2
            </h3>
            <h3>
              <strong>{this.props.emission.nb_trajet_avion}</strong>
              {process.env.REACT_APP_LANG === "EN" ? " trip" : " trajet"}
              {this.props.emission.nb_trajet_avion > 1 ? "s" : ""}
            </h3>
            <h3>
              <strong>{Math.round(this.props.emission.duration_plane)}</strong>
              {Math.round(this.props.emission.duration_plane) > 1
                ? " hours"
                : " hour"}
            </h3>
          </div>
        </div>
        <div>
          <h1
            style={{
              textAlign: "center",
              color: "white",
              textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
            }}
          >
            {process.env.REACT_APP_LANG === "EN"
              ? ""
              : "Et à effectué " + this.props.nbCallMonth + " appels"}
          </h1>
        </div>
      </div>
    );
  }
}

export default EmissionCard;
