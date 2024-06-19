import React from "react";
import { ArrowRight } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../pages/intro.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { useCookies } from 'react-cookie';

function Register() {

  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);

  const notify = (type, msg) => {
    if (type === 'success')
      toast.success(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'alert')
      toast.warn(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'error')
      toast.error(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
  }

  const [inputs, setInputs] = useState([]);
  const registerChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setInputs(values => ({ ...values, [name]: value }));
    if (name == 'state') {
      fetchCityData(value)
    }
  }

  const [showOtp, setShowOtp] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const verifyNumber = () => {
    console.log(inputs);
    if (inputs === undefined) { notify("alert", "Please Enter Your Phone number"); return; }
    if (inputs.mobile_number === undefined || inputs.mobile_number === '') { notify("alert", "Please Enter Your Phone number"); return; }
    if (inputs.mobile_number.length !== 10) { notify("alert", "Please Enter Valid Phone number"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'verifyRegistrationNumber.php', inputs).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setInputs(values => ({ ...values, generated_otp: data.otp }));
        setShowOtp(true);
        setOtpVisible(data.otpVisible)
      } else {
        console.log(data.msg);
        notify("alert", data.msg);
        setShowOtp(false);
      }
    });
  }

  const registrationSubmit = (event) => {
    event.preventDefault();
    if (inputs.name === undefined && inputs.name === '') { notify("alert", "Please Enter Your Name"); return; }
    if (inputs.mobile_number === undefined && inputs.mobile_number === '') { notify("alert", "Please Enter Your Phone number"); return; }
    if (inputs.mobile_number.length !== 10) { notify("alert", "Please Enter Valid Phone number"); return; }
    if (inputs.email_address === undefined && inputs.email_address === '') { notify("alert", "Please Enter Your Phone number"); return; }
    if (inputs.entered_otp === undefined && inputs.entered_otp === '') { notify("alert", "Please Enter OTP"); return; }
    if (inputs.state === undefined && inputs.state === '') { notify("alert", "Please Select Your State"); return; }
    if (inputs.city === undefined && inputs.city === '') { notify("alert", "Please Select Your City"); return; }
    // if (inputs.password === undefined && inputs.password === '') { notify("alert", "Please Select Your Password"); return; }
    if (inputs.generated_otp != inputs.entered_otp) { notify("alert", "Please Enter Correct OTP"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'register.php', { inputs, user_type: 3 }).then(function (response) {
      console.log(response.data);
      var data = response.data;
      if (data.statusCode === 200) {
        // setCookie('userId', data.userId, { path: '/', maxAge: 86400 * 365 });
        notify("success", data.msg);
        setTimeout(function () {
          // navigate("/dashboard");
          window.location.href = '/login';
        }, 1500);
      } else if (data.statusCode === 201) {
        notify("alert", data.msg);
      } else if (data.statusCode === 202) {
        notify("alert", data.msg);
      }
    });
  }

  useEffect(() => {
    fetchStateData();
  }, [])
  // const [countryOption, setcountryOption]  = useState('');
  // function fetchCountryData() {
  //   axios.get( process.env.REACT_APP_SERVICE_URL + 'fetch-country.php').then(function(response){
  //     var data = response.data;  
  //     if(data.statusCode === 200){
  //       setcountryOption(data.data);
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

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div className="div-center">
          <div className="brand-name-login text-center">
            <img src={require('../img/Tesla-main-c-b.png')} alt="" />
          </div>
          <Card className="card-login shadow-lg gradent-top">
            <Card.Body>
              <form className="inside-form" onSubmit={registrationSubmit}>
                <div className="mb-2">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input type="text" className="form-control" name="name" id="name" onChange={registerChange} />
                </div>

                <div className="mb-2">
                  <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                  <div className="input-group mb-3">
                    <input type="number" className="form-control" name="mobile_number" id="mobile_number" aria-describedby="button-addon2" onChange={registerChange} />
                    <button className="btn btn-dark" type="button" id="button-addon2" onClick={verifyNumber}>Verify</button>
                  </div>
                </div>

                {showOtp ?
                  <div>
                    <div className="mb-2">
                      <label htmlFor="entered_otp" className="form-label">Enter OTP <span className="text-danger">{otpVisible==true ? inputs.generated_otp : ''}</span></label>
                      <input type="number" className="form-control" name="entered_otp" id="entered_otp" onChange={registerChange} />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="email_address" className="form-label">Email Address</label>
                      <input type="text" className="form-control" name="email_address" id="email_address" onChange={registerChange} />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="state" className="form-label">State</label>
                      <select className="form-control" name="state" id="state" onChange={registerChange}>
                        <option>--- Select State ---</option>
                        {!stateOption ? (
                          <option>Loading data...</option>
                        ) : stateOption.length === 0 ? (
                          <option>No data found</option>
                        ) : (stateOption.map((item) => (
                          <option value={item.id} selected={item.id === inputs.state ? true : false} >{item.name}</option>
                        ))
                        )}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label htmlFor="city" className="form-label">City</label>
                      <select className="form-control" name="city" id="city" onChange={registerChange}>
                        {/* <option>--- Select City ---</option> */}
                        {!cityOption ? (
                          <option>Select State First</option>
                        ) : cityOption.length === 0 ? (
                          <option>No data found</option>
                        ) : (cityOption.map((item) => (
                          <option value={item.id} selected={item.id === inputs.city ? true : false} >{item.name}</option>
                        ))
                        )}
                      </select>
                    </div>

                    {/* <div className="mb-2">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" name="password" id="password" onChange={registerChange} />
                    </div> */}

                    <div className="mb-2">
                      <label htmlFor="reffercode" className="form-label">Reffer Code (optional)</label>
                      <input type="text" className="form-control" name="reffercode" id="reffercode" onChange={registerChange} />
                    </div>

                    <input type="hidden" name="user_type" value="1" />
                    <Button type="submit" className="btn-black-form">SUBMIT <ArrowRight /></Button>
                  </div>
                  : ''}
              </form>
            </Card.Body>
          </Card>
          <div className="extra-link text-center">
            <p>Already Registered!<br /><Link className="open-link-app" to={'../login'}>Log in</Link></p>
          </div>
        </div>

        {/* <div className="copyright">
          &#169; Copyright {year} <br />VERSION. 0.1
        </div> */}

      </div>
    </div>
  );
}
export default Register;