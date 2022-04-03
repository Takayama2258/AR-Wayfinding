import React, { useEffect, useState } from "react";
import $ from 'jquery' ;
import locationIcon from '../images/location.png';
import locationIconNew from '../images/locationNew.png'

const { forwardRef, useImperativeHandle } = React;

const Picture = forwardRef((props, ref) => {

  // get source & dest
  const {mapId, source, destination} = props;
  const [mapUrl, setMapUrl] = useState();

  useImperativeHandle(ref, () => ({
    onFetchLabel(){
      fetchInitialLabels();
    }
    }));

  //initialize fetch
  function fetchInitialLabels(){
    $('.path').remove();
    if(mapUrl && destination >= 0){
      fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/path?source=${source}&destination=${destination}`)
    .then(res => res.json())
    .then(data => {
      let nodes = data['data']['Path'];
      let isFloor = data['data']['IsSameFloor'];
      let Floor = data['data']['Floor'];
      let prevNode;
      let index = 0;
      for (let label in nodes){
        let imgSpot = {x: nodes[label].Longitude, y:nodes[label].Latitude}
        if(index==0){
          drawInitialLabels(imgSpot,false);
        }
        else{
          drawInitialLabels(imgSpot,true);
        }
        if(prevNode){
          if(index==1){
            createPoints(prevNode,imgSpot,true);
          }
          else{
            createPoints(prevNode,imgSpot,false);
          }
        }
        prevNode=imgSpot;
        index++;
      }
      if(!isFloor){
        let bubble = `<div class='path' style="border: 1px solid #cccccc; border-radius: 5px;">Please go to floor ${Floor} in this way</div>`;
        $('.container').append(bubble);
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
    }
    else{
      fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/admin/map/filter/id?id=${mapId}`)
      .then(res => res.json())
      .then(data => {
        setMapUrl(data['data']['Map']['Url']);
      })
    }
  }

  function drawInitialLabels(imgSpot,index) {
    let imgEl = document.getElementById("imageId");
    let img_x = locationLeft(imgEl);
    let img_y = locationTop(imgEl);
    let img_width = imgEl.offsetWidth;
    let img_height = imgEl.offsetHeight;
    var displaySpot = {x: imgSpot.x*img_width+img_x, y: imgEl.offsetHeight-imgSpot.y*img_height+img_y};
    if(index==0){
      addHotspot(displaySpot,imgSpot,false);
    }
    else{
      addHotspot(displaySpot,imgSpot,true);
    }
  }

  useEffect(()=>{
    fetchInitialLabels();
  },[])

  //draw connections
  function createPoints(source,destination,isArrow) {
    let firstPoint = null;
    let secondPoint = null;
    let imgEl = document.getElementById("imageId");
    let img_width = imgEl.offsetWidth;
    let img_height = imgEl.offsetHeight;
    let img_x = locationLeft(imgEl);
    let img_y = locationTop(imgEl);
    if (!firstPoint) {
      firstPoint = {};
      firstPoint.xPoint = source['x']*img_width+img_x;
      firstPoint.YPoint = imgEl.offsetHeight-source['y']*img_height+img_y;
    }
    if (!secondPoint) {
      secondPoint = {};
      secondPoint.xPoint = destination['x']*img_width+img_x;
      secondPoint.YPoint = imgEl.offsetHeight-destination['y']*img_height+img_y;
    }
    if (firstPoint !== null && secondPoint !== null) {
      let lineLength = calcLine(firstPoint, secondPoint);
      let angle = getAngle(
          firstPoint.xPoint,
          firstPoint.YPoint,
          secondPoint.xPoint,
          secondPoint.YPoint
      );
      let lineHtmlStr;
        lineHtmlStr = `<div class='path' style="position:absolute;border-top: 1px solid red;width:${lineLength}px;top:${firstPoint.YPoint}px;left:${firstPoint.xPoint}px;transform:rotate(${angle}deg);transform-origin: 0 50%;"></div>`;
           
      $('.container').append(lineHtmlStr);
    }
  }
  function calcLine(firstPoint, secondPoint) {
    let line = Math.sqrt(
        Math.pow(firstPoint.xPoint - secondPoint.xPoint, 2) +
        Math.pow(firstPoint.YPoint - secondPoint.YPoint, 2)
    );
    return line;
  }
  function getAngle(x1, y1, x2, y2) {
    var x = x1 - x2;
    var y = y1 - y2;
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var cos = y / z;
    var radina = Math.acos(cos); 
    var angle = 180 / (Math.PI / radina); 
    if (x2 > x1 && y2 === y1) {
      angle = 0;
    }
    if (x2 > x1 && y2 < y1) {
      angle = angle - 90;
    }
    if (x2 === x1 && y1 > y2) {
      angle = -90;
    }
    if (x2 < x1 && y2 < y1) {
      angle = 270 - angle;
    }
    if (x2 < x1 && y2 === y1) {
      angle = 180;
    }
    if (x2 < x1 && y2 > y1) {
      angle = 270 - angle;
    }
    if (x2 === x1 && y2 > y1) {
      angle = 90;
    }
    if (x2 > x1 && y2 > y1) {
      angle = angle - 90;
    }
    return angle;
  }



  function locationLeft(element) {
    var offsetTotal = element.offsetLeft;
    var scrollTotal = 0; // element.scrollLeft but we dont want to deal with scrolling - already in page coords
    if (element.tagName != "BODY") {
      if (element.offsetParent != null)
        return offsetTotal + scrollTotal + locationLeft(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
  }

  function locationTop(element) {
    var offsetTotal = element.offsetTop;
    var scrollTotal = 0; // element.scrollTop but we dont want to deal with scrolling - already in page coords
    if (element.tagName != "BODY") {
      if (element.offsetParent != null)
        return offsetTotal + scrollTotal + locationTop(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
  }

  function createImagElement(displaySpot,fetchType) {
    var x = displaySpot.x -15;
    var y = displaySpot.y -30;
    var width = 30;
    var height = 30;
    if (fetchType){
      var src = locationIcon;
    }else{
      var src = locationIconNew;
    }

    let imgEle = '<img ' + ' class="path" '+' src="' + src + '"  style="top: '
        + y + 'px; left: ' + x + 'px; width: ' + width + 'px; height: ' + height + 'px;  position: absolute; cursor: pointer;"'
        + ')" />';
    return imgEle
  }

  function addHotspot(displaySpot,imgSpot,fetchType) {
    let imgEle = createImagElement(displaySpot,fetchType);
    $('.container').append(imgEle);
  }

  return (
    <>
    <div id="imageId" style={{ width:'100%',height:'100%'}}>
      <img alt="map" src={mapUrl} style={{width:'100%'}}/>
    </div>
    </>
  )
});

export default Picture