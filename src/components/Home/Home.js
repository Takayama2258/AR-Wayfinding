import { Layout, Button } from 'antd';
import './Home.css';
import { CameraOutlined} from '@ant-design/icons';
import React, {useState} from "react";

import ReactDOM from 'react-dom';

import {
  useParams,
  Link, 
  Redirect,
  withRouter
} from "react-router-dom";

const { Header, Content, Footer } = Layout;


function Home(props){

  const { id } = useParams();

  const [navi, setNavi] = useState(90);
  const [dest, setDest] = useState('0');
  const [compass, setCompass] = useState(0);

  const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

  // 获取目标方位
  const handleClick = ()=>{
    // 数据库
    // fetch( `http://10.68.42.82:3001/v1/api/search?source=${id}&destination=${dest}`, { method: "GET"})
    // .then(res => res.json())
    // .then(data => {
    //     setNavi(data.data.Direction);
    //     console.log(data);
    // })
    // .catch((error) => {
    //   console.error("Error fetching data: ", error);
    // })

    // router跳转 有bug
    // <Redirect to={`/camera`}/>
    // this.props.history.replace('/camera');

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
        (compass < Math.abs(degree) &&
        compass + 15 > Math.abs(degree)) ||
        compass > Math.abs(degree + 15) ||
        compass < Math.abs(degree)
      ){
        setCompass(degree);
      }
  }

  return (
    <>
    <Layout className="layout">
      <Header className="header">
        <div className="logo">AR Wayfinding</div>
        <div className="user"></div>
      </Header>
      <Content style={{ padding: '0 15px', minHeight: '500px' }}>
        <div className="site-layout-content">
          <div className="text">Please scan a road sign to get navigation!</div>
          <div className="loc">You are now at: location{id}</div>
          <div className="des">What's your destination?</div>
          <select value={dest} onChange={(e)=>(setDest(e.target.value))}>
            <option value="0">Location 0</option>
            <option value="1">Location 1</option>
            <option value="2">Location 2</option>
            <option value="3">Location 3</option>
          </select>

          {/* <Link to = {`/camera/${navi}`}> 跳转到ar camera*/}
              <Button onClick={handleClick}>Show direction</Button>
          {/* </Link> */}

          {/* 东南西北testing 只有手机能看到*/}
          <div>The direction is: {navi}</div>
          <div>device orientation is: {compass}</div>
          <div>target orientation is: {compass-navi}</div>

          <div className="camera"><Button icon={<CameraOutlined />}></Button></div>
        </div>
      </Content>
          
      <Footer style={{ textAlign: 'center' }}>AR Wayfinding Demo ©2021 Created by Stephen & Coco</Footer>
    </Layout>
    </>
  );
}

export default Home;
