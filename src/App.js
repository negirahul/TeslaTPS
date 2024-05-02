import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Intro from './pages/intro';
import Login from './pages/login';
import Register from './pages/register';
import Forgot from './pages/forgot-password';
import Dashboard from './pages/dashboard';
import LeadManagement from './pages/lead-management';
import RegisterWarranty from './pages/register-warranty';
import GrievancesComplaint from './pages/grievances-complaint';
import ReisingComplaint from './pages/raising-complaint';
import Wallet from './pages/wallet';
import StockRequest from './pages/stock-request';
import Profile from './pages/profile';
import Dealer from './pages/dealer';
import OtherFeature from './pages/other-features';
import Offers from './pages/offers';
import Library from './pages/library';
import AllCustomer from './pages/all-customers';

import { useState, useEffect  } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';

function App() {

  const [userDetails,setUserDetails] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  function getUsers() {
    axios.get( process.env.REACT_APP_ADMIN_URL + 'user-detail.php?userId='+cookies.userId+'&userType=4').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        setUserDetails(data.userData);
      }else{
        setCookie('userId', '', { path: '/', maxAge: -1});
        window.location.reload();
      }
    });
  }
  useEffect(() => {
    if(cookies.userId !== undefined && cookies.userId !== ''){
      getUsers();
    }
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Intro />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<Forgot />} />
          <Route path="dashboard" element={<Dashboard userDetails={userDetails}/>} />
          <Route path="lead-management" element={<LeadManagement userDetails={userDetails}/>} />
          <Route path="register-warranty" element={<RegisterWarranty userDetails={userDetails}/>} />
          <Route path="grievances-complaint" element={<GrievancesComplaint userDetails={userDetails}/>} />
          <Route path="raising-complaint" element={<ReisingComplaint userDetails={userDetails}/>} />
          <Route path="wallet" element={<Wallet userDetails={userDetails}/>} />
          <Route path="stock-request" element={<StockRequest userDetails={userDetails}/>} />
          <Route path="profile" element={<Profile userDetails={userDetails}/>} />
          <Route path="dealer" element={<Dealer userDetails={userDetails}/>} />
          <Route path="other-features" element={<OtherFeature userDetails={userDetails}/>} />
          <Route path="offers" element={<Offers userDetails={userDetails}/>} />
          <Route path="library" element={<Library userDetails={userDetails}/>} />
          <Route path="all-customers" element={<AllCustomer userDetails={userDetails}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
