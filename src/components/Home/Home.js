import { Button } from 'antd';
import './Home.css';
import { CameraOutlined} from '@ant-design/icons';
import React, {useContext, useState, useRef, useEffect} from "react";
import { AppContext } from "../AppContext";
import Picture from '../Picture';
import ReactDOM from 'react-dom';
import localStorage from "localStorage";

import locationIcon from '../../images/location.png';
import locationIconNew from '../../images/locationNew.png'

import {
  useParams,
  withRouter
} from "react-router-dom";




const Home =(props)=>{

  const { id } = useParams();

  const [source, setSource] = useState();
  const [dest, setDest] = useState();
  const [mapId, setMapId] = useState();
  const [show, setShow] = useState('hidden');
  const [list, setList] = useState([]);
  const {angle, settingAngle} = useContext(AppContext);

  const childRef = useRef();

  const fetchMap = () => {
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/admin/map/nodeId?id=${id}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      console.log('setmapid::',data.data.Id);
      setMapId(data.data.Id);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  const fetchList = () => {
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/nodes/map?id=${mapId}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      let nodes = data['data']['Nodes'];
      let newList = []
      for (let label in nodes){
        if(id==nodes[label]['Id']){
          setSource(nodes[label]['NameEnglish']);
        }
        else{
          newList.push({Id:nodes[label]['Id'],Name:nodes[label]['NameEnglish']});
        }
      }
      console.log(newList)
      setList(newList);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  // 获取目标方位
  const handleClick = () => {
    // 数据库
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/search?source=${id}&destination=${dest}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      settingAngle(data['data']['Angle']);
        console.log(data.data.Angle);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })

    setShow('visible');
    localStorageSet("destination", dest)
    childRef.current.onFetchLabel();
  };

  const localStorageSet = (name, data) => {
    const obj = {
        data,
        expire: new Date().getTime() + 1000 * 60 * 30
    };
    localStorage.setItem(name, JSON.stringify(obj));
  };

  const localStorageGet = name => {
    const storage = localStorage.getItem(name);
    const time = new Date().getTime();
    let result = null;
    if (storage) {
        const obj = JSON.parse(storage);
        if (time < obj.expire) {
            result = obj.data;
        } else {
            localStorage.removeItem(name);
        }
    }
    return result;
  };

  useEffect(()=>{
    fetchMap();
  },[]);

  useEffect(()=>{
    childRef.current.onFetchLabel();
    fetchList();
  },[mapId]);

  useEffect(()=>{
    let destination = localStorageGet('destination');
    if(destination){
      console.log('setdest:::',destination);
      setDest(destination);
    }
  },[])

  return (
    <div className="layout">
      <div className="header">
        <div className="logo">AR Wayfinding</div>
        <div className="user"></div>
      </div>
      <div style={{ padding: '0 15px', minHeight: '500px' }}>
        <div className="site-layout-content">
          <div className="text">Welcome to our AR navigation!</div>
          <div className="text">You are now at: {source}</div>
          <div className="text">Where is your destination?</div>
          <select placeholder={'please select a destination'} value={dest} onChange={(e)=>(setDest(e.target.value))}>
            {list.map((option) => (
              <option key={option.Id} value={option.Id}>{option.Name}</option>
            ))}
          </select>
          <Button className='button' onClick={handleClick}>Show direction</Button>
          {/* <div style = {show}>
            The direction is: {angle}
          </div> */}
          <div className='rightText' style={{visibility: show}}>
          <img style={{width:'13px'}}  src={locationIconNew}></img><span className='smallText'>current location</span>
          
          </div>
          <div className="container">
            <Picture mapId={mapId} source={id} destination={dest} ref={childRef}></Picture>
          </div>

          {/* <div className="camera"><Button icon={<CameraOutlined />} onClick={()=>{props.history.push("/camera")}}></Button></div> */}
          <div className="camera"><Button icon={<CameraOutlined />} onClick={()=>{window.location.href = `www.arcamera.com/?angle=${angle}`}}></Button></div>
        </div>
      </div>
          
      <div style={{ textAlign: 'center' }}>AR Wayfinding Demo ©2021 Created by Stephen & Coco</div>
    </div>
  );
}

export default withRouter(Home);
