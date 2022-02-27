import React, {useState, useEffect} from "react";
import $ from 'jquery' ;
import locationIcon from '../images/location.png';
import locationIconNew from '../images/locationNew.png'
// import ControlBar from './ControlBar';
import {Button} from "antd";

var labels = [];
var connectionsMap = new Map();

function Picture(props){

  // get source & dest
  const {source, destination} = props;

  //用setLabel来更新label，否侧无法实现页面状态更新
  const [label, setLabel] = useState([]);
  const [connectionMap, setConnectionMap] = useState(new Map());

  function onFetchLabel() {
    fetchInitialLabels();
    drawInitialLabels();
  }
  //initialize fetch
  function fetchInitialLabels(){
    fetch( `http://localhost:3000/v1/api/nodes`)
    .then(res => res.json())
    .then(data => {
      let nodes = data['data']['Nodes'];
      let prevNode;
      for (let label in nodes){
        let imgSpot = {x: nodes[label].Latitude, y:nodes[label].Longitude}
        drawInitialLabels(imgSpot);
        if(prevNode){
          createPoints(prevNode,imgSpot);
        }
        prevNode=imgSpot;
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  function drawInitialLabels(imgSpot) {
    let imgEl = document.getElementById("imageId");
    let img_x = locationLeft(imgEl);
    let img_y = locationTop(imgEl);
    var displaySpot = {x: imgSpot.x+img_x, y: imgEl.offsetHeight-imgSpot.y+img_y};
    addHotspot(displaySpot,imgSpot,true);
  }

  // function onFetchConnection() {
  //   fetchInitialConnections();
  // }

  // function fetchInitialConnections() {
  //   fetch( `http://localhost:3000/v1/api/connections`)
  //   .then(res => res.json())
  //   .then(data => {

  //     let connectionList = data['data']['Connections'];
  //     for (let connection in connectionList){
  //       //draw initial connections
  //       createPoints(connectionList[connection].Source,connectionList[connection].Destination);
  //       if (connectionsMap.has(connectionList[connection].Source)){
  //         connectionsMap.set(connectionList[connection].Source,connectionsMap.get(connectionList[connection].Source).push(connectionList[connection].Destination));
  //       }else{
  //         connectionsMap.set(connectionList[connection].Source,[connectionList[connection].Destination]);
  //       }
  //     }
  //     setConnectionMap(connectionsMap);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching data: ", error);
  //   })
  // }

  //draw connections
  function createPoints(source,destination) {
    let firstPoint = null;
    let secondPoint = null;
    let imgEl = document.getElementById("imageId");
    let img_x = locationLeft(imgEl);
    let img_y = locationTop(imgEl);
    if (firstPoint === null) {
      firstPoint = {};
      firstPoint.xPoint = source['Latitude']+img_x;
      firstPoint.YPoint = imgEl.offsetHeight-source['Longitude']+img_y;
    }
    if (secondPoint === null) {
      secondPoint = {};
      secondPoint.xPoint = destination['Latitude']+img_x;
      secondPoint.YPoint = imgEl.offsetHeight-destination['Longitude']+img_y;
    }

    if (firstPoint !== null && secondPoint !== null) {
      let lineLength = calcLine(firstPoint, secondPoint);
      let angle = getAngle(
          firstPoint.xPoint,
          firstPoint.YPoint,
          secondPoint.xPoint,
          secondPoint.YPoint
      );
      // 设置一个div 宽度为 两点之间的距离，并且以 transform-origin: 0 50% 为圆心旋转，角度已经算出来
      let lineHtmlStr = `<div style="position:absolute;border-top: 1px solid red;width:${lineLength}px;top:${firstPoint.YPoint}px;left:${firstPoint.xPoint}px;transform:rotate(${angle}deg);transform-origin: 0 50%;"></div>`;
      $('.container').append(lineHtmlStr);
    }
  }
  function calcLine(firstPoint, secondPoint) {
    // 计算出两个点之间的距离
    let line = Math.sqrt(
        Math.pow(firstPoint.xPoint - secondPoint.xPoint, 2) +
        Math.pow(firstPoint.YPoint - secondPoint.YPoint, 2)
    );
    return line;
  }
  function getAngle(x1, y1, x2, y2) {
    // 获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
    var x = x1 - x2;
    var y = y1 - y2;
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var cos = y / z;
    var radina = Math.acos(cos); // 用反三角函数求弧度
    var angle = 180 / (Math.PI / radina); // 将弧度转换成角度
    if (x2 > x1 && y2 === y1) {
      // 在x轴正方向上
      angle = 0;
    }
    if (x2 > x1 && y2 < y1) {
      // 在第一象限;
      angle = angle - 90;
    }
    if (x2 === x1 && y1 > y2) {
      // 在y轴正方向上
      angle = -90;
    }
    if (x2 < x1 && y2 < y1) {
      // 在第二象限
      angle = 270 - angle;
    }
    if (x2 < x1 && y2 === y1) {
      // 在x轴负方向
      angle = 180;
    }
    if (x2 < x1 && y2 > y1) {
      // 在第三象限
      angle = 270 - angle;
    }
    if (x2 === x1 && y2 > y1) {
      // 在y轴负方向上
      angle = 90;
    }
    if (x2 > x1 && y2 > y1) {
      // 在四象限
      angle = angle - 90;
    }
    return angle;
  }



  function handleClick(e) {
    console.log('clicked');
    // eslint-disable-next-line no-restricted-globals
    var xPage = (navigator.appName == 'Netscape') ? e.pageX : event.x + document.body.scrollLeft;
    // eslint-disable-next-line no-restricted-globals
    var yPage = (navigator.appName == 'Netscape') ? e.pageY : event.y + document.body.scrollTop;
    // 当前点击位置
    var displaySpot = {x: xPage, y: yPage};

    let imgEl = document.getElementById("imageId");
    let height = $('imageId').prop("height")
    console.log(imgEl.offsetHeight);

    let img_x = locationLeft(imgEl);
    let img_y = locationTop(imgEl);
    var imgSpot = {x: xPage-img_x, y:imgEl.offsetHeight-yPage+img_y}

    addHotspot(displaySpot,imgSpot,false);
  }
  // 找到元素的屏幕位置
  function locationLeft(element) {
    var offsetTotal = element.offsetLeft;
    var scrollTotal = 0; // element.scrollLeft but we dont want to deal with scrolling - already in page coords
    if (element.tagName != "BODY") {
      if (element.offsetParent != null)
        return offsetTotal + scrollTotal + locationLeft(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
  }

// 找到元素的屏幕位置
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

    let imgEle = '<img ' + ' class="' + 'label' + '" '+' src="' + src + '"  style="top: '
        + y + 'px; left: ' + x + 'px; width: ' + width + 'px; height: ' + height + 'px;  position: absolute; cursor: pointer;"'
        + ')" />';
    return imgEle
  }
  // function createCoordinateElement(displaySpot,imgSpot) {
  //   var x = displaySpot.x -30;
  //   var y = displaySpot.y ;
  //   var width = 30;
  //   var height = 30;
  //   let textEle = '<text ' + ' class="' + 'coordinate' + '" '+' style="top: '
  //       + y + 'px; left: ' + x + 'px; width: ' + width + 'px; height: ' + height + 'px;  position: absolute; cursor: pointer;"'
  //       + ')" >{'+imgSpot.x+','+imgSpot.y+'}</text>';
  //   console.log(textEle);
  //   return textEle
  // }

  // 添加自定义内容
  function addHotspot(displaySpot,imgSpot,fetchType) {
    let imgEle = createImagElement(displaySpot,fetchType);
    // let textEle = createCoordinateElement(displaySpot,imgSpot);
    // labels.push('{'+imgSpot.x+','+imgSpot.y+'}');
    $('.container').append(imgEle);
    // $('.container').append(textEle);
    // setLabel([...labels]);
  }

  return (
    <>
    <div id="imageId" style={{ width:'100%',height:'100%'}} onClick={handleClick}>
      <img alt="map" src="https://innowings.engg.hku.hk/content/uploads/2020/06/LG.png" style={{width:'100%'}}/>
    </div>
    </>
  )
}

export default Picture