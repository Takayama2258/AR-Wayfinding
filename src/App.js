import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import  Home  from './components/Home/Home';
import  Camera  from "./components/Camera/Camera"

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route path="/home/:id">
        <Home />
      </Route>
      <Route path="/camera/:degree">
        <Camera />
      </Route>
    </Switch>
  </Router>
);

function Dashboard() {
  return (
    <div>
      <h2>Index</h2>
      <Router>
      <ul>
          <li>
             <Link to="/home/1">Home</Link>
          </li>
          <li>
            <Link to="/camera/0">Camera</Link>
          </li>
        </ul>
      </Router>
    </div>
  );
}

export default App;
