import React, { Component } from "react";
import "./WeatherCard.scss";

const getClassName = (name, descrip) => {
  let className = "";
  if (name === "Clouds") {
    if (descrip === "few clouds") {
      className = "cloud-sun";
    } else {
      className = "cloud";
    }
    return className;
  }
  if (name === "Rain" || name === "Drizzle") {
    className = "cloud-rain";
    return className;
  }
  if (name === "Clear") {
    className = "sun";
    return className;
  }
  if (name === "Snow") {
    className = "snow";
    return className;
  }
  if (
    name === "Mist" ||
    name === "Smoke" ||
    name === "Haze" ||
    name === "Dust" ||
    name === "Fog" ||
    name === "Sand" ||
    name === "Dust" ||
    name === "Squall" ||
    name === "Ash" ||
    name === "Tornado"
  ) {
    className = "cloud";
    return className;
  }
};

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,
      city: this.props.mac === "DC:8C:37:2A:71:24" ? "Oslo" : "Paris", // CHANGE NEEDED HERE
      className: "",
      temp: 0,
      wind: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(
      () =>
        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            this.state.city +
            "&appid=ba837e457a8d41ada4aaf917581dd8c1",
          {
            method: "get"
          }
        )
          .then(res => res.json())
          .then(
            result => {
              //console.log(result.weather[0].main);
              this.setState({
                isLoaded: true,
                temp: Math.round(result.main.temp - 273.15), // Convert from Kelvin to C°
                className: getClassName(
                  result.weather[0].main,
                  result.weather[0].description
                ),
                wind: result.wind.speed
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
      2000
    ); // Component refresh every 2 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    //console.log(this.state.className);
    const { isLoaded } = this.state;
    return (
      <div className="weather-wrapper">
        {isLoaded && (
          <div className="weather-card">
            <div className={"weather-icon " + this.state.className}></div>
            <h1>{this.state.temp}º</h1>
            <p>{this.state.city}</p>
            <p style={{ marginLeft: "40%", fontSize: "20px" }}>
              {process.env.REACT_APP_LANG === "EN" ? "wind " : "vent "}
              {this.state.wind} m/s
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default Weather;
