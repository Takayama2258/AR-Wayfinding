import { Layout, Button } from 'antd';
import './Home.css';
import { CameraOutlined} from '@ant-design/icons';
import React, {useContext, useState, useRef} from "react";

import { AppContext } from "../AppContext";
import Picture from '../Picture';
import ReactDOM from 'react-dom';

import {
  useParams,
  withRouter
} from "react-router-dom";

const { Header, Content, Footer } = Layout;


const Home =(props)=>{

  const { id } = useParams();

  const [dest, setDest] = useState('0');
  const [show, setShow] = useState({visibility:'hidden'});
  const {angle, settingAngle} = useContext(AppContext);

  const childRef = useRef();

  // 获取目标方位
  const handleClick = () => {
    // 数据库
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/search?source=${id}&destination=${dest}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      settingAngle(data.data.Angle);
        console.log(data.data.Angle);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })

    setShow({});
    childRef.current.onFetchLabel();
  };

  return (
    <div>
    <Layout className="layout">
      <Header className="header">
        <div className="logo">AR Wayfinding</div>
        <div className="user"></div>
      </Header>
      <Content style={{ padding: '0 15px', minHeight: '500px' }}>
        <div className="site-layout-content">
          <div className="text">Please scan a road sign to get navigation!</div>
          <div className="loc">You are now at: location{id}</div>
          <div className="des">Where is your destination?</div>
          <select value={dest} onChange={(e)=>(setDest(e.target.value))}>
            <option value="1">Location 1</option>
            <option value="2">Location 2</option>
            <option value="3">Location 3</option>
            <option value="4">Location 4</option>
          </select>

          <Button onClick={handleClick}>Show direction</Button>

          <div style = {show}>
            The direction is: {angle}
            <div className="container">
            <Picture source={id} destination={dest} ref={childRef}></Picture>
            </div>
          </div>

          {/* <div className="camera"><Button icon={<CameraOutlined />} onClick={()=>{props.history.push("/camera")}}></Button></div> */}
          <div className="camera"><Button icon={<CameraOutlined />} onClick={()=>{window.location.href = `www.arcamera.com/?angle=${angle}`}}></Button></div>
        </div>
      </Content>
          
      <Footer style={{ textAlign: 'center' }}>AR Wayfinding Demo ©2021 Created by Stephen & Coco</Footer>
    </Layout>
    </div>
  );
}

export default withRouter(Home);
