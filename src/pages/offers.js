import React from "react";
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';

import { useState, useEffect } from "react";
import axios from "axios";

function Offers({ userDetails }) {

  const [offer, setOffer] = useState([]);

  useEffect(() => {
    fetchOffer();
  }, [userDetails])

  function fetchOffer(){
    axios.post(process.env.REACT_APP_ADMIN_URL + 'offerDetails.php', {user_type:userDetails.user_type, user_state:userDetails.state}).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setOffer(data.offer);
      }
    });
  }
  return (
    <div>
      <HeaderBack />

      <div className="container">
        <div className="mainbody" style={{height: "90vh"}}>
          {!offer ? '' 
            : offer.length === 0 ? 
              <div className="empty-box shadow my-4 text-center">
                <img src={require('../img/empty-box.png')} alt="" />
                <h3>No Offers</h3>
                <p>We will announce offers very soon.</p>
              </div>
            : 
            <div className="shadow my-4 p-4 bg-white rounded">
              {offer.map((item) => 
                <img src={process.env.REACT_APP_ADMIN_URL + item.banner} className="w-100 my-3" alt="" />
              )}
            </div>
          }

          {/* <div className="shadow my-4 p-4 bg-white rounded">
            <img src={require('../img/alkalino-01.jpg')} className="w-100 my-3" alt="" />
            <img src={require('../img/automotive-02-1.jpg')} className="w-100 my-3" alt="" />
            <img src={require('../img/automotive-02.jpg')} className="w-100 my-3" alt="" />
          </div> */}
        </div>
      </div>

    </div>
  );
}
export default Offers;