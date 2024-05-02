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

function Register() {

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

  const [inputs, setInputs] = useState([]);
  const registerChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setInputs(values => ({ ...values, [name]: value }));
  }

  const [phoneDisabled, setphoneDisabled]  = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const verifyNumber = () => {
    console.log(inputs);
    if(inputs === undefined){notify("alert","Please Enter Your Phone number");return;}
    if(inputs.mobile_number === undefined || inputs.mobile_number === ''){notify("alert","Please Enter Your Phone number");return;} 
    if(inputs.mobile_number.length !== 10){  notify("alert","Please Enter Valid Phone number");return;  }

    setphoneDisabled(true);

    axios.post( process.env.REACT_APP_ADMIN_URL + 'verifyNumber.php', inputs).then(function(response){
      var data = response.data;
      if(data.statusCode === 200){
        setInputs(values => ({ ...values, generated_otp: data.otp}));
        setShowOtp(true);
      }else{
        notify("alert","Phone is not registered, please check your entered phone number");
        setShowOtp(false);
        setphoneDisabled(false);
      }
    });
  }

  const registrationSubmit = (event) => {
    event.preventDefault();
    if(inputs.mobile_number === undefined && inputs.mobile_number === ''){  notify("alert","Please Enter Your Phone number");return;  }
    if(inputs.mobile_number.length !== 10){  notify("alert","Please Enter Valid Phone number");return;  }
    if(inputs.entered_otp === undefined && inputs.entered_otp === ''){  notify("alert","Please Enter OTP");return;  }
    if(inputs.password === undefined && inputs.password === ''){  notify("alert","Please Enter New Password");return; }
    if(inputs.confirmpassword === undefined && inputs.confirmpassword === ''){  notify("alert","Please Re-Enter New Password");return; }
    if(inputs.generated_otp != inputs.entered_otp){   notify("alert","Please Enter Correct OTP");return;  }
    if(inputs.password != inputs.confirmpassword){   notify("alert","Both Entered Password Should be Same");return;  }
    
    axios.post( process.env.REACT_APP_ADMIN_URL + 'resetPassword.php', {inputs, user_type:2}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
        setTimeout(function(){
          window.location.href='/login';
        },1500);
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }else if(data.statusCode === 202){
        notify("alert",data.msg);
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
                <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                <div className="input-group mb-3">
                  <input type="number" className="form-control" name="mobile_number" id="mobile_number" aria-describedby="button-addon2" onChange={registerChange} disabled={phoneDisabled}/>
                  <button className="btn btn-dark" type="button" id="button-addon2" onClick={verifyNumber}>Verify</button>
                </div>
              </div>  

              {showOtp ? 
              <div>
                <div className="mb-2">
                  <label htmlFor="entered_otp" className="form-label">Enter OTP <span className="text-danger">{inputs.generated_otp}</span></label>
                  <input type="number" className="form-control" name="entered_otp" id="entered_otp" onChange={registerChange} />  
                </div>

                <div className="mb-2">
                  <label htmlFor="password" className="form-label">Enter Password</label>
                  <input type="password" className="form-control" name="password" id="password" onChange={registerChange} />
                </div>

                <div className="mb-2">
                  <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" name="confirmpassword" id="confirmpassword" onChange={registerChange} />
                </div>

                <Button type="submit" className="btn-black-form">SUBMIT <ArrowRight /></Button>
              </div>
              : '' }
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