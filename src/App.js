import React, { useState, useMemo } from "react";
import {
  HashRouter,
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AppContext } from "./components/AppContext";

import  Home  from './components/Home/Home';
// import  ThreexComp  from "./components/Camera/ThreexComp"
import Camera from "./components/Camera/Camera";
import Dashboard from "./components/Dashboard/Dashboard";

function App(props){
  const [angle, setAngle] = useState(0);
  const settingAngle = (v)=> {
    setAngle(v);
  }

  return(
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Dashboard />
        </Route>
        <Route path="/home/:id">
        <AppContext.Provider value={{angle, settingAngle}}>
          <Home /></AppContext.Provider>
        </Route>
        <Route path="/camera">
          <AppContext.Provider value={{angle, settingAngle}}>
          <Camera /></AppContext.Provider>
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
