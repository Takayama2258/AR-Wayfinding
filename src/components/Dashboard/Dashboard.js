import './Dashboard.css';
import React, {useState} from "react";

import {
  withRouter
} from "react-router-dom";

function Dashboard(props) {
  const [loc, setLoc] = useState(0);

  return (
    <div>
      <h2>Dashboard (this is for testing)</h2>
      <div>Please input your location</div>
      <input onChange={(e)=>setLoc(e.target.value)}></input><br/>
      <button onClick={()=>{props.history.push("/home/"+loc);}}>Confirm</button>
    </div>
  );
}

export default withRouter(Dashboard);
