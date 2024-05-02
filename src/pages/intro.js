import React from "react";
import { ArrowRight  } from "react-bootstrap-icons";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '../pages/intro.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect  } from "react";
import { useCookies } from 'react-cookie';
import axios from "axios";

function Intro() {

  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);
  function getUsers() {
    axios.get( process.env.REACT_APP_ADMIN_URL + 'user-detail.php?userId='+cookies.userId+'&userType=4').then(function(response) {
      var data = response.data;
      if(data.statusCode === 200){
        navigate("/dashboard");
      }
    });
  }
  useEffect(() => {
    if(cookies.userId !== undefined && cookies.userId !== ''){
      getUsers();
    }
  }, [navigate])

  return (
    <div>
      <div className="container">
        <div className="brand-name text-center">
        <img src={require('../img/Tesla-main-c-b.png')} alt="" />
        </div>
      <div className="main-slider">
      <Splide className="my-carousel" aria-label="Main text slider" options={{
            rewind: true,
            autoplay: true,
            arrows: false,
            pagination: true,
          }}>
            <SplideSlide>
              <div className="slider-text-2">
                <div className="text-center">
                  <img src={require('../img/Gringo-Pro-3.png')} alt="" />
                  <h2>EASY<br/>TRACKING</h2>
                  <p>Easy mapping of all complaints, warranty registrations done by Dealers</p>
                </div>
              </div>
            </SplideSlide>
            <SplideSlide>
              <div className="slider-text-2">
                <div className="text-center">
                  <img src={require('../img/Gringo-Pro-3.png')} alt="" />
                  <h2>LATEST<br/>SCHEMES</h2>
                  <p>Avail latest offers and schemes from Tesla Power USA</p>
                </div>
              </div>
            </SplideSlide>
            <SplideSlide>
              <div className="slider-text-2">
                <div className="text-center">
                  <img src={require('../img/Gringo-Pro-3.png')} alt="" />
                  <h2>STOCK-IN<br/>REWARDS</h2>
                  <p>Approve Dealers' purchase invoice to earn loyalty points</p>
                </div>
              </div>
            </SplideSlide>
          </Splide>
      </div>
    <Link className="nav-Link open-link btn-black text-center" to={'/login'}>START AS TPS <ArrowRight /></Link>
      </div>
    </div>
  );
}
export default Intro;