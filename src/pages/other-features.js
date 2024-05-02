import React from "react";
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from "react";
import axios from "axios";
import {
  WhatsappShareButton, WhatsappIcon,
  EmailShareButton, EmailIcon
} from "react-share";

function OtherFeatures({ userDetails }) {

  const [referCode, setreferCode] = useState();
  const [referCodeUrl, setreferCodeUrl] = useState();

  useEffect(() => {
    fetchRefferCode();
  }, [userDetails])

  const fetchRefferCode = () => {
    console.log(userDetails);
    if (userDetails.reffercode === null) {
      axios.post(process.env.REACT_APP_ADMIN_URL + 'update-reffercode.php', { id: userDetails.id }).then(function (response) {
        var data = response.data;
        if (data.statusCode === 200) {
          setreferCode(data.reffercode)
          setreferCodeUrl('https://teslahealthylife.com/login.php?reffercode=' + data.reffercode);
        }
      });
    } else {
      setreferCode(userDetails.reffercode)
      setreferCodeUrl('https://teslahealthylife.com/login.php?reffercode=' + userDetails.reffercode);
    }
  }

  const smsClick = () => {
    const smsUrl = 'sms:?body=${encodeURIComponent(referCodeUrl)}';
    window.location.href = smsUrl;
  }

  return (
    <div>
      <HeaderBack />

      <div className="container">

        <div className="empty-box-3 shadow my-4 text-center">
          <h2 className="heading-ref">THE MORE YOU SHARE
            THE MORE YOU EARN<br />
          </h2>
          <img src={require('../img/undraw_Mobile_user_re_xta4.png')} className="ref-img" alt="" />
          <div className="body-ref">
            Take part in our <strong>referral program.</strong> Invite your loved ones to use our product & get <strong>INR 500 Referral Point</strong>
            <div class="input-group mb-3 mt-3 w-50 mx-auto">
              <input type="text" class="form-control form-control-sm p-2 text-center" value={referCode} placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
              <button class="btn btn-sm btn-outline-dark" type="button" id="button-addon2" onClick={() => { navigator.clipboard.writeText(referCodeUrl); }}>Copy</button>
            </div>
          </div>

          <WhatsappShareButton url={referCodeUrl} className="btn-black-form mt-1">
            <Button variant="primary" className="btn-black-form mt-1">Share via whatsapp</Button>
          </WhatsappShareButton>

          <EmailShareButton url={referCodeUrl} className="btn-black-form mt-1">
            <Button variant="primary" className="btn-black-form mt-1">Share via Email</Button>
          </EmailShareButton>

          <button onClick={smsClick} variant="primary" className="btn-black-form mt-1">Share via SMS</button>
        </div>

      </div>

    </div>
  );
}
export default OtherFeatures;