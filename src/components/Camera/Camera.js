// import { Layout, Button } from 'antd';
import './Camera.css';

import ReactDOM from "react-dom"
import React from "react"

import {
  useParams
} from "react-router-dom";

import useScript from './useScript';


// route： /camera/1
// 有bug！！！！！

function Camera (){
  const { degree } = useParams();

  useScript('https://aframe.io/releases/1.0.4/aframe.min.js');
  useScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');

  return(
    <div>
      <a-scene embedded arjs>
        <a-assets>
            <a-asset-item id="arrow" src="./arrow/scene.gltf"></a-asset-item>
          </a-assets>
      <a-marker preset="hiro">
        <a-entity position='0 0 0' scale='0.5 0.5 0.5' rotation='0 90 0' gltf-model="#arrow"></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
    </div>
  )
};

export default Camera;

