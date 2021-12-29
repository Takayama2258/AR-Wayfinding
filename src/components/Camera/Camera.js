import './Camera.css';

import React, {useContext} from "react";
import { withRouter } from 'react-router-dom';

import ThreexComp from './ThreexComp';
import { AppContext } from "../AppContext";


function Camera(props){

  const {angle, settingAngle} = useContext(AppContext);
  console.log("camera:::angle:::",angle);

  return (
    <div>
         <ThreexComp angle={angle}/>
    </div>
  );
}

export default withRouter(Camera);