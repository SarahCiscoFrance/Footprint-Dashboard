import React, { Component } from "react";
import Typical from "react-typical";
import logo from "../cisco_logo.png";
import Clock from "react-live-clock";

class NavBar extends Component {
  // constructor(props){
  //     super(props);
  //     this.state = {
  //     }
  // }

  render() {
    return (
      <div className="navbar">
        <img src={logo} alt={"logo"} className="img" />
        <p style={{ margin: "0%", display: "contents" }}>
          Analytics : Use Webex Meeting !
          {/* <Typical
            steps={[': Use Webex Meeting !', 0]}
            // loop={Infinity} 
            wrapper="p"
            /> */}
        </p>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "3%",
            fontSize: "xx-large"
          }}
        >
          <Clock format={"HH:mm:ss"} ticking={true} timezone={"Europe/Paris"} />
        </div>
      </div>
    );
  }
}

export default NavBar;
