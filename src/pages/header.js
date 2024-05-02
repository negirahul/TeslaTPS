import React from "react";
import '../pages/intro.css';

function Header() {

    return (
        <div className="header-app shadow">
            <div className="d-flex justify-content-between">
                <img src={require('../img/Amercian-tech-w2.png')} alt="" className="brand-one"/>
                <img src={require('../img/Tesla-main-c-b.png')} alt="" className="brand-two"/>
            </div>
        </div>
    );
}
export default Header;