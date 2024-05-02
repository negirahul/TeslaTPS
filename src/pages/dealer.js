import React from "react";
import { useState, useEffect } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import * as Icon from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function Dealer({ userDetails }) {

  const [disabledButton, setdisabledButton] = useState(false);

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

  const [inputs, setInputs] = useState([]);
  const profileChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setInputs(values => ({ ...values, [name]: value }));
    if (name == 'state') {
      fetchCityData(value)
    }
  }

  const profileSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    if (inputs.name === undefined || inputs.name === '') { notify("alert", "Please Enter Dealer Name"); return; }
    if (inputs.mobile_number === undefined || inputs.mobile_number === '') { notify("alert", "Please Enter Dealer Mobile Number"); return; }
    if (inputs.email_address === undefined || inputs.email_address === '') { notify("alert", "Please Enter Dealer Email Address"); return; }
    if (inputs.company_name === undefined || inputs.company_name === '') { notify("alert", "Please Enter Dealer Company Name"); return; }
    if (inputs.gst_no === undefined || inputs.gst_no === '') { notify("alert", "Please Select Dealer Password"); return; }
    if (inputs.address === undefined || inputs.address === '') { notify("alert", "Please Select Dealer Password"); return; }
    if (inputs.pin_code === undefined || inputs.pin_code === '') { notify("alert", "Please Select Dealer Password"); return; }
    if (inputs.state === undefined || inputs.state === '') { notify("alert", "Please Select Dealer State"); return; }
    if (inputs.city === undefined || inputs.city === '') { notify("alert", "Please Select Dealer City"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'addDealerByDistributor.php', { inputs, id: userDetails.id }).then(function (response) {
      console.log(response.data);
      var data = response.data;
      if (data.statusCode === 200) {
        notify("success", data.msg);
        setShow(false);
        getdealers();
      } else if (data.statusCode === 201) {
        notify("alert", data.msg);
      }
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1500);
    });
  }

  const [dealers, setdealers] = useState([]);
  useEffect(() => {
    fetchStateData();
    getdealers();
  },[userDetails])
  function getdealers(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'distributorDealerCustomers.php?userId='+userDetails.id).then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setdealers(data.data);
      }
    });
  }

  const [infoData, setinfoData] = useState(null)
  const handleCloseInfo = () => setShowInfo(false);
  const handleShowInfo = (item) =>{
    console.log(item);
    setinfoData(item);
    setShowInfo(true);
  } 
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <HeaderBack />
      <div className="container">
        <div className="mainbody">
            {!dealers ? '' 
            : dealers.length === 0 ? 
                <div className="empty-box shadow my-4 text-center">
                <img src={require('../img/empty-box.png')} alt="" />
                <h3>No Dealers</h3>
                <p>Looks like you have not added any customer to your account.</p>
                </div>
            : 
                <div>  
                {dealers.map((item) => (
                    <div className="shop-item d-flex align-items-center bg-white shadow shop-item-round my-3">
                    <div className="cart-text-no w25">
                        <img src={process.env.REACT_APP_ADMIN_URL + 'uploads/profile-images/' + item.profile_image} className="shop-item-img" alt="" />
                    </div>
                    <div className="cart-text w50">{item.name} <span>{item.email_address}</span> <span>{item.mobile_number}</span></div>
                    <div className="w25"><button type="button" className="cart-item-btn" onClick={() => handleShowInfo(item)}><Icon.Eye /></button></div>
                    </div>
                    ))
                }
                {/* <Button variant="primary" className="btn-black-form">Load More...</Button> */}
                </div>
            }
        </div>
      </div>

      <button type="button" className="btn-black text-center" onClick={handleShow}>Add New Dealer</button>
      
      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Dealer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={profileSubmit}>
            <div className="mb-2">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" name="name" id="name" className="form-control form-control-sm" onInput={profileChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="email_address" className="form-label">Email Address</label>
              <input type="text" name="email_address" id="email_address" className="form-control" onInput={profileChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Mobile Number</label>
              <input type="text" name="mobile_number" id="mobile_number" className="form-control" onInput={profileChange} minLength={10} maxLength={10}/>
            </div>
            <div className="mb-2">
              <label htmlFor="company_name" className="form-label">Company / Store Name</label>
              <input type="text" name="company_name" id="company_name" className="form-control" onInput={profileChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="gst_no" className="form-label">GST No.</label>
              <input type="text" name="gst_no" id="gst_no" className="form-control" onInput={profileChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea name="address" id="address" className="form-control" onInput={profileChange}></textarea>
            </div>
            <div className="mb-2">
              <label htmlFor="pin_code" className="form-label">Pin Code</label>
              <input type="text" name="pin_code" id="pin_code" className="form-control" onInput={profileChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="state" className="form-label">State</label>
              <select className="form-control" name="state" id="state" onChange={profileChange}>
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

            <div className="mb-2">
              <label htmlFor="city" className="form-label">City</label>
              <select className="form-control" name="city" id="city" onChange={profileChange}>
                {/* <option value="">--- Select City ---</option> */}
                {!cityOption ? (
                  <option>Select State First</option>
                ) : cityOption.length === 0 ? (
                  <option>No data found</option>
                ) : (cityOption.map((item) => (
                  <option value={item.id} >{item.name}</option>
                ))
                )}
              </select>
            </div>
            <Modal.Footer>
              <Button type="submit" variant="primary" className="btn-black-form" disabled={disabledButton}>Submit</Button>
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
              <ListGroup.Item><strong>Full Name : </strong> {infoData.name}</ListGroup.Item>
              <ListGroup.Item><strong>Phone number : </strong> {infoData.mobile_number}</ListGroup.Item>
              <ListGroup.Item><strong>Email Address : </strong> {infoData.email_address}</ListGroup.Item>
              <ListGroup.Item><strong>Address : </strong> {infoData.address}</ListGroup.Item>
              <ListGroup.Item><strong>PinCode : </strong> {infoData.pin_code}</ListGroup.Item>
              <ListGroup.Item><strong>State : </strong> {infoData.state_name}</ListGroup.Item>
              <ListGroup.Item><strong>City : </strong> {infoData.city_name}</ListGroup.Item>
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
export default Dealer;