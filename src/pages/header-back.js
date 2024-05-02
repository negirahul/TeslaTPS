import React from "react";
import {useNavigate} from 'react-router-dom';
import '../pages/intro.css';
import * as Icon from "react-bootstrap-icons";

function HeaderBack() {
    const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}

    return (
        <div className="header-app shadow">
            <div className="header-back" onClick={goBack}>
                <Icon.ChevronLeft/> Back
            </div>
        </div>
    );
}
export default HeaderBack;