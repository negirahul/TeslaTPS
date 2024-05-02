import React from "react";
import { useState, useEffect } from 'react';
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Wallet({ userDetails }) {

  const [walletDetails, setWalletDetails] = useState([]);
  useEffect(() => {
    getWalletDetails();
  }, [userDetails])

  function getWalletDetails() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'walletDetails.php?userId=' + userDetails.id).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setWalletDetails(data.data);
      }
    });
  }

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

  const redeemRequest = () => {
    Swal.fire({
      title: "Are you sure?",text: "You want to redeem your wallet amount!",icon: "warning",showCancelButton: true,confirmButtonColor: "#3085d6",cancelButtonColor: "#d33",confirmButtonText: "Yes, do it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post( process.env.REACT_APP_ADMIN_URL + 'redeemRequest.php', {userId:userDetails.id} ).then(function(response){
          var data = response.data;
          if(data.statusCode === 200){
            notify("success",data.msg);
          }else if(data.statusCode === 201){
            notify("alert",data.msg);
          }
        });
        // Swal.fire({title: "Deleted!",text: "Your file has been deleted.",icon: "success"});
      }
    });
  }

  return (
    <div>
      <ToastContainer />
      <HeaderBack />

      <div className="container">

        {!walletDetails ? ''
          : walletDetails.length === 0 ?
            <div className="empty-box shadow my-4 text-center">
              <img src={require('../img/empty-box.png')} alt="" />
              <h3>Empty Wallet</h3>
              <p>Sorry Your wallet is empty. You have not earned any points yet!</p>
            </div>
            :
            <div>
              <div className="empty-box shadow my-4">
                <div className="text-center main-abmount">
                  <h2>&#8377; {walletDetails.wallet}</h2>
                  <span>WALLET BALANCE</span>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="bg-white shadow d-flex box-amt-one">
                      <div><div className="arrow-down shadow">
                        <Icon.ArrowDownLeft /></div></div>
                      <div className="incom-text">Income <span>{walletDetails.income}</span></div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white shadow">
                      <div className="d-flex box-amt-one">
                        <div>
                          <div className="arrow-down shadow">
                          <Icon.ArrowUpRight /></div>
                        </div>
                        <div className="incom-text">Redeem <span>{walletDetails.expence}</span></div>
                      </div>
                      <div className="text-center"><button className="btn btn-sm btn-dark mb-2" onClick={() => redeemRequest()}>Redeem Request</button></div>
                    </div>
                  </div>
                </div>
              </div>

              {!walletDetails.historyCount ? '' :
                <div className="bg-white shadow heading-text text-center">
                  <h5>Transaction History ({walletDetails.historyCount})</h5>
                  <p>All Credit / Debit Transactions</p>
                </div>
              }

              {!walletDetails.history ? '' :
                <div className="py4 mt-4">
                  <h6>{getFormattedDate(walletDetails.history['0']['ddate'], 'day_month_year')}</h6>
                </div>
              }

              {!walletDetails.history ? '' :
                walletDetails.history.map((item) => 
                  <div className="bg-white shadow transaction-history my-4">
                    <div className="d-flex align-items-center">
                      <div className="w-25 h-date">{getFormattedDate(item.ddate, 'day')} <span>{getFormattedDate(item.ddate, 'month')}.</span></div>
                      <div className="w-100 h-text">
                        {item.message}<span>Txn. ID: {item.txn_id}</span>
                        {item.txn_for == 2 ? item.reffered_user_details.mobile_number : '' }
                      </div>
                      {item.flow_type == 1 ?
                        <div className="w-25 h-amt">-{item.amount}</div>
                        : <div className="w-25 h-amt text-success">+{item.amount}</div>
                      }
                    </div>
                  </div>
                )
              }
            </div>
        }

      </div>

    </div>
  );
}
export default Wallet;