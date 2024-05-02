import React, {useEffect} from "react";
import { useState } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as Icon from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

import Swal from 'sweetalert2'

import { Filesystem, Directory } from '@capacitor/filesystem';

function StockRequest({ userDetails }) {

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

  const notify = (type, msg) => {
    if(type === 'success')
    toast.success(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'alert')
    toast.warn(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'error')
    toast.error(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
  }

  const [punchDetails, setPunchDetails] = useState([]);
  const [placeDetails, setPlaceDetails] = useState([]);
  useEffect(() => {
    getAllOrderDetails();
  },[userDetails])
  function getAllOrderDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'allDistributorOrderDetails.php?userId='+userDetails.id).then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        if(data.data.orders.punch !== undefined)
        setPunchDetails(data.data.orders.punch);
        else
        setPunchDetails([])

        if(data.data.orders.place !== undefined)
        setPlaceDetails(data.data.orders.place);
        else
        setPlaceDetails([])
      }
    });
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);

  const [punchOrderDetails, setPunchOrderDetails] = useState(null);
  const [placeOrderDetails, setPlaceOrderDetails] = useState(null);
  
  const handleShow2 = (key,type) => {
    if(type == 'punch'){
      setPunchOrderDetails(punchDetails[key])
      setShow(true);
    }else if(type == 'place'){
      setPlaceOrderDetails(placeDetails[key])
      setShow2(true);
      console.log(placeDetails[key]);
    }
  }

  function downloadUrl(url){
    axios.get(url,{responseType:"blob"}).then(function (response) {
      var res = response.data;
      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = function(){
        let base64 = reader.result.toString();
        Filesystem.writeFile({
          path: Math.floor((Math.random() * 1000000000) + 1)+"invoice.pdf",data: base64,directory: Directory.Documents
        }).then((res)=>{
          console.log(res.uri)
          notify("success", "Invoice saved in your directory");
        },(err)=>{
          notify("alert", "Something went wrong");
        })
      }
    });
  }

  const approvePunchOrder = (orderId, status) => {
    Swal.fire({
      title: "Do you want to approve or dissapprove this bill?",showDenyButton: true,showCancelButton: true,confirmButtonText: "Approve",denyButtonText: "Disapprove"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post( process.env.REACT_APP_ADMIN_URL + 'approvePunchOrder.php', {orderId, status:1} ).then(function(response){
          var data = response.data;
          if(data.statusCode === 200){
            notify("success",data.msg);
          }else if(data.statusCode === 201){
            notify("alert",data.msg);
          }
          getAllOrderDetails();
          setShow(false);
        });
      } else if (result.isDenied) {
        axios.post( process.env.REACT_APP_ADMIN_URL + 'approvePunchOrder.php', {orderId, status:2} ).then(function(response){
          var data = response.data;
          if(data.statusCode === 200){
            notify("success",data.msg);
          }else if(data.statusCode === 201){
            notify("alert",data.msg);
          }
          getAllOrderDetails();
          setShow(false);
        });
      }  
    });
  }

  const approvePlaceOrder = (orderId, status) => {
    if(status == 1){
      Swal.fire({
        text: "Do you want to approve or dissapprove this bill?",icon: "warning",showDenyButton: true,showCancelButton: true,confirmButtonText: "Approve",denyButtonText: "Disapprove"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post( process.env.REACT_APP_ADMIN_URL + 'approvePunchOrder.php', {orderId, status:1} ).then(function(response){
            var data = response.data;
            if(data.statusCode === 200){
              notify("success",data.msg);
            }else if(data.statusCode === 201){
              notify("alert",data.msg);
            }
            getAllOrderDetails();
            setShow2(false);
          });
        } else if (result.isDenied) {
          axios.post( process.env.REACT_APP_ADMIN_URL + 'approvePunchOrder.php', {orderId, status:2} ).then(function(response){
            var data = response.data;
            if(data.statusCode === 200){
              notify("success",data.msg);
            }else if(data.statusCode === 201){
              notify("alert",data.msg);
            }
            getAllOrderDetails();
            setShow2(false);
          });
        }  
      });
    }else{
      Swal.fire({
        title: "Are you sure?",text: "You wasnt to update order status!",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6",cancelButtonColor: "#d33",
        confirmButtonText: "Yes, do it!"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post( process.env.REACT_APP_ADMIN_URL + 'approvePunchOrder.php', {orderId, status} ).then(function(response){
            var data = response.data;
            if(data.statusCode === 200){
              notify("success",data.msg);
            }else if(data.statusCode === 201){
              notify("alert",data.msg);
            }
            getAllOrderDetails();
            setShow2(false);
          });
        }
      });
    }
  }

  return (
    <div>
      <ToastContainer />
      <HeaderBack />
      <div className="container">
        <div className="mt-4">

          <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3" fill>
            <Tab eventKey="home" title="Punched Order">
              <div className="bg-white shadow tab-body-edit">
                { !punchDetails ? '' 
                  : punchDetails.length === 0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>No Orders</h3>
                      <p>No record available in your order history.</p>
                    </div>
                  : 
                    (punchDetails.map((item, index) => 
                      <div>
                        <div className="shop-item d-flex align-items-center">
                          <div className="cart-text-no w25">{index + 1}.</div>
                          <div className="cart-text w50">
                            Dealer Name: {item.dealer.name} <br />Product: {item.product} | Qty: {item.qty} 
                            <span>
                              {getFormattedDate(item.order.ddate,'day_month_year')} | 
                              Order {{'0':' Pending', '1':' Accepted', '2':' Rejected'}[item.order.order_status]}
                            </span>
                          </div>
                            {{
                              '0':<div className="cart-icon w25 text-warning"><Icon.QuestionCircle /></div>, 
                              '1':<div className="cart-icon w25 text-success"><Icon.Check2Circle /></div>, 
                              '2':<div className="cart-icon w25 text-danger"><Icon.XCircle /></div>}
                              [item.order.order_status]}
                        </div>
                        <div className="w-100"><button type="button" className="cart-item-btn cart-item-forn w-100" onClick={() => handleShow2(index,'punch')}>View Details / Approved Bill</button>
                        </div>
                        <hr/>
                      </div>
                    ))
                }
              </div>
            </Tab>

            <Tab eventKey="Requested" title="Requested Order">
              <div className="bg-white shadow tab-body-edit">
                { !placeDetails ? '' 
                  : placeDetails.length === 0 ? 
                    <div className="empty-box shadow my-4 text-center">
                      <img src={require('../img/empty-box.png')} alt="" />
                      <h3>No Orders</h3>
                      <p>No record available in your order history.</p>
                    </div>
                  : 
                    (placeDetails.map((item, index) => 
                      <div>
                        <div className="shop-item d-flex align-items-center">
                          <div className="cart-text-no w25">{index + 1}.</div>
                          <div className="cart-text w50">
                            Dealer Name: {item.dealer.name} <br />Product: {item.product} | Qty: {item.qty} 
                            <span>
                              {getFormattedDate(item.order.ddate,'day_month_year')} | 
                              Order {{'0':' Pending', '1':' Accepted', '2':' Rejected', '3':' Dispatched', '4':' Delivered', '5':' Received'}[item.order.order_status]}
                            </span>
                          </div>
                            {{
                              '0':<div className="cart-icon w25 text-warning"><Icon.QuestionCircle /></div>, 
                              '1':<div className="cart-icon w25 text-success"><Icon.Check2Circle /></div>, 
                              '2':<div className="cart-icon w25 text-danger"><Icon.XCircle /></div>,
                              '3':<div className="cart-icon w25 text-success"><Icon.Check2Circle /></div>,
                              '4':<div className="cart-icon w25 text-success"><Icon.Check2Circle /></div>,
                              '5':<div className="cart-icon w25 text-success"><Icon.Check2Circle /></div>
                            }
                            [item.order.order_status]}
                        </div>
                        <div className="w-100"><button type="button" className="cart-item-btn cart-item-forn w-100" onClick={() => handleShow2(index,'place')}>View Details / Approved Order</button>
                        </div>
                        <hr/>
                      </div>
                    ))
                }
              </div>
            </Tab>
          </Tabs>

        </div>
      </div>
      
      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {punchOrderDetails == null ? '' : 
            <div>
              <div className="text-center">
                <h6>Order Date: {getFormattedDate(punchOrderDetails.order.ddate,'day_month_year')}<br />
                  Status: {{'0':' Pending', '1':' Accepted', '2':' Rejected', '3':' Dispatched', '4':' Delivered', '5':' Received'}[punchOrderDetails.order.order_status]}</h6>
              </div>
              <hr />
              {!punchOrderDetails.details ? '' 
                : punchOrderDetails.details.length === 0 ? ''
                : punchOrderDetails.details.map((item, index) => 
                  <div className="shop-item d-flex align-items-center">
                    <div className="cart-text-no w25">{index + 1}.</div>
                    <div className="cart-text w75">{item.cat_name} <span>Model No. {item.model_name} | Qty: {item.qty}</span></div>
                    {/* <div className="w25"><button type="button" className="cart-item-btn"><Icon.CheckAll /></button></div> */}
                  </div>
                )
              }
              
              {punchOrderDetails.order.bill_copy == null ? '' : 
                <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" 
                  onClick={() => downloadUrl(process.env.REACT_APP_ADMIN_URL + punchOrderDetails.order.bill_copy)}>Download / View Invoice
                </button>
              }
              {punchOrderDetails.order.order_status == 0 ? 
              <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" onClick={() => approvePunchOrder(punchOrderDetails.order.id, 1)}>Approve / DisApprove Bill</button>
              : '' }
            </div>
          }
        </Modal.Body>
      </Modal>

      
      <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {placeOrderDetails == null ? '' : 
            <div>
              <div className="text-center">
                <h6>Order Date: {getFormattedDate(placeOrderDetails.order.ddate,'day_month_year')}<br />
                  Status: {{'0':' Pending', '1':' Accepted', '2':' Rejected', '3':' Dispatched', '4':' Delivered', '5':' Received'}[placeOrderDetails.order.order_status]}</h6>
              </div>
              <hr />
              {!placeOrderDetails.details ? '' 
                : placeOrderDetails.details.length === 0 ? ''
                : placeOrderDetails.details.map((item, index) => 
                  <div className="shop-item d-flex align-items-center">
                    <div className="cart-text-no w25">{index + 1}.</div>
                    <div className="cart-text w50">{item.cat_name} <span>Model No. {item.model_name} | Qty: {item.qty}</span></div>
                    <div className="w25"><button type="button" className="cart-item-btn"><Icon.CheckAll /></button></div>
                  </div>
                )
              }
              {placeOrderDetails.order.bill_copy == null ? '' : 
                <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" 
                  onClick={() => downloadUrl(process.env.REACT_APP_ADMIN_URL + placeOrderDetails.order.bill_copy)}>Download / View Invoice
                </button>
              }
              
              {
                {
                  '0': <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" onClick={() => approvePlaceOrder(placeOrderDetails.order.id, 1)}>Order Accept / Reject </button>, 
                  '1': <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" onClick={() => approvePlaceOrder(placeOrderDetails.order.id, 3)}>Order Dispatch</button>, 
                  '3': <button type="button" className="cart-item-btn cart-item-forn w-100 mt-3" onClick={() => approvePlaceOrder(placeOrderDetails.order.id, 4)}>Order Deliver</button>,
                }
                [placeOrderDetails.order.order_status]
              }
            </div>
          }
        </Modal.Body>
      </Modal>

    </div>
  );
}
export default StockRequest;