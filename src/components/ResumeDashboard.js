import React, { Component } from "react";
import NavBar from "./NavBar";
import ResumeTable from "./ResumeTableV2";
import Weather from "./Weather";
require("dotenv").config();

function precise(x) {
  return Number.parseFloat(x);
}

/**
 * Return all the Mac Address from the object "calls"
 * @param {*} calls: all the call (js object)
 */
function getAllMacAddressAndName(calls) {
  let macAddress = [];
  let tmp = [];
  calls.forEach(call => {
    if (!tmp.includes(call.codec.macAddress)) {
      tmp.push(call.codec.macAddress);
      macAddress.push({
        mac: call.codec.macAddress,
        name: call.codec.systemName
      });
    }
  });
  return macAddress;
}

/**
 * Return the estimate carbon footprint saved by a list of endpoint
 * @param {*} calls : All calls made
 * @param {*} macArray : List of mac address (which represent the list of endpoints that interests us)
 */
var getCallsEmissionPerDevice = function(calls, macArray) {
  return new Promise(function(resolve, reject) {
    let callsEmissionPerDevice = [];
    macArray.forEach(mac => {
      getCallsEmission(calls, mac.mac).then(res => {
        res.macAddress = mac;
        callsEmissionPerDevice.push(res);
      });
    });
    resolve(callsEmissionPerDevice);
  });
};

/**
 * Return the estimate carbon footprint saved by a given endpoint
 * @param {*} calls : All calls made
 * @param {*} mac : The mac address of a endpoint
 */
var getCallsEmission = function(calls, mac) {
  return new Promise(function(resolve, reject) {
    let obj = [];
    let emissionTotal = {
      avion: 0,
      train: 0,
      voiture: 0,
      nb_trajet_voiture: 0,
      nb_trajet_avion: 0,
      nb_trajet_train: 0,
      duration_car: 0,
      duration_plane: 0,
      duration_train: 0
    };

    calls.forEach(call => {
      if (call.codec.macAddress === mac) {
        if (call.footprint.distance_metre < 200000) {
          // inférieur à 200 km => Voiture
          const distance = call.footprint.distance_metre / 1000;
          const duration = distance / 50; // 50km/h : speed of car
          const emission = {
            avion: 0,
            train: 0,
            voiture: precise(call.footprint.dieselCar) / 1000 // convert kg into tonne
          };
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
    });
    resolve(emissionTotal); // emission en CO2 par mois par rapport au mois courant et par catégorie de véhicule
  });
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      resumeEmission: [],
      emission_total: {}
    };
  }
  componentDidMount() {
    this.interval = setInterval(
      () =>
        fetch("http://websrv2.ciscofrance.com:15140/api/call", {
          method: "get"
        })
          .then(res => res.json())
          .then(
            result => {
              getCallsEmissionPerDevice(
                result,
                getAllMacAddressAndName(result)
              ).then(res => {
                this.setState({
                  resumeEmission: res,
                  isLoaded: true
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
      3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { isLoaded } = this.state;
    if (this.state.items) {
      console.log(this.state.nbCalls);
    }
    return (
      <div className="container" style={{ padding: "0%" }}>
        <NavBar />
        <h1
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "7%",
            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
          }}
        >
          All the savings made thanks to the use of Cisco terminals
        </h1>
        <div className="inside">
          <div className="panel" style={{ width: "70%" }}>
            {isLoaded && <ResumeTable test={this.state.resumeEmission} />}
            {!isLoaded && (
              <h3 style={{ textAlign: "center", color: "white" }}>
                Loading...
              </h3>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
