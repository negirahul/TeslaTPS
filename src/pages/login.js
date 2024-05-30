import React from "react";
import { ArrowRight } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../pages/intro.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect  } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import { useCookies } from 'react-cookie';

function Login() {

  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);

  const notify = (type, msg) => {
    if(type === 'success')
    toast.success(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'alert')
    toast.warn(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'error')
    toast.error(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
  }

  const [mobileNumber, setMobileNumber] = useState(null);
  const mobileNumberChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setMobileNumber(value);
    setShowOtp(false);
  }

  const [verifyButton, setverifybutton] = useState('Verify');
  const [disabledButton, setdisabledButton] = useState(false);
  const [time, setTime] = useState(0);
  const [startCounter, setStartCounter] = useState(false);
  useEffect(() => {
    let interval = null;
    if(startCounter == true){
      interval = setInterval(() => {
        if(time > 0){
          setTime(time - 1);
          setverifybutton(time+'s');
        }else{
          clearInterval(interval);
          setverifybutton('Resend');
          setdisabledButton(false);
        }
      }, 1000);
    }else{
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [startCounter, time])

  const [userId, setUserId] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpVisible, setOtpVisible] = useState(false);
  const verifyNumber = () => {
    if (mobileNumber === null) { notify("alert", "Please Enter Your Phone number"); return; }
    if (mobileNumber === undefined || mobileNumber === '') { notify("alert", "Please Enter Your Phone number"); return; }
    if (mobileNumber.length !== 10) { notify("alert", "Please Enter Valid Phone number"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'verifyLoginNumber.php', {mobileNumber, user_type:4}).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setGeneratedOtp(data.otp);
        setUserId(data.userId)
        setShowOtp(true);
		    setOtpVisible(data.otpVisible)
        setdisabledButton(true)
        setTime(60);
        setStartCounter(true)
      } else {
        setGeneratedOtp(null);
        setUserId(null);
        notify("alert", data.msg);
        setShowOtp(false);
      }
    });
  }
  const [enterOtp, setEnterOtp] = useState(null);

  const loginSubmit = (event) => {
    event.preventDefault();
    if(mobileNumber === null || mobileNumber === ''){  notify("alert","Please Enter Your Mobile Number");return;  }
    if(generatedOtp === null || generatedOtp === ''){  notify("alert","please Verify Your Mobile Number first.");return;  }
    if(enterOtp === null || enterOtp === ''){  notify("alert","Please Enter Your OTP");return;  }
    if(generatedOtp != enterOtp){  notify("alert","Please Enter Valid OTP");return;  }

    // axios.post( process.env.REACT_APP_ADMIN_URL + 'authentication.php', {mobile_number:inputs.mobile_number, password:inputs.password, user_type:3}).then(function(response){
    //   console.log(response.data);
    //   var data = response.data;
    //   if(data.statusCode === 200){
        setCookie('userId', userId, { path: '/', maxAge: 86400 * 365});
        notify("success","Successfully Logged In");
        setTimeout(function(){
          // navigate("/dashboard");
          window.location.href='/dashboard';
        },1500);
    //   }else if(data.statusCode === 201){
    //     notify("alert",data.msg);
    //   }else if(data.statusCode === 202){
    //     notify("alert",data.msg);
    //   }
    // });
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
            <form onSubmit={loginSubmit}>
              {/* <div className="mb-3">
                <label htmlFor="mobile_number" className="form-label">User ID / Mobile Number</label>
                <input type="number" className="form-control" name="mobile_number" id="mobile_number" onChange={loginChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name="password" id="password" onChange={loginChange} />
              </div> */}
              <div className="mb-2">
                <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" name="mobile_number" id="mobile_number" onChange={mobileNumberChange} minLength={10} maxLength={10} aria-describedby="button-addon2" />
                  <button className="btn btn-dark" type="button" id="button-addon2" onClick={verifyNumber} disabled={disabledButton}>{verifyButton}</button>
                </div>
              </div>

              {showOtp ?
                <div>
                  <div className="mb-2">
                    <label htmlFor="entered_otp" className="form-label">Enter OTP <span className="text-danger">{otpVisible==true ? generatedOtp : ''}</span></label>
                    <input type="number" className="form-control" name="entered_otp" id="entered_otp" onChange={(event) => setEnterOtp(event.target.value)} />
                  </div>

                  <Button type="submit" className="btn-black-form">LOG IN <ArrowRight /></Button>
                </div>
              : ''}

              {/* <div className="text-center mt-3">
                <p><Link className="nav-Link open-link open-link-app" to={'../forgot-password'}>Forgot Password?</Link></p>
              </div> */}
            </form>
            </Card.Body>
          </Card>
          <div className="extra-link text-center">
            {/* <p>Not Registered Yet!<br /><Link className="open-link-app" to={'../register'}>Register Now</Link></p> */}
          </div>
        </div>

        <div className="copyright">
          &#169; Copyright {year} <br />VERSION. 0.1
        </div>

      </div>
    </div>
  );
}
export default Login;