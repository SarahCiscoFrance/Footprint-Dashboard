import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ResumeDashboard from "./components/ResumeDashboard";

const Dashboard1 = ({ match, location }) => {
  return (
    <div>
      <Dashboard mac={match.params.mac} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Route path="/:mac" component={Dashboard1} />
      <Route path="/home" component={ResumeDashboard} />
    </Router>
  );
}

export default App;
