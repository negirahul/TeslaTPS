import React, { useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import QRCodeScanner from 'react-qr-scanner';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { isDisabled } from "@testing-library/user-event/dist/utils";

import Compressor from 'compressorjs';

function RegisterWarranty({ userDetails }) {

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let currdate = `${year}-${month<10?`0${month}`:`${month}`}-${date}`

  const [disabledButton, setdisabledButton] = useState(false);

  const [warrantyDetails, setWarrantyDetails] = useState([]);
  const [allSerialNo, setAllSerialNo] = useState([]);
  useEffect(() => {
    getWarrantyDetails();
    // getAllSerialNo();
    fetchStateData();
  },[userDetails])
  function getWarrantyDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'warrantyDetails.php?userId='+userDetails.id).then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setWarrantyDetails(data.data);
      }
    });
  }
  // function getAllSerialNo(){
  //   axios.get( process.env.REACT_APP_ADMIN_URL + 'getAllSerialNo.php?type=unused').then(function(response) {
  //     var data = response.data;
  //     if(data.statusCode === 200){
  //       setAllSerialNo(data.data);
  //     }
  //   });
  // }

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

  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    getProductDetails();
  },[userDetails])
  function getProductDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'productDetails.php').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setProductDetails(data.data);
      }
    });
  }

  const [vehicleDetails, setVehicleDetails] = useState([]);
  useEffect(() => {
    getVehicleDetails();
  },[userDetails])
  function getVehicleDetails(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'vehicleDetails.php').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setVehicleDetails(data.data);
      }
    });
  }

  const [engineTypes, setEngineTypes] = useState([]);
  useEffect(() => {
    getEngineTypes();
  },[userDetails])
  function getEngineTypes(){
    axios.get( process.env.REACT_APP_ADMIN_URL + 'engineTypes.php').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setEngineTypes(data.data);
      }
    });
  }

  const [needCustinfo, setNeedCustinfo] = useState(false);
  const [dealers, setdealers] = useState([]);
  useEffect(() => {
    getdealers();
  },[userDetails])
  function getdealers(){
    axios.get(process.env.REACT_APP_ADMIN_URL + 'userList.php?user_type=2').then(function (response) {
      var data = response.data;
      if(data.statusCode === 200){
        setdealers(data.data);
      }
    });
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const notify = (type, msg) => {
    if(type === 'success')
    toast.success(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'alert')
    toast.warn(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'error')
    toast.error(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
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

  //qr code scanner
  const [qrCode, setQrCode] = useState('');
  const handleScan = (qrCode) => {
    setQrCode(qrCode);
  };

  const [inputs, setInputs] = useState([]);
  const [billCopy, setBillCopy] = useState();
  const [warrantyCard, setWarrantyCard] = useState();
  const warrantyChange = (event) => {
    if(event.target.name === 'bill_copy'){
      // let reader = new FileReader();
      // reader.onload = function(event) {
      //   let changeImage = event.target.result;
      //   setBillCopy(changeImage);
      // }
      // reader.readAsDataURL(event.target.files[0]);
      const image = event.target.files[0];
      new Compressor(image, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.        
          // setCompressedFile(compressedResult);
          // console.log(compressedResult);

          var reader = new FileReader();
          reader.readAsDataURL(compressedResult); 
          reader.onloadend = function() {
            var base64data = reader.result;          
            setBillCopy(base64data);      
            // console.log(base64data);
          }
        },
      });
    }else if(event.target.name === 'warranty_card'){
      const image = event.target.files[0];
      new Compressor(image, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.        
          // setCompressedFile(compressedResult);
          // console.log(compressedResult);

          var reader = new FileReader();
          reader.readAsDataURL(compressedResult); 
          reader.onloadend = function() {
            var base64data = reader.result;          
            setWarrantyCard(base64data);      
            // console.log(base64data);
          }
        },
      });
      // let reader = new FileReader();
      // reader.onload = function(event) {
      //   let changeImage = event.target.result;
      //   setWarrantyCard(changeImage);
      // }
      // reader.readAsDataURL(event.target.files[0]);
    }else{
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({ ...values, [name]: value }));
      if(name === 'mobile_number')  setShowOtp(false);
      if(name === 'product_serial_no')  setSerialNoVerify(false);
      if(name == 'product'){
        productDetails.forEach((employee, index) => {
          if(employee.id == value){
            setModelDetails(employee.models);
          }
        })
        setProductId(value);
      }
      if(name == 'vehicle_mfr'){
        vehicleDetails.forEach((employee, index) => {
          if(employee.id == value){
            setVehicleModelDetails(employee.models);
          }
        })
      }
      if(name == 'state') fetchCityData(value);
    }
  }
  const [modelDetails, setModelDetails] = useState([]);
  const [vehicleModelDetails, setVehicleModelDetails] = useState([]);
  const [productId, setProductId] = useState(0);

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  const [showOtp, setShowOtp] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const verifyNumber = () => {
    console.log(inputs);
    if(inputs === undefined){notify("alert","Please Enter Your Phone number");return;}
    if(inputs.mobile_number === undefined || inputs.mobile_number === ''){notify("alert","Please Enter Your Phone number");return;} 
    if(inputs.mobile_number.length !== 10){notify("alert","Please Enter valid Phone number");return;} 
    axios.post( process.env.REACT_APP_ADMIN_URL + 'verifyForWarranty.php', inputs).then(function(response){
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
        setInputs(values => ({ ...values, generated_otp: data.otp}));
        setShowOtp(true);
		setOtpVisible(data.otpVisible)
        if(data.registered == "NO"){
          setNeedCustinfo(true);
        }else{
          setNeedCustinfo(false);
        }
      }else{
        notify("alert",data.msg);
        setShowOtp(false);
      }
    });
  }

  const [verifiedSerialNo, setVerifiedSerialNo] = useState([])
  const [serialNoVerify, setSerialNoVerify] = useState(false)
  const checkSerialNo = () => {
    if(inputs.product_serial_no === undefined || inputs.product_serial_no === ''){notify("alert","Please Enter Your Serial No");return;}
    axios.post( process.env.REACT_APP_ADMIN_URL + 'checkSerialNo.php', {product_serial_no:inputs.product_serial_no}).then(function(response){
      var data = response.data;
      if(data.statusCode === 200){
        setSerialNoVerify(true);
        setVerifiedSerialNo(data.data)
        setProductId(data.data.cat_id);
      }else if(data.statusCode === 201){
        setSerialNoVerify(true);
        setVerifiedSerialNo([])
        setProductId(0);
      }else if(data.statusCode === 202){
        setVerifiedSerialNo([])
        notify("alert",data.msg);
        setProductId(0);
      }
    });
  }

  const warrantySubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    // if(inputs.name === undefined || inputs.name === ''){  notify("alert","Please Enter Your Name");return;  }
    if(inputs.mobile_number === undefined || inputs.mobile_number === ''){  notify("alert","Please Enter Your Phone number");return;  }
    // if(inputs.product === undefined || inputs.product === ''){  notify("alert","Please Select Product");return;  }
    // if(inputs.model_no === undefined || inputs.model_no === ''){  notify("alert","Please Select Model number");return;  }
    if(inputs.product_serial_no === undefined || inputs.product_serial_no === ''){  notify("alert","Please Enter Serial Number");return;  }
    if(inputs.purchase_date === undefined || inputs.purchase_date === ''){  notify("alert","Please Enter Purchase Date");return;  }
    if(inputs.entered_otp === undefined && inputs.entered_otp === ''){  notify("alert","Please Enter OTP");return;  }
    if(inputs.generated_otp != inputs.entered_otp){   notify("alert","Please Enter Correct OTP");return;  }
    
    setdisabledButton(true);
    axios.post( process.env.REACT_APP_ADMIN_URL + 'warrantyAddByTps.php', {inputs, billCopy, warrantyCard, userDetails}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }
      event.target.reset();
      setShow(false);
      getWarrantyDetails();
      setdisabledButton(false);
    });      
  }

  
  const [searchValue, setsearchValue] = useState('');
  const inputChange = (event) => {
    const value = event.target.value;
    setsearchValue(value);
  }

  function downloadUrl(name, url) {
    let result = url.split(".")
    let ext = result[result.length -1]
    // return
    axios.get(url, { responseType: "blob" }).then(function (response) {
      var res = response.data;
      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = function () {
        let base64 = reader.result.toString();
        let filePath = Math.floor((Math.random() * 1000000000) + 1)+ name + "." + ext;
        Filesystem.writeFile({
          path: filePath, data: base64, directory: Directory.Documents
        }).then((res) => {
          console.log("file location : " + res.uri)

          FileOpener.open({
            filePath: res.uri,
          });

          notify("success", "Document saved in your directory");
        }, (err) => {
          notify("alert", "Something went wrong");
        })

      }
    });
  }

  let filterWarrantyDetails = warrantyDetails.filter(item => {
    return (
      (searchValue ? 
        ( 
          item.mobile_number.toLowerCase().includes(searchValue.toLowerCase()) 
          || item.product_serial_no.toLowerCase().includes(searchValue.toLowerCase()) 
          || item.model_no.toLowerCase().includes(searchValue.toLowerCase()) 
        ) 
      : true ) 
    )
  })
  
  const [statusPopup, setStatusPopup] = useState(false);
  const [warrantyStatus, setWarrantyStatus] = useState('');
  const showStatus = (status) => {
    setWarrantyStatus(status);
    setStatusPopup(true);
  }

  const [imagePopup, setImagePopup] = useState(false);
  const [warrantyImage, setWarrantyImage] = useState([]);
  const showImage = (imagename, image) => {
    setWarrantyImage({"imagename":imagename, "image":image});
    setImagePopup(true);
  }
  
  return (
    <div>
      <ToastContainer />
      <HeaderBack />
      <div className="container">

        <div className="">
          <div className="my-3 position-relative">
            <input type="text" name="search" onInput={inputChange} className="form-control" placeholder="Search Customer No / Product Serial No"/>
            <Icon.Search className="searchIcon"/>
          </div>
        </div>

        <div className="mainbody" style={{height: "75vh"}}>
          {!filterWarrantyDetails ? '' 
            : filterWarrantyDetails.length === 0 ? (
              <div className="empty-box shadow my-4 text-center">
                <img src={require('../img/empty-box.png')} alt="" />
                <h3>No Warranty have been added yet!</h3>
                <p>It's easy to add your product warranty. Just click the button below.</p>
              </div>
            )
            : (filterWarrantyDetails.map((item) => 
                <div className="empty-box-2 shadow mb-3">
                  <div className="row warrenty-text">
                    <div className="col-6">{item.product}</div>
                    <div className="col-6"><strong>Model No.:</strong> {item.model_no}</div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="w-25 wattenty-img">
                      <img src={require('../img/Gringo-Pro-3.png')} className="" alt="" />
                    </div>
                    <div className="warrenty-text w-75">
                      <strong>Product Serial No.:</strong> {item.product_serial_no}<br />
                      <strong>Warranty </strong>
                      {getFormattedDate(item.purchase_date, 'day_month_year')} <strong>To</strong> {getFormattedDate(item.expire_date, 'day_month_year')}<br />
                      <strong>Customer No.:</strong> <a className="text-decoration-none text-dark" href={'tel:'+item.mobile_number}><Icon.TelephoneFill/> {item.mobile_number}</a><br />
                    </div>
                  </div>
                  <hr/>
                  <div className="d-flex align-items-center icon-box-4">
                    <div className="w-50 text-center border-end" onClick={() => showImage('Bill Copy',process.env.REACT_APP_ADMIN_URL + item.bill_copy)}><Icon.EyeFill className="icon-color" /> Bill</div>
                    <div className="w-75 text-center border-end" onClick={() => showImage('Warranty Card',process.env.REACT_APP_ADMIN_URL + item.warranty_card)}><Icon.EyeFill className="icon-color" /> W Card</div>
                    {item.w_status == 1 ? 
                    <div className="w-100 text-center" onClick={() => downloadUrl(item.product_serial_no,process.env.REACT_APP_ADMIN_URL + 'certificate/created/' + item.warranty_certificate)}><Icon.Download className="icon-color" /> W Certificate</div>
                    : 
                    <div className="w-25 text-center" onClick={() => showStatus(item.w_status)}><Icon.InfoCircle className="icon-color" /></div>
                    }
                  </div>
                </div>
            ))
          }
        </div>
      </div>

      {/* <button type="button" className="btn-black text-center" onClick={handleShow2}>SCAN QR TO ADD WARRANTY</button> */}
      <button type="button" className="btn-black text-center" onClick={handleShow}>ADD WARRANTY MANUALLY</button>

      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Warranty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={warrantySubmit}>
            <div className="mb-3">
              <label htmlFor="mobile_number" className="form-label">Customer Mobile Number</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control" name="mobile_number" id="mobile_number" aria-describedby="button-addon2" onChange={warrantyChange} minLength={10} maxLength={10} />
                <button className="btn btn-dark" type="button" id="button-addon2" onClick={verifyNumber}>Verify</button>
              </div>
            </div>

            {showOtp ? 
              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="entered_otp" className="form-label">Enter OTP <span className="text-danger">{otpVisible==true ? inputs.generated_otp : ''}</span></label>
                  <input type="number" className="form-control" name="entered_otp" id="entered_otp" onChange={warrantyChange} />  
                </div> 

                <div className="col-12 mb-3">
                  <label htmlFor="product_serial_no" className="form-label">Product Serial No.</label>
                  <div className="input-group">
                    <input type="text" className="form-control" name="product_serial_no" id="product_serial_no" aria-describedby="button-addon2" onChange={warrantyChange} />
                    <button className="btn btn-dark" type="button" id="button-addon2" onClick={checkSerialNo}>Check</button>
                  </div>
                </div>

                {serialNoVerify ? 
                  <>
                    {!verifiedSerialNo ? '' : verifiedSerialNo.length === 0 ? 
                      <>
                      <div className="col-6 mb-3">
                        <label htmlFor="product" className="form-label">Product</label>
                        <select className="form-control" name="product" id="product" onChange={warrantyChange}>
                          <option value="">Select Product</option>
                          {!productDetails ? (
                              <option>Loading data...</option>
                            ) : productDetails.length === 0 ? (
                              <option>No data found</option>
                            ) : (productDetails.map((item) => (
                              <option value={item.id} data-key={item.models} >{item.name}</option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label htmlFor="model_no" className="form-label">Model No.</label>
                        {/* <input type="text" name="model_no" id="model_no" className="form-control" onInput={warrantyChange} /> */}
                        <select className="form-control" name="model_no" id="model_no" onChange={warrantyChange}>
                          <option value="">Select Model</option>
                          {!modelDetails ? (
                              <option>Loading data...</option>
                            ) : modelDetails.length === 0 ? (
                              <option>No data found</option>
                            ) : (modelDetails.map((item) => (
                              <option value={item.id}>{item.model_name}</option>
                            ))
                          )}
                        </select>
                      </div>
                      </>
                    : 
                      <div className="col-12 mb-3">
                      <p>
                        <strong>Product : </strong> {verifiedSerialNo.cat_name}<br/>
                        <strong>Model : </strong> {verifiedSerialNo.model_name}<br/>
                        <strong>Model Description : </strong> {verifiedSerialNo.model_description}
                      </p>
                      <hr/>
                      </div>
                    }
                    
                    {(productId == 22 || productId == 3 || productId == 19) ? 
                      <div className="col-6 mb-3">
                        <label htmlFor="vehicle_mfr" className="form-label">Vehicle Manufacturer</label>
                        <select className="form-control" name="vehicle_mfr" id="vehicle_mfr" onChange={warrantyChange}>
                          <option value="">Select Manufacturer</option>
                          {!vehicleDetails ? (
                              <option>Loading data...</option>
                            ) : vehicleDetails.length === 0 ? (
                              <option>No data found</option>
                            ) : (vehicleDetails.map((item) => (
                              <option value={item.id} data-key={item.models} >{item.name}</option>
                            ))
                          )}
                        </select>
                      </div>
                    : ""}
                    
                    {(productId == 22 || productId == 3 || productId == 19) ? 
                      <div className="col-6 mb-3">
                        <label htmlFor="vehicle_model" className="form-label">Vehicle Model</label>
                        <select className="form-control" name="vehicle_model" id="vehicle_model" onChange={warrantyChange}>
                          <option value="">Select Model</option>
                          {!vehicleModelDetails ? (
                              <option>Loading data...</option>
                            ) : vehicleModelDetails.length === 0 ? (
                              <option>No data found</option>
                            ) : (vehicleModelDetails.map((item) => (
                              <option value={item.id}>{item.veh_model_name}</option>
                            ))
                          )}
                        </select>
                      </div>
                    : ""}

                    {productId == 22 ? 
                      <div className="col-6 mb-3">
                        <label htmlFor="engine_type" className="form-label">Engine Type</label>
                        <select className="form-control" name="engine_type" id="engine_type" onChange={warrantyChange}>
                          <option value="">Select Engine Type</option>
                          {!engineTypes ? (
                              <option>Loading data...</option>
                            ) : engineTypes.length === 0 ? (
                              <option>No data found</option>
                            ) : (engineTypes.map((item) => (
                              <option value={item}>{item}</option>
                            )))
                          }
                        </select>
                      </div>  
                    : ""}
                    
                    {(productId == 22 || productId == 3 || productId == 19) ? 
                      <div className="col-6 mb-3">
                        <label htmlFor="reg_no" className="form-label">Registration Number</label>
                        <input name="reg_no" id="reg_no" className="form-control" onInput={warrantyChange}/>
                      </div>
                    : ""}

                    {needCustinfo === true ? 
                      <>
                      <div className="col-6 mb-3">
                        <label htmlFor="name" className="form-label">Customer Name</label>
                        <input type="text" name="name" id="name" className="form-control" onInput={warrantyChange} />
                      </div>

                      <div className="col-6 mb-3">
                        <label htmlFor="pin_code" className="form-label">Customer Pin Code</label>
                        <input type="text" name="pin_code" id="pin_code" className="form-control" onInput={warrantyChange} />
                      </div>

                      <div className="col-12 mb-3">
                        <label htmlFor="address" className="form-label">Customer Address</label>
                        <textarea name="address" id="address" className="form-control" onInput={warrantyChange}></textarea>
                      </div>

                      <div className="col-6 mb-3">
                        <label htmlFor="state" className="form-label">Customer State</label>
                        <select className="form-control" name="state" id="state" onChange={warrantyChange}>
                          <option>--- Select State ---</option>
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
                        <label htmlFor="city" className="form-label">Customer City</label>
                        <select className="form-control" name="city" id="city" onChange={warrantyChange}>
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
                      </>
                    : ''}

                      <div className="col-6 mb-3">
                        <label htmlFor="dealer_id" className="form-label">Select Dealer</label>
                        <select className="form-control" name="dealer_id" id="dealer_id" onChange={warrantyChange}>
                          <option value="">Select Dealer</option>  
                          {!dealers ? <option value="">No Dealer Found</option> 
                          : dealers.length == 0 ? <option value="">No Dealer Found</option> 
                          : dealers.map((item) => 
                            <option value={item.id}>{item.name} / {item.mobile_number}</option>
                          ) 
                          }
                        </select>
                      </div>

                    <div className="col-6 mb-3">
                      <label htmlFor="purchase_date" className="form-label">Date of Purchase</label>
                      <input type="date" name="purchase_date" id="purchase_date" className="form-control" max={currdate} onInput={warrantyChange} />
                    </div>
                    <div className="col-6 mb-3">
                      <label htmlFor="bill_copy" className="form-label">Attach Bill Copy</label>
                      <input type="file" name="bill_copy" id="bill_copy" className="form-control" onChange={warrantyChange} accept="image/*" required/>
                      {/* <input type="file" accept="image/*;capture=camera" />
                      <input type="file" accept="image/*" capture="camera" />
                      <input type="file" accept="image/*" />
                      <input type="file" accept="image/*" capture="environment"/> */}
                    </div>
                    <div className="col-6 mb-3">
                      <label htmlFor="warranty_card" className="form-label">Attach Warranty Card</label>
                      <input type="file" name="warranty_card" id="warranty_card" className="form-control" onChange={warrantyChange} accept="image/*" required/>
                    </div>
                    <Modal.Footer>
                      <Button type="submit" variant="primary" className="btn-black-form">Submit</Button>
                    </Modal.Footer>
                    
                  </>
                : ''}

            </div>
            : '' }

          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Warranty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QRCodeScanner
            delay={500}
            onScan={handleScan}
            facingMode={1}
            style={{ height: 200, width: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="btn-black-form" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={statusPopup} onHide={() => setStatusPopup(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Warranty Registration Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p>{warrantyStatus == 0 ? 'Pending' : warrantyStatus == 1 ? 'Approved' : warrantyStatus == 2 ? 'Reject' : ''}</p>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={imagePopup} onHide={() => setImagePopup(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{warrantyImage.imagename}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <img src={warrantyImage.image} width="100%"/>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}
export default RegisterWarranty;