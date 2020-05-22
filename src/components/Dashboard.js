import React, { Component } from "react";
import NavBar from "./NavBar";
import Card from "./Card";
import Weather from "./Weather";
require("dotenv").config();

function precise(x) {
  return Number.parseFloat(x);
}

function getCallsInfo(calls, mac) {
  const d = new Date();
  var currentMonth = d.getMonth();
  var currentYear = d.getFullYear();
  let nb_calls = 0;
  let nb_calls_month = 0;
  calls.forEach(call => {
    let perMonth = false;
    const callDate = new Date(call.callHistory.StartTime);
    const callMonth = callDate.getMonth();
    const callYear = callDate.getFullYear();
    if (callYear === currentYear && callMonth === currentMonth) {
      perMonth = true;
    }
    if (call.codec.macAddress === mac) {
      nb_calls++;
      if (perMonth) {
        nb_calls_month++;
      }
    }
  });
  return {
    nb_calls: nb_calls,
    nb_calls_month: nb_calls_month
  };
}

var getCallsEmission = function(calls, mac) {
  return new Promise(function(resolve, reject) {
    const d = new Date();
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();
    let obj = [];
    let emissionTotal = {
      avion: 0,
      train: 0,
      voiture: 0,
      prix_voiture: 0,
      prix_avion: 0,
      prix_train: 0,
      nb_trajet_voiture: 0,
      nb_trajet_avion: 0,
      nb_trajet_train: 0,
      duration_car: 0,
      duration_plane: 0,
      duration_train: 0
    };
    // const regexSarah = RegExp('sarah@cisco*');
    // const regexPierre = RegExp('pierre@cisco*');
    // const regexBruno = RegExp('btouret@cisco*');
    calls.forEach(call => {
      let perMonth = false;
      const callDate = new Date(call.callHistory.StartTime);
      const callMonth = callDate.getMonth();
      const callYear = callDate.getFullYear();
      if (callYear === currentYear && callMonth === currentMonth) {
        perMonth = true;
      }

      if (call.codec.macAddress === mac && perMonth) {
        if (call.footprint.distance_metre < 200000) {
          // inférieur à 200 km => Voiture
          const distance = call.footprint.distance_metre / 1000;
          const duration = distance / 50; // 50km/h : speed of car
          const emission = {
            avion: 0,
            train: 0,
            voiture: precise(call.footprint.dieselCar) / 1000 // convert kg into tonne
          };
          console.log("ok");
          emissionTotal.duration_car = emissionTotal.duration_car + duration;
          emissionTotal.nb_trajet_voiture++;
          obj.push(emission);
        } else if (
          call.footprint.distance_metre > 200000 &&
          call.footprint.distance_metre < 1000000
        ) {
          // entre 200 et 1000 km => Train
          const distance = call.footprint.distance_metre / 1000;
          const duration = distance / 320; // 320km/h : speed of train
          const emission = {
            avion: 0,
            train: precise(call.footprint.transitRail) / 1000,
            voiture: 0
          };
          emissionTotal.duration_train =
            emissionTotal.duration_train + duration;
          emissionTotal.nb_trajet_train++;
          obj.push(emission);
        } else if (call.footprint.distance_metre > 1000000) {
          // supérieur à 1000 km => Avion
          const distance = call.footprint.distance_metre / 1000;
          const duration = distance / 810; // 810km/h : speed of a plane
          const emission = {
            avion: precise(call.footprint.firstclassFlight) / 1000,
            train: 0,
            voiture: 0
          };
          emissionTotal.duration_plane =
            emissionTotal.duration_plane + duration;
          emissionTotal.nb_trajet_avion++;
          obj.push(emission);
        }
      }
    });
    obj.forEach(e => {
      emissionTotal.avion = emissionTotal.avion + e.avion;
      emissionTotal.train = emissionTotal.train + e.train;
      emissionTotal.voiture = emissionTotal.voiture + e.voiture;
      // emissionTotal.prix_voiture = emissionTotal.prix_voiture + e.prix_voiture;
      // emissionTotal.prix_avion = emissionTotal.prix_avion + e.prix_avion;
      // emissionTotal.prix_train = emissionTotal.prix_train + e.prix_train;
    });
    resolve(emissionTotal); // emission en CO2 par mois par rapport au mois courant et par catégorie de véhicule
  });
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      items: [],
      nbCalls: 0,
      nbCalls_month: 0,
      mac: "",
      emission_total: {}
    };
  }
  componentDidMount() {
    console.log(this.props.mac);
    this.interval = setInterval(
      () =>
        fetch("http://websrv2.ciscofrance.com:15140/api/call", {
          method: "get"
        })
          .then(res => res.json())
          .then(
            result => {
              getCallsEmission(result, this.props.mac).then(res => {
                this.setState({
                  isLoaded: true,
                  items: result,
                  nbCalls: getCallsInfo(result, this.props.mac).nb_calls,
                  nbCalls_month: getCallsInfo(result, this.props.mac)
                    .nb_calls_month,
                  emission_total: res
                });
              });
            },
            // Remarque : il est important de traiter les erreurs ici
            // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
            // des exceptions provenant de réels bugs du composant.
            error => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          ),
      4000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    console.log(process.env.REACT_APP_LANG);
    const { isLoaded } = this.state;
    if (this.state.items) {
      console.log(this.state.nbCalls);
      console.log(this.state.emission_total.prix_avion);
    }
    return (
      <div className="container" style={{ padding: "0%" }}>
        <NavBar />
        <Weather mac={this.props.mac} />
        <div className="inside">
          <div className="panel">
            {isLoaded && (
              <Card
                emission={this.state.emission_total}
                nbCallMonth={this.state.nbCalls_month}
              />
            )}
            {!isLoaded && (
              <h3 style={{ textAlign: "center", color: "white" }}>
                Loading...
              </h3>
            )}
          </div>
        </div>
        <div>
          <h1
            style={{
              padding: "5%",
              textAlign: "center",
              color: "white",
              textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
            }}
          >
            {process.env.REACT_APP_LANG === "EN"
              ? "I managed "
              : "Depuis sa mise en service ce terminal a permis d'effectuer : "}

            <strong style={{ color: "yellowgreen", fontSize: "115%" }}>
              {this.state.nbCalls}
            </strong>

            {process.env.REACT_APP_LANG === "EN"
              ? " calls since I am Alive !!!"
              : " appels"}
          </h1>
        </div>
      </div>
    );
  }
}

export default Dashboard;
