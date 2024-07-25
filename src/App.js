import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ShowDetails from "./components/ShowDetails";
import Booking from "./components/Booking";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/show/:id" component={ShowDetails} />
          <Route path="/book/:id" component={Booking} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
