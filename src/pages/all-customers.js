import React, { useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

function RegisterWarranty({ userDetails }) {

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

  const [AllCustomer, setAllCustomer] = useState([]);
  useEffect(() => {
    getAllCustomer();
  }, [userDetails])
  function getAllCustomer() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'userWithWarranty.php?user_type=1').then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setAllCustomer(data.data);
      }
    });
  }

  const [searchValue, setsearchValue] = useState('');
  const inputChange = (event) => {
    const value = event.target.value;
    setsearchValue(value);
  }

  let filterAllCustomer = AllCustomer.filter(item => {
    return (
      (searchValue ? 
        ( ( (item.name != '' && item.name != null) ? item.name.toLowerCase().includes(searchValue) : false )
        || ( (item.email_address != '' && item.email_address != null) ? item.email_address.toLowerCase().includes(searchValue) : false ) 
        || ( (item.mobile_number != '' && item.mobile_number != null) ? item.mobile_number.toLowerCase().includes(searchValue) : false ) ) 
      : true )
    )
  })

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
      <ToastContainer />
      <HeaderBack />
      <div className="container">

        <div className="">
          <div className="my-3 position-relative">
            <input type="text" name="search" onInput={inputChange} class="form-control" placeholder="Search Name / Email / Phone no." />
            <Icon.Search className="searchIcon" />
          </div>
        </div>

        <div className="mainbody">
          {!filterAllCustomer ? ''
            : filterAllCustomer.length === 0 ?
              <div className="empty-box shadow my-4 text-center">
                <img src={require('../img/empty-box.png')} alt="" />
                <h3>No Customer</h3>
                <p>Looks like you have not added any customer.</p>
              </div>
              :
              <div>
                {filterAllCustomer.map((item) => (
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

      <Modal show={showInfo} onHide={handleCloseInfo} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {infoData !== null ? 
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Full Name : </strong> {infoData.name}</ListGroup.Item>
              <ListGroup.Item><strong>Phone number : </strong> <a className="text-decoration-none text-dark" href={'tel:'+infoData.mobile_number}><Icon.TelephoneFill/> {infoData.mobile_number}</a></ListGroup.Item>
              <ListGroup.Item><strong>Email Address : </strong> {infoData.email_address}</ListGroup.Item>
              <ListGroup.Item><strong>PinCode : </strong> {infoData.pin_code}</ListGroup.Item>
              <ListGroup.Item><strong>State : </strong> {infoData.state_name}</ListGroup.Item>
              <ListGroup.Item><strong>City : </strong> {infoData.city_name}</ListGroup.Item>
              <ListGroup.Item><strong>Address : </strong> {infoData.address}</ListGroup.Item>
              <ListGroup.Item>
                {infoData.warranty.length > 0 ? 
                  <table className="table table-bordered" style={{width:'100%'}}>
                    <tr><th>Model</th><th>Date</th></tr>
                    {infoData.warranty.map((item) => 
                      <tr><td>{item.model_name}<br/>{item.model_description}</td><td>{getFormattedDate(item.ddate, 'day_month_year')}</td></tr>
                    )}
                  </table>
                : ''}
              </ListGroup.Item>
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
export default RegisterWarranty;