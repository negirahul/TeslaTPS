import React, { useEffect } from "react";
import { useState } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import * as Icon from "react-bootstrap-icons";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

function RaisingComplaint({ userDetails }) {

  const [disabledButton, setdisabledButton] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = (title, date, com) => {
    setShow2(true);
    var data = [];
    data['title'] = title;
    data['date'] = date;
    data['comArray'] = com;
    setComm(data);
    console.log(data);
  }
  const [comm, setComm] = useState([]);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (id) => {
    console.log(id);
    setcomplaint_id(id)
    setShow3(true);
  }
  const [complaint_id, setcomplaint_id] = useState(false);

  const [infoData, setinfoData] = useState(null)
  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = (item) =>{
    console.log(item);
    setinfoData(item);
    setShowInfo(true);
  } 
  const [showInfo, setShowInfo] = useState(false);

  const [complaintDetails, setComplaintDetails] = useState([]);
  useEffect(() => {
    getComplaintDetails();
    fetchStateData();
    getExtraDetails();
  },[userDetails])

  const [stateOption, setstateOption] = useState('');
  function fetchStateData(value) {
    axios.post(process.env.REACT_APP_ADMIN_URL + 'fetch-state.php', { country: 101 }).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setstateOption(data.data);
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

  const [compGroup, setCompGroup] = useState([]);
  const [compSubject, setCompSubject] = useState([]);
  const getExtraDetails = () => {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'service-complaint-extraData.php').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setCompGroup(data.group);
      }
    });
  }

  const getFormattedDate = (ddate, type) => {
    let dd = new Date(ddate);

    let day = dd.getDate();
    let month = dd.toLocaleString('en-US', { month: 'short' });
    let year = dd.getFullYear();
    let hour = dd.getHours();
    let minute = dd.getMinutes();
    let second = dd.getSeconds();

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
    else if (type === 'day_month_year_time')
      return day + ' ' + month + ' ' + year + ' ' + hour + ':' + minute + ':' + second;
  }

  function getComplaintDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'complaintDetails.php?userId='+userDetails.id+'&userMobile='+userDetails.mobile_number).then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setComplaintDetails(data.data);
      }
    });
  }

  // const [productDetails, setProductDetails] = useState([]);
  // useEffect(() => {
  //   getProductDetails();
  // },[userDetails])
  // function getProductDetails(){
  //   axios.get( process.env.REACT_APP_ADMIN_URL + 'productDetails.php').then(function(response) {
  //     var data = response.data;
  //     if(data.statusCode === 200){
  //       setProductDetails(data.data);
  //     }
  //   });
  // }

  const notify = (type, msg) => {
    if(type === 'success')
    toast.success(msg, {position:"top-center", autoClose:5000, newestOnTop:true, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'alert')
    toast.warn(msg, {position:"top-center", autoClose:5000, newestOnTop:true, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'error')
    toast.error(msg, {position:"top-center", autoClose:5000, newestOnTop:true, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
  }

  const [inputs, setInputs] = useState([]);
  const complaintChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    if(name == 'group_id'){
      setCompSubject([])
      compGroup.forEach((group, index) => {
        if(group.id == value){
          setCompSubject(group.subject);
        }
      })
    }
    if(name === 'update_address') {
      if(event.target.checked)
        value = "Yes";
      else
        value = "No";
    }
    setInputs(values => ({ ...values, [name]: value }));
    if(name === 'product')  setSerialNoVerify(false);
    if(name == 'com_state') fetchCityData(value);
  }

  const [verifiedSerialNo, setVerifiedSerialNo] = useState([])
  const [serialNoVerify, setSerialNoVerify] = useState(false)
  const checkSerialNo = () => {
    if(inputs.product === undefined || inputs.product === ''){notify("alert","Please Enter Your Serial No");return;}
    axios.post( process.env.REACT_APP_ADMIN_URL + 'checkSerialNoForComplaint.php', {product:inputs.product}).then(function(response){
      var data = response.data;
      if(data.statusCode === 200){
        setSerialNoVerify(true);
        setVerifiedSerialNo(data.data)
      }else if(data.statusCode === 201){
        setSerialNoVerify(false);
        setVerifiedSerialNo([])
        notify("alert",data.msg);
      }
    });
  }


  const complaintSubmit = (event) => {
    event.preventDefault();
    if(inputs.group_id === undefined || inputs.group_id === ''){  notify("alert","Please Select Group");return;  }
    if(inputs.subject === undefined || inputs.subject === ''){  notify("alert","Please Select Subject");return;  }
    if(inputs.product === undefined || inputs.product === ''){  notify("alert","Please Select Product");return;  }
    
    if(inputs.update_address !== undefined && inputs.update_address == "Yes"){
      if(inputs.com_state === undefined || inputs.com_state === ''){  notify("alert","Please Select Customer State");return;  }
      if(inputs.com_city === undefined || inputs.com_city === ''){  notify("alert","Please Select Customer City");return;  }
      if(inputs.com_address === undefined || inputs.com_address === ''){  notify("alert","Please Enter Customer Address");return;  }
      if(inputs.com_pin_code === undefined || inputs.com_pin_code === ''){  notify("alert","Please Enter Customer Pincode");return;  }
    }

    // if(inputs.com_mobile_number === undefined || inputs.com_mobile_number === ''){  notify("alert","Please Enter Customer Mobile Number");return;  }
    if(inputs.complaint === undefined || inputs.complaint === ''){  notify("alert","Please Enter Your Complaint");return;  }
    
    setdisabledButton(true);
    axios.post( process.env.REACT_APP_ADMIN_URL + 'raiseComplaint.php', {inputs,userDetails}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
        event.target.reset();
        setShow(false);
        getComplaintDetails();
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }
      setdisabledButton(false);
    });      
  }

  const [reply, setReply] = useState(false);
  const replyChange = (event) => setReply(event.target.value);

  const replySubmit = (event) => {
    event.preventDefault();
    if(reply === undefined || reply === ''){  notify("alert","Please Enter Your Reply");return;  }
    
    axios.post( process.env.REACT_APP_ADMIN_URL + 'replyComplaint.php', {reply,complaint_id,user_id:userDetails.id}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
        event.target.reset();
        setShow3(false);
        getComplaintDetails();
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }
    });    
  }

  return (
    <div>
      <ToastContainer />
      <HeaderBack />
      <div className="container">
        <div className="mainbody">
          {!complaintDetails ? '' 
            : complaintDetails.length === 0 ? (
              <div className="empty-box shadow my-4 text-center">
                <img src={require('../img/empty-box.png')} alt="" />
                <h3>Zero Complaints</h3>
                <p>You have no complaints received or raised as of date.</p>
              </div>
            )
            : (complaintDetails.map((item) => (
              <div className="empty-box-2 shadow my-4">
                <h5>{item.subject_name}</h5>
                <h5>{item.product}</h5>
                <span>Ticket No. TK{String(item.id).padStart(10, '0')} | Date: {getFormattedDate(item.ddate,'day_month_year')}</span>
                <hr />
                <div className="d-flex align-items-center icon-box-4">
                  {/* {item.complaint_by === userDetails.id ? 
                    <div className="w-100 text-center border-end" onClick={() => handleShow3(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                  : ''} */}
                  {/* <div className="w-100 text-center border-end" onClick={() => handleShow2(item.complaint, getFormattedDate(item.ddate,'day_month_year'), item.comArray)}><Icon.CardText className="icon-color" /> {item.comCount}</div> */}
                  <div className="w-100 text-center border-end">
                    {item.complaint_status == 0 ? 'Pending' : 
                      item.complaint_status == 1 ? 'Resolved' : ''
                    }
                  </div>
                  <div className="w-100 text-center" onClick={() => handleShowInfo(item)}><Icon.InfoCircle className="icon-color" /></div>
                </div>
              </div>
            )))
          }
        </div>
      </div>

      <button type="button" className="btn-black text-center" onClick={handleShow}>RAISE COMPLAINT</button>

      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Raise Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={complaintSubmit}>
            <div className="row">
              <div className="col-12 mb-3">
                <label htmlFor="group_id" className="form-label">Product Group</label>
                <select className="form-control" name="group_id" id="group_id" onChange={complaintChange}>
                  <option value="">Select Product Group</option>
                  {/* <option value="Technical">Technical</option>
                  <option value="Account">Account</option> */}
                  {!compGroup ? '' 
                  : compGroup.length === 0 ? 
                    <option value="">No data found</option>
                  : (compGroup.map((item) => 
                    <option value={item.id}>{item.group_name}</option>
                  )
                  )}
                </select>
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="subject" className="form-label">Complaint Subject</label>
                <select className="form-control" name="subject" id="subject" onChange={complaintChange}>
                  <option value="">Select Subject</option>
                  {/* <option>Battery not charge properly</option> */}
                  {!compSubject ? ''
                  : compSubject.length === 0 ? 
                    <option value="">No data found</option>
                  : (compSubject.map((item) => 
                    <option value={item.id}>{item.subject_name}</option>
                  )
                  )}
                </select>
              </div>
              {/* <div className="col-12 mb-3">
                <label htmlFor="product" className="form-label">Product Serial Number</label>
                <select className="form-control" name="product" id="product" onChange={complaintChange}>
                  <option value="">Select Category</option>
                  {!productDetails ? (
                      <option>Loading data...</option>
                    ) : productDetails.length === 0 ? (
                      <option>No data found</option>
                    ) : (productDetails.map((item) => (
                      <option value={item.name} data-key={item.models} >{item.name}</option>
                    ))
                  )}
                </select>
                <input type="text" className="form-control" name="product" id="product" onInput={complaintChange}/>
              </div> */}

              <div className="mb-3">
                <label htmlFor="product" className="form-label">Product Serial Number</label>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" name="product" id="product" aria-describedby="button-addon2" onInput={complaintChange} />
                  <button className="btn btn-dark" type="button" id="button-addon2" onClick={checkSerialNo}>Check</button>
                </div>
              </div>

              {serialNoVerify === false ? '' :
                !verifiedSerialNo ? '' : verifiedSerialNo.length === 0 ? '' : 
                <>
                  <p>
                    <strong>Product : </strong> {verifiedSerialNo.cat_name}<br/>
                    <strong>Model : </strong> {verifiedSerialNo.model_name}<br/>
                    <strong>Model Description : </strong> {verifiedSerialNo.model_description}<br/>
                    <strong>Customer Mobile No. : </strong> {verifiedSerialNo.mobile_number}
                    <hr/>
                  </p>

                  <div className="col-12 mb-3">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" name="update_address" id="update_address" value="Yes" onChange={complaintChange}/>
                      <label class="form-check-label" for="update_address">Check, if you want to update address</label>
                    </div>
                  </div>

                  {!inputs.update_address ? '' : inputs.update_address == "Yes" ? 
                    <>
                      <div className="col-6 mb-3">
                        <label htmlFor="com_state" className="form-label">State</label>
                        <select className="form-control" name="com_state" id="com_state" onChange={complaintChange}>
                          <option value="">--- Select State ---</option>
                          {!stateOption ? (
                            <option>Loading data...</option>
                          ) : stateOption.length === 0 ? (
                            <option>No data found</option>
                          ) : (stateOption.map((item) => (
                            <option value={item.id} >{item.name}</option>
                          ))
                          )}
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="com_city" className="form-label">City</label>
                        <select className="form-control" name="com_city" id="com_city" onChange={complaintChange}>
                          {/* <option>--- Select City ---</option> */}
                          {!cityOption ? (
                            <option>Select State First</option>
                          ) : cityOption.length === 0 ? (
                            <option>No data found</option>
                          ) : (cityOption.map((item) => (
                            <option value={item.id}  >{item.name}</option>
                          ))
                          )}
                        </select>
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="com_address" className="form-label">Address</label>
                        <textarea name="com_address" id="com_address" className="form-control" onInput={complaintChange}></textarea>
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="com_pin_code" className="form-label">Pin Code</label>
                        <input type="number" name="com_pin_code" id="com_pin_code" className="form-control" onInput={complaintChange} />
                      </div>
                    </> : ''
                  }

                  <div className="col-12 mb-3">
                    <label htmlFor="com_mobile_number" className="form-label">Alternate Mobile No.</label>
                    <input type="number" name="com_mobile_number" id="com_mobile_number" className="form-control" onInput={complaintChange} />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="complaint" className="form-label">Explain complaint</label>
                    <textarea rows="" className="form-control" name="complaint" id="complaint" onInput={complaintChange} cols=""></textarea>
                  </div>
                  <Modal.Footer>
                    {disabledButton == false ? <Button type="submit" variant="primary" className="btn-black-form">Submit</Button> 
                    : <Button type="submit" variant="primary" className="btn-black-form" disabled>Loading...</Button> }
                  </Modal.Footer>
                </>
              }
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2} scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="conversation">
            {/* <h5>{comm.title}</h5>
            <span>Date: {comm.date}</span>
            <hr/> */}

            { !comm.comArray ? '' 
              : comm.comArray.length === 0 ? <p className="text-center">No communication yet.</p> 
              : (comm.comArray.map((item) => (
                <div>
                  <p>{item.reply}</p>
                  <span>By <strong>{item.by_team == 0 ? 'Complainant' : 'Delite Team'}</strong> On <strong>{getFormattedDate(item.ddate,'day_month_year_time')}</strong></span>
                  <hr />
                </div>
              )))
            }

          </div>
        </Modal.Body>
      </Modal>

      <Modal show={show3} onHide={handleClose3} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={replySubmit}>
            <div className="mb-3">
              <label htmlFor="communication" className="form-label">Your Reply</label>
              <textarea rows="" className="form-control" name="communication" id="communication" cols="" onInput={replyChange}></textarea>
            </div>
            <Modal.Footer>
              <input type="hidden" name="complaint_id" id="complaint_id" value={complaint_id} />
              <Button type="submit" variant="primary" className="btn-black-form">Submit</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showInfo} onHide={handleCloseInfo} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {infoData !== null ? 
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Department : </strong> {infoData.department}</ListGroup.Item>
              <ListGroup.Item><strong>Subject : </strong> {infoData.subject}</ListGroup.Item>
              <ListGroup.Item><strong>Poduct : </strong> {infoData.productDetail.product_name}</ListGroup.Item>
              <ListGroup.Item><strong>Model : </strong> {infoData.productDetail.model_name}</ListGroup.Item>
              <ListGroup.Item><strong>Model Discription : </strong> {infoData.productDetail.model_description}</ListGroup.Item>
              <ListGroup.Item><strong>Serial No. : </strong> {infoData.product}</ListGroup.Item>
              <ListGroup.Item><strong>Complaint : </strong> <br/> {infoData.complaint}</ListGroup.Item>
              <ListGroup.Item><strong>Date : </strong> {getFormattedDate(infoData.ddate,'day_month_year_time')}</ListGroup.Item>
            </ListGroup>
          : 
            <ListGroup variant="flush">
              <ListGroup.Item><strong>No Information Found</strong></ListGroup.Item>
            </ListGroup>
          }
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
export default RaisingComplaint;