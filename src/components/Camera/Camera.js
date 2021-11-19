// import './Camera.css';
// import React from "react"
// import {
//   useParams
// } from "react-router-dom";
// const THREE = require('three');
// const THREEAR = require('threear');

// import useScript from './useScript';


// route： /camera/1
// 有bug！！！！！

// function Camera (){
//   const { degree } = useParams();

//   // useScript('https://aframe.io/releases/1.0.4/aframe.min.js');
//   // useScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');

//   var scene = new THREE.Scene();
//     var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//     camera.position.z = 0;

//     var renderer = new THREE.WebGLRenderer({
// 				// antialias	: true,
// 				alpha: true
// 			});
// 		renderer.setClearColor(new THREE.Color('lightgrey'), 0)
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     renderer.domElement.style.position = 'absolute'
// 		renderer.domElement.style.top = '0px'
// 		renderer.domElement.style.left = '0px'
//     document.body.appendChild( renderer.domElement );

//     var markerGroup = new THREE.Group();
// 		scene.add(markerGroup);

//     var source = new THREEAR.Source({ renderer, camera });

//     THREEAR.initialize({ source: source }).then((controller) => {
//       var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//       var material = new THREE.MeshNormalMaterial();
//       var cube = new THREE.Mesh( geometry, material );
//       scene.add( cube );
//       markerGroup.add(cube)
//       var path = "../../../data/patt.hiro";
//       var patternMarker = new THREEAR.PatternMarker({
//             patternUrl: path,
//             markerObject: markerGroup
//           });
//       controller.trackMarker(patternMarker);

//       requestAnimationFrame(function animate(nowMsec){
//         // measure time
// 				var lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
// 				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
// 				lastTimeMsec = nowMsec;
// 	      renderer.render( scene, camera );
//         controller.update( source.domElement );
//         cube.rotation.x += 0.01;
//         cube.rotation.y += 0.01;
//         // keep looping
// 			  requestAnimationFrame( animate );
//         });
//     });

//   return(
//     <div></div>
//   )
// };

// export default Camera;

import {  Button } from 'antd';
import React, {useState, useEffect} from "react";

import ThreexComp from './ThreexComp';


import {
  useParams
} from "react-router-dom";



function Camera(){

  const { navi } = useParams();

  const [dest, setDest] = useState('0');
  const [compass, setCompass] = useState(0);

  const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

  // 获取目标方位
  const handleClick = ()=>{
    alert("clicked");
    startCompass(); //东南西北testing
  };
  

  function startCompass() {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("has to be allowed!");
          }
        })
        .catch(() => alert("not supported"));
    }
    if (!isIOS) {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  }
  function handler(e) {
    let degree = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  
    if (
        (compass + 15 < Math.abs(degree)) ||
        compass > Math.abs(degree + 15) 
      ){
        setCompass(degree);
      }
  }

    startCompass()

  return (
    <>
          {/* <Link to = {`/camera/${navi}`}> 跳转到ar camera*/}
              <button onClick={handleClick}>Show direction</button>
          {/* </Link> */}

          {/* 东南西北testing 只有手机能看到*/}
          <div>The direction is: {navi}</div>
          <div>device orientation is: {compass}</div>
          <div>target orientation is: {compass-navi}</div>

         <ThreexComp result={navi} />
    </>
  );
}


export default Camera;