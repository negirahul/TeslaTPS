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
  const [departmentsAndReason, setDepartmentsAndReason] = useState([]);
  useEffect(() => {
    getComplaintDetails();
    getDepartmentsAndReason();
  },[userDetails])

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

  function getComplaintDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'grievancesComplaintDetails.php?userId='+userDetails.username).then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setComplaintDetails(data.data);
      }
    });
  }

  function getDepartmentsAndReason(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'departmentsAndReason.php').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setDepartmentsAndReason(data.data);
      }
    });
  }

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
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setInputs(values => ({ ...values, [name]: value }));
  }

  const complaintSubmit = (event) => {
    event.preventDefault();
    if(inputs.department === undefined || inputs.department === ''){  notify("alert","Please Select Department");return;  }
    if(inputs.complaint_reason === undefined || inputs.complaint_reason === ''){  notify("alert","Please Select Complaint Reason");return;  }
    if(inputs.complaint_reason == 'Other' && (inputs.other_reason === undefined || inputs.other_reason === '')){ notify("alert","Please Insert Other Reason");return; }
    
    setdisabledButton(true);
    axios.post( process.env.REACT_APP_ADMIN_URL + 'grievancesComplaintSubmit.php', {inputs,userDetails}).then(function(response){
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
    
    axios.post( process.env.REACT_APP_ADMIN_URL + 'replyGrievancesComplaint.php', {reply, complaint_id, user_id:userDetails.username}).then(function(response){
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
                <h5>{item.department_name}</h5>
                <h5>{item.reason_name == 'Other' ? item.other_reason : item.reason_name}</h5>
                <span>Complaint No. {item.complaint_id} | Date: {getFormattedDate(item.ddate,'day_month_year')}</span><br/>
                <span>Status : {item.c_status == 1 ? <span className="text-success">Resolved</span> : <span className="text-warning">Pending</span>}</span>
                <hr />
                <div className="d-flex align-items-center icon-box-4">
                  <div className="w-100 text-center border-end" onClick={() => handleShow3(item.id)}><Icon.ReplyAll className="icon-color" /> Reply</div>
                  <div className="w-100 text-center border-end" 
                    onClick={() => handleShow2(item.reason_name == 'Other' ? item.other_reason : item.reason_name, getFormattedDate(item.ddate,'day_month_year'), item.communication)}>
                      <Icon.CardText className="icon-color" /> {item.comCount}</div>
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
            <div className="mb-3">
              <label htmlFor="department" className="form-label">Select Department</label>
              <select className="form-control" name="department" id="department" onChange={complaintChange}>
                <option value="">Select Department</option>
                {!departmentsAndReason ? (
                    <option>Loading data...</option>
                  ) : departmentsAndReason.length === 0 ? (
                    <option>No data found</option>
                  ) : (departmentsAndReason.map((item) => (
                    <option value={item.id} data-key={item.id} >{item.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="complaint_reason" className="form-label">Complaint Reason</label>
              <select className="form-control" name="complaint_reason" id="complaint_reason" onChange={complaintChange}>
                {!inputs.department ? (
                    <option value="">Please select department</option>
                  ) : inputs.department === 0 ? (
                    <option value="">Please select department</option>
                  ) : (departmentsAndReason.map((item) => (
                    item.id == inputs.department ? (
                      <>
                      <option value="">Please select department</option>
                      {item.reason.map((reason) => 
                        <option value={reason.id} >{reason.resaon_name}</option>
                      )}
                      <option value="Other">Other</option>
                      </>
                    )
                    : ""
                  ))
                )}
              </select>
            </div>
            
            { inputs.complaint_reason == 'Other' ? 
            <div className="mb-3">
              <label htmlFor="other_reason" className="form-label">Other Reason</label>
              <input type="text" className="form-control" name="other_reason" id="other_reason" onInput={complaintChange}/>
            </div>
            : ''
            }

            <Modal.Footer>
              {disabledButton == false ? <Button type="submit" variant="primary" className="btn-black-form">Submit</Button> 
              : <Button type="submit" variant="primary" className="btn-black-form" disabled>Loading...</Button> }
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2} scrollable={true} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="conversation">
            <h5>{comm.title}</h5>
            <span>Date: {comm.date}</span>

            { !comm.comArray ? '' 
              : comm.comArray.length === 0 ? '' 
              : (comm.comArray.map((item) => (
                <div>
                  <hr />
                  <p>{item.comment}</p>
                  <span>By <strong>{item.emp_id}</strong> On <strong>{getFormattedDate(item.ddate,'day_month_year')}</strong></span>
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
              <ListGroup.Item><strong>Department : </strong> {infoData.department_name}</ListGroup.Item>
              <ListGroup.Item><strong>Complaint : </strong> {infoData.reason_name == 'Other' ? infoData.other_reason : infoData.reason_name}</ListGroup.Item>
              <ListGroup.Item><strong>Complaint No. : </strong> {infoData.complaint_id}</ListGroup.Item>
              <ListGroup.Item><strong>Date. : </strong> {getFormattedDate(infoData.ddate,'day_month_year')}</ListGroup.Item>
              <ListGroup.Item><strong>Status : </strong>{infoData.c_status == 1 ? <span className="text-success">Resolved</span> : <span className="text-warning">Pending</span>}</ListGroup.Item>
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