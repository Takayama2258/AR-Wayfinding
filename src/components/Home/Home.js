import { Button } from 'antd';
import './Home.css';
import { CameraOutlined} from '@ant-design/icons';
import React, {useContext, useState, useRef, useEffect} from "react";
import { AppContext } from "../AppContext";
import Picture from '../Picture';
import localStorage from "localStorage";

import locationIconNew from '../../images/locationNew.png'

import {
  useParams,
  withRouter
} from "react-router-dom";


const Home =()=>{

  const { id } = useParams();

  const [source, setSource] = useState();
  const [dest, setDest] = useState();
  const [mapId, setMapId] = useState();
  const [building, setBuilding] = useState();
  const [show, setShow] = useState('hidden');
  const [list, setList] = useState([]);
  const {angle, settingAngle} = useContext(AppContext);

  const childRef = useRef();

  const fetchMap = () => {
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/admin/map/nodeId?id=${id}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      setMapId(data.data.Id);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  const fetchBuilding = () => {
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/admin/map/building?id=${id}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      setBuilding(data.data.Name);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  const fetchList = () => {
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/nodes/building?name=${building}`, { method: "GET"})
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
      setList(newList);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    })
  }

  const handleClick = () => {
    // Database
    fetch( `https://fyp21043s1.cs.hku.hk:8080/v1/api/search?source=${id}&destination=${dest}`, { method: "GET"})
    .then(res => res.json())
    .then(data => {
      let newAngle = data.data.Angle;
      newAngle= 1.57-newAngle/57.3;
      settingAngle(newAngle);
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
    fetchBuilding();
  },[]);

  useEffect(()=>{
    childRef.current.onFetchLabel();
  },[mapId]);

  useEffect(()=>{
    fetchList();
  },[building])

  useEffect(()=>{
    let destination = localStorageGet('destination');
    if(destination){
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
            <option value={-1}>please select a destination</option>
            {list.map((option) => (
              <option key={option.Id} value={option.Id}>{option.Name}</option>
            ))}
          </select>
          <Button className='button' onClick={handleClick}>Show direction</Button>
          <div className='rightText' style={{visibility: show}}>
          <img style={{width:'13px'}}  src={locationIconNew}></img><span className='smallText'>current location</span>
          </div>
          <div className="container">
            <Picture mapId={mapId} source={id} destination={dest} ref={childRef}></Picture>
          </div>
          {/* redirect to AR webpage with angle as url parameter */}
          <div className="camera"><Button icon={<CameraOutlined />} onClick={()=>{window.location.href = `https://fyp21043s1.cs.hku.hk:5999/?angle=${angle}`}}></Button></div>
        </div>
      </div>
          
      <div style={{ textAlign: 'center' }}>AR Wayfinding Demo ©2021 Created by Stephen & Coco</div>
    </div>
  );
}

export default withRouter(Home);
