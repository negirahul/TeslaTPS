import React, { useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

function LeadManagement({ userDetails }) {

  const [currTime, setCurrTime] = useState()
  useEffect(() => {
    setInterval(() => {
      const dateObject = new Date()
      const hour = dateObject.getHours()
      const minute = dateObject.getMinutes()
      const second = dateObject.getSeconds()
      const currentTime = hour + ' : ' + minute + ' : ' + second
      setCurrTime(currentTime)
    }, 1000)
  }, [])

  const [stateOption, setstateOption] = useState('');
  function fetchStateData(value) {
    axios.post(process.env.REACT_APP_ADMIN_URL + 'fetch-state.php', { country: 101 }).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setstateOption(data.data);
        console.log(userDetails.state);
        if (userDetails.state) {
          fetchCityData(userDetails.state)
        }
      }
    });
  }
  const [cityOption, setcityOption] = useState('');
  function fetchCityData(value) {
    axios.post(process.env.REACT_APP_ADMIN_URL + 'fetch-city.php', { state: value }).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setcityOption(data.data);
      }
    });
  }

  const [disabledButton, setdisabledButton] = useState(false);

  const [unattendedLead, setUnattendedLead] = useState([]);
  const [retentionLead, setRetentionLead] = useState([]);
  const [coldLead, setColdLead] = useState([]);
  const [warmLead, setWarmLead] = useState([]);
  const [hotLead, setHotLead] = useState([]);
  const [closedLead, setClosedLead] = useState([]);
  const [convertedLead, setConvertedLead] = useState([]);
  const [followupLead, setFollowupLead] = useState([]);
  useEffect(() => {
    getleadsData();
    getExtraDetails();
    fetchStateData();
  }, [userDetails])
  function getleadsData() {
    getUnattendedLead();
    getRetentionLead();
    getColdLead();
    getWarmLead();
    getHotLead();
    getClosedLead();
    getConvertedLead();
    getFollowupLead();
  }
  function getUnattendedLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=unattended').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setUnattendedLead(data.data);
    });
  }
  function getRetentionLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=retention').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setRetentionLead(data.data);
    });
  }
  function getColdLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=cold').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setColdLead(data.data);
    });
  }
  function getWarmLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=warm').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setWarmLead(data.data);
    });
  }
  function getHotLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=hot').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setHotLead(data.data);
    });
  }
  function getClosedLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=closed').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setClosedLead(data.data);
    });
  }
  function getConvertedLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=converted').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setConvertedLead(data.data);
    });
  }
  function getFollowupLead() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'tpsLeads.php?username=' + userDetails.username + '&city=' + userDetails.city + '&type=followup').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setFollowupLead(data.data);
    });
  }


  const [source, setSource] = useState([]);
  const [product, setProduct] = useState([]);
  const [disposition, setDisposition] = useState([]);
  function getExtraDetails() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'leadsExtraDetails.php').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200)
      setSource(data.source);
      setProduct(data.product);
      setDisposition(data.disposition);
    });
  }


  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    getProductDetails();
  }, [userDetails])
  function getProductDetails() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'productDetails.php').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setProductDetails(data.data);
      }
    });
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const notify = (type, msg) => {
    if (type === 'success')
      toast.success(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'alert')
      toast.warn(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'error')
      toast.error(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
  }

  const getFormattedDate = (ddate, type) => {
    let dd = new Date(ddate);

    let day = dd.getDate();
    let month = dd.toLocaleString('en-US', { month: 'short' });
    let year = dd.getFullYear();

    if (type === 'day')
      return day
    else if (type === 'month')
      return month
    else if (type === 'year')
      return year
    else if (type === 'day_month_year')
      return day + ' ' + month + ' ' + year
    else if (type === 'month_year')
      return month + ' ' + year
  }

  function addOneYear(date) {
    var date = new Date(date);
    date.setFullYear(date.getFullYear() + 1);
    let day = date.getDate();
    let month = date.toLocaleString('en-US', { month: 'short' });
    let year = date.getFullYear();
    return day + ' ' + month + ' ' + year;
  }

  const [filterInputs, setFilterInputs] = useState([]);
  const filterChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFilterInputs(values => ({ ...values, [name]: value }));
  }
  const [modelDetails, setModelDetails] = useState([]);

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  const [searchValue, setsearchValue] = useState('');
  const inputChange = (event) => {
    const value = event.target.value;
    setsearchValue(value);
  }

  function filterData(item){
    let date = new Date(item.ddate).toLocaleDateString()
    // console.log( (item.fname != '' && item.fname != null) ? item.fname.toString() : true);
    return (
      (searchValue ? 
        ( ( (item.fname != '' && item.fname != null) ? item.fname.toString().toLowerCase().includes(searchValue) : false )
          || ( (item.phone != '' && item.phone != null) ? item.phone.toString().toLowerCase().includes(searchValue) : false ) ) 
      : true ) &&
      (filterInputs.source ? item.submited_by == filterInputs.source : true) && 
      (filterInputs.product ? item.lead_product == filterInputs.product : true) && 
      ((filterInputs.from_date && filterInputs.to_date) ? 
        moment(filterInputs.from_date).isSameOrBefore(date) && moment(filterInputs.to_date).isSameOrAfter(date) : true)
    )
  }

  let filterUnattendedLead = unattendedLead.filter(item => {return item})
  let filterRetentionLead = retentionLead.filter(item => {return filterData(item)})
  let filterColdLead = coldLead.filter(item => {return filterData(item)})
  let filterWarmLead = warmLead.filter(item => {return filterData(item)})
  let filterHotLead = hotLead.filter(item => {return filterData(item)})
  let filterClosedLead = closedLead.filter(item => {return filterData(item)})
  let filterConvertedLead = convertedLead.filter(item => {return filterData(item)})
  let filterfollowupLead = followupLead.filter(item => {return filterData(item)})

  // Reply start
  const [leadId, setLeadId] = useState(false);
  const [reply, setReply] = useState(false);
  const handleReply = (leadId) => {
    setLeadId(leadId)
    setReply(true)
  }

  const [replyInputs, setReplyInputs] = useState([]);
  const replyChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setReplyInputs(values => ({ ...values, [name]: value }));
  }

  const replySubmit = (event) => {
    event.preventDefault();
    console.log(replyInputs);
    if(replyInputs.remark === undefined || replyInputs.remark === ''){  notify("alert","Please Enter Your Remark");return;  }
    
    axios.post( process.env.REACT_APP_ADMIN_URL + 'leadreply.php', {leadId, replyInputs, user_id:userDetails.username}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
        setLeadId(null)
        setReply(false)
        getleadsData()
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }
      event.target.reset();
      setReplyInputs([]);
    });
  }
  // Reply End

  // comm histroy start
  const [ComLead, setComLead] = useState('');
  const [Com, setCom] = useState(false);
  const handleCom = (lead) => {
    setCom(true);
    setComLead(lead);
  }

  const [showInfo, setshowInfo] = useState(false);
  const handleshowInfo = (lead) => {
    setshowInfo(true);
    setComLead(lead);
    setLeadInputs(lead);
    fetchCityData(lead.region);
  }
  // comm histroy end

  // edit lead start
  const [editlead, setEditLead] = useState(false);
  const [leadInputs, setLeadInputs] = useState([]);
  const edtiLeadChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setLeadInputs(values => ({ ...values, [name]: value }));
    if (name == 'region') {
      fetchCityData(value)
    }
  }

  const editleadSudmit = (event) => {
    event.preventDefault();
    console.log(leadInputs);
    if (leadInputs.fname === undefined || leadInputs.fname === '') { notify("alert", "Please Enter Name"); return; }
    if (leadInputs.phone === undefined || leadInputs.phone === '') { notify("alert", "Please Enter Phone"); return; }
    if (leadInputs.region === undefined || leadInputs.region === '') { notify("alert", "Please Select State"); return; }
    if (leadInputs.city === undefined || leadInputs.city === '') { notify("alert", "Please Select City"); return; }
    if (leadInputs.zipcode === undefined || leadInputs.zipcode === '') { notify("alert", "Please Enter Pin Code"); return; }
    if (leadInputs.location === undefined || leadInputs.location === '') { notify("alert", "Please Enter Address"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'leads-update.php', { leadInputs, username:userDetails.username }).then(function (response) {
      console.log(response.data);
      var data = response.data;
      if (data.statusCode === 200) {
        notify("success", data.msg);
        setEditLead(false);
        setshowInfo(false);
        getleadsData();
      } else if (data.statusCode === 201) {
        notify("alert", data.msg);
      }
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    });
  }
  // edit lead end
  return (
    <div>
      <ToastContainer />
      <HeaderBack />
      <div className="container">

        <div className="row row-eq-height">
          <div className="col-10 pe-0 my-3 position-relative">
            <input type="text" name="search" onInput={inputChange} className="form-control" placeholder="Search Phone No / Customer Name" />
            <Icon.Search className="searchIcon" />
          </div>
          <div className="col-2 my-auto text-center">
            <Icon.FilterSquareFill fontSize={25} onClick={handleShow}/>
          </div>
        </div>

        <div className="leadtabs">
          <Tab.Container id="left-tabs-example" defaultActiveKey="Followup">
            <Nav variant="pills" className="leadnav">
              <Nav.Item><Nav.Link eventKey="Followup">Follow Up</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Unattended">Unattended</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Hot">Hot</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Warm">Warm</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Cold">Cold</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Retention">Retention</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Converted">Converted</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="Closed">Closed</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="Followup">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterfollowupLead ? '' 
                  : filterfollowupLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterfollowupLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Retention">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterRetentionLead ? '' 
                  : filterRetentionLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterRetentionLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Unattended">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterUnattendedLead ? '' 
                  : filterUnattendedLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterUnattendedLead.map((item, index) => 
                    <div className={index >= item.blur_lead_count ? 'empty-box-2 shadow mb-3 textBlur' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      {index < item.blur_lead_count ?
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                      : ''}
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Cold">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterColdLead ? '' 
                  : filterColdLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterColdLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Warm">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterWarmLead ? '' 
                  : filterWarmLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterWarmLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Hot">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterHotLead ? '' 
                  : filterHotLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterHotLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Closed">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterClosedLead ? '' 
                  : filterClosedLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterClosedLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="Converted">
                <div className="mainbody" style={{ height: "75vh" }}>
                  {!filterConvertedLead ? '' 
                  : filterConvertedLead.length==0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>Zero Leads</h3>
                      <p>You have no Leads on this section.</p>
                    </div>
                  : filterConvertedLead.map((item, index) => 
                    <div className={index >= 3 ? 'empty-box-2 shadow mb-3' : 'empty-box-2 shadow mb-3'}>
                      <h5>{item.fname} / {item.phone}</h5>
                      {item.lead_product != null ? <><span><strong>Product : </strong>{item.lead_product}</span><br/></> : '' }
                      <span><strong>Source</strong> : {item.submited_by}</span><br/>
                      <span><strong>Date</strong> : {getFormattedDate(item.ddate,'day_month_year')}</span>
                      <hr />
                      <div className="d-flex align-items-center icon-box-4">
                        <div className="w-100 text-center border-end" onClick={() => handleReply(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                        <div className="w-100 text-center border-end" onClick={() => handleCom(item)}><Icon.CardText className="icon-color" /> {item.comm.length}</div>
                        <div className="w-100 text-center border-end" onClick={() => handleshowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                        <div className="w-100 text-center"><a href={'tel:'+item.phone}><Icon.TelephoneFill className="icon-color" /></a></div>
                      </div>
                    </div>
                  ) }
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>

      </div>

      {/* <button type="button" className="btn-black text-center" onClick={handleShow}>ADD NEW LEAD</button> */}

      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="source" className="form-label">Source</label>
                <select type="text" name="source" id="source" className="form-control" onInput={filterChange} >
                  <option value="">Select Soruce</option>
                  {!source ? '' : source.length == 0 ? '' : source.map((item) => filterInputs.source == item ? <option selected>{item}</option> : <option>{item}</option> )}
                </select>
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="product" className="form-label">Product</label>
                <select type="text" name="product" id="product" className="form-control" onInput={filterChange} >
                  <option value="">Select Product</option>
                  {!product ? '' : product.length == 0 ? '' : product.map((item) => filterInputs.product == item ? <option selected>{item}</option> : <option>{item}</option>)}
                </select>
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="from_date" className="form-label">From Date</label>
                <input type="date" name="from_date" id="from_date" className="form-control" onInput={filterChange} value={filterInputs.from_date} />
              </div>
              <div className="col-6 mb-3">
                <label htmlFor="to_date" className="form-label">To Date</label>
                <input type="date" name="to_date" id="to_date" className="form-control" onInput={filterChange} value={filterInputs.to_date} />
              </div>
            </div>
            {/* <Modal.Footer>
              <Button type="submit" variant="primary" className="btn-black-form">Submit</Button>
            </Modal.Footer> */}
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={reply} onHide={() => setReply(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={replySubmit}>
            <div className="mb-3">
              <label htmlFor="disposition" className="form-label">Select Disposition</label>
              <select className="form-control" name="disposition" id="disposition" onChange={replyChange}>
                <option value="">Select Disposition</option>
                {!disposition ? '' : disposition.length == 0 ? '' : disposition.map((item) => <option value={item.id}>{item.disposition}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="followup" className="form-label">Follow Up Date</label>
              <input type="date" className="form-control" name="followup" id="followup" onInput={replyChange}/>
            </div>
            <div className="mb-3">
              <label htmlFor="remark" className="form-label">Your Reply</label>
              <textarea rows="" className="form-control" name="remark" id="remark" cols="" onInput={replyChange}></textarea>
            </div>
            <Modal.Footer>
              <Button type="submit" variant="primary" className="btn-black-form">Submit</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={Com} onHide={() => setCom(false)} scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="conversation">
            {!ComLead ? '' : ComLead.comm.length === 0 ? <p className="text-center">No communication Yet.</p> : 
              // ComLead.comm[0].remark
              ComLead.comm.map((item) => 
                <div>
                  <p>{item.remark}</p>
                  <span>By : <strong>{item.user_name} ({item.user_id})</strong>, Date : <strong>{getFormattedDate(item.ddate,'day_month_year')}</strong></span>
                  {(item.followup != '' && item.followup != null) ? <><br/><span>Follow Up On : <strong>{getFormattedDate(item.followup,'day_month_year')}</strong></span></> : ''}
                  <hr />
                </div>
              )
            }
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showInfo} onHide={() => setshowInfo(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Lead Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editlead == false ?
            <>
            <div className="text-end">
              <button onClick={() => setEditLead(true)} className="btn btn-sm btn-outline-dark"><Icon.PencilFill/> Edit</button>
            </div>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Name : </strong> {ComLead.fname}</ListGroup.Item>
              <ListGroup.Item><strong>Phone : </strong> {ComLead.phone}</ListGroup.Item>
              <ListGroup.Item><strong>Email : </strong> {ComLead.email}</ListGroup.Item>
              <ListGroup.Item><strong>Product : </strong> {ComLead.lead_product}</ListGroup.Item>
              <ListGroup.Item><strong>State : </strong> {ComLead.state_name}</ListGroup.Item>
              <ListGroup.Item><strong>City : </strong> {ComLead.city_name}</ListGroup.Item>
              <ListGroup.Item><strong>Pin Code : </strong> {ComLead.zipcode}</ListGroup.Item>
              <ListGroup.Item><strong>Address : </strong> <br/> {ComLead.location} </ListGroup.Item>
              <ListGroup.Item><strong>Message : </strong> <br/> {ComLead.message}</ListGroup.Item>
              <ListGroup.Item><strong>Date : </strong> {getFormattedDate(ComLead.ddate,'day_month_year')}</ListGroup.Item>
            </ListGroup>
            </>
          : 
            <>
            <div className="text-end">
              <button onClick={() => setEditLead(false)} className="btn btn-sm btn-outline-dark"><Icon.X/> Cancel</button>
            </div>
            <form onSubmit={editleadSudmit} className="p-2">
              <div className="row mt-3 mb-2">
                <div className="col-3"><strong>Name :</strong></div>
                <div className="col-9"><input type="text" name="fname" id="fname" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.fname} /></div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Phone :</strong></div>
                <div className="col-9"><input type="text" name="phone" id="phone" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.phone} /></div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Email :</strong></div>
                <div className="col-9"><input type="email" name="email" id="email" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.email} /></div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Product :</strong></div>
                <div className="col-9">
                  <input type="text" name="lead_product" id="lead_product" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.lead_product} disabled/>
                </div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>State :</strong></div>
                <div className="col-9">
                  {/* <input type="text" name="state_name" id="state_name" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.state_name} /> */}
                  <select className="form-control-sm w-100" name="region" id="region" onChange={edtiLeadChange}>
                    <option>--- Select State ---</option>
                    {!stateOption ? (
                      <option>Loading data...</option>
                    ) : stateOption.length === 0 ? (
                      <option>No data found</option>
                    ) : (stateOption.map((item) => (
                      <option value={item.id} selected={item.id === leadInputs.region ? true : false} >{item.name}</option>
                    ))
                    )}
                  </select>
                </div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>City :</strong></div>
                <div className="col-9">
                  {/* <input type="text" name="city" id="city" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.city} /> */}
                  <select className="form-control-sm w-100" name="city" id="city" onChange={edtiLeadChange}>
                    {/* <option>--- Select City ---</option> */}
                    {!cityOption ? (
                      <option>Select State First</option>
                    ) : cityOption.length === 0 ? (
                      <option>No data found</option>
                    ) : (cityOption.map((item) => (
                      <option value={item.id} selected={item.id === leadInputs.city ? true : false} >{item.name}</option>
                    ))
                    )}
                  </select>
                </div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Pin Code :</strong></div>
                <div className="col-9"><input type="text" name="zipcode" id="zipcode" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.zipcode} /></div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Address :</strong></div>
                <div className="col-12"><textarea type="text" name="location" id="location" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.location}></textarea></div>
              </div>
              {/* <hr/> */}
              <div className="row mb-2">
                <div className="col-3"><strong>Message :</strong></div>
                <div className="col-12"><textarea type="text" name="message" id="message" className="form-control-sm w-100" onInput={edtiLeadChange} value={leadInputs.message} disabled></textarea></div>
              </div>
              <Modal.Footer>
                <Button type="submit" variant="primary" className="btn-sm btn-black-form">Submit</Button>
              </Modal.Footer>
            </form>
            </>
          }
        </Modal.Body>
      </Modal>

    </div>
  );
}
export default LeadManagement;