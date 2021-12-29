import './Dashboard.css';
import React, {useState} from "react";

import {
  BrowserRouter as Router,
  Link, 
  withRouter
} from "react-router-dom";

function Dashboard(props) {
  const [loc, setLoc] = useState(0);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Please input your location</div>
      <input onChange={(e)=>setLoc(e.target.value)}></input><br/>
      <button onClick={()=>{props.history.push("/home/"+loc);}}>Confirm</button>
      <button onClick={()=>{props.history.push("/camera");}}>(testing)Show Camera</button>
    </div>
  );
}

export default withRouter(Dashboard);
