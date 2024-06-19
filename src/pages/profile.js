import React from "react";
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import * as Icon from "react-bootstrap-icons";

function Profile({ userDetails }) {

  useEffect(() => {
    fetchStateData();
    setInputs(userDetails);
    setPhotoURL(process.env.REACT_APP_ADMIN_URL + 'uploads/profile-images/' + userDetails.profile_image)
  }, [userDetails])

  const notify = (type, msg) => {
    if (type === 'success')
      toast.success(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'alert')
      toast.warn(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
    else if (type === 'error')
      toast.error(msg, { position: "top-center", newestOnTop: true, autoClose: 5000, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, theme: "dark" });
  }

  const [stateOption, setstateOption] = useState('');
  function fetchStateData(value) {
    axios.post(process.env.REACT_APP_ADMIN_URL + 'fetch-state.php', { country: 101 }).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setstateOption(data.data);
        console.log(userDetails.state);
        if (userDetails.state) {
          fetchCityData(userDetails.state)
        }
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

  const [inputs, setInputs] = useState([]);
  const profileChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setInputs(values => ({ ...values, [name]: value }));
    if (name == 'state') {
      fetchCityData(value)
    }
  }

  const profileSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    if (inputs.name === undefined || inputs.name === '') { notify("alert", "Please Enter Your Name"); return; }
    if (inputs.email_address === undefined || inputs.email_address === '') { notify("alert", "Please Enter Your Email Address"); return; }
    if (inputs.company_name === undefined || inputs.company_name === '') { notify("alert", "Please Enter Your Company Name"); return; }
    if (inputs.gst_no === undefined || inputs.gst_no === '') { notify("alert", "Please Enter Your GST Number"); return; }
    if (inputs.address === undefined || inputs.address === '') { notify("alert", "Please Enter Your Address"); return; }
    if (inputs.pin_code === undefined || inputs.pin_code === '') { notify("alert", "Please Enter Your Pincode"); return; }
    if (inputs.state === undefined || inputs.state === '') { notify("alert", "Please Select Your State"); return; }
    if (inputs.city === undefined || inputs.city === '') { notify("alert", "Please Select Your City"); return; }

    axios.post(process.env.REACT_APP_ADMIN_URL + 'profile-update.php', { inputs, id: userDetails.id }).then(function (response) {
      console.log(response.data);
      var data = response.data;
      if (data.statusCode === 200) {
        notify("success", data.msg);
        setEdit(false);
      } else if (data.statusCode === 201) {
        notify("alert", data.msg);
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

  const passwordSubmit = (event) => {
    event.preventDefault();
    if(inputs.password === undefined || inputs.password === ''){  notify("alert","Please Enter Password");return;  }
    if(inputs.confirmpassword === undefined || inputs.confirmpassword === ''){  notify("alert","Please Re-Enter Password");return;  }
    if(inputs.password !== inputs.confirmpassword){  notify("alert","Both Password Should Be Same");return;  }

    axios.post( process.env.REACT_APP_ADMIN_URL + 'changePassword.php', {inputs, id:userDetails.id}).then(function(response){
      console.log(response.data);
      var data = response.data;
      if(data.statusCode === 200){
        notify("success",data.msg);
      }else if(data.statusCode === 201){
        notify("alert",data.msg);
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }); 
  }

  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(process.env.REACT_APP_ADMIN_URL + 'uploads/profile-images/no-image.jpg');
  const [openCrop, setOpenCrop] = useState(false);
  const onChangePicture = e => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPhotoURL(URL.createObjectURL(file));
      setOpenCrop(true);
    }
  };

  const [modalShow, setModalShow] = React.useState({ show: false, title: '' });

  useEffect(() => {
    if (openCrop) {
      setModalShow({ show: true, title: 'Crop Profile Photo' });
    } else {
      setModalShow({ show: false, title: 'Update Profile' });
    }
  }, [openCrop]);



  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data)
      };
    });
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);

      if (file) {
        const changeImage = await getBase64FromUrl(url);
        axios.post(process.env.REACT_APP_ADMIN_URL + 'change-profile-image.php',
          { image: changeImage, id: inputs.id, mobile_number: inputs.mobile_number }).then(function (response) {
            var data = response.data;
            if (data.statusCode === 200) {
              notify("success", data.msg);
            } else if (data.statusCode === 201) {
              notify("alert", data.msg);
            }
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [edit, setEdit] = useState( userDetails.profile_update === 1 ? true : false);

  return (
    <div>
      <ToastContainer />
      <HeaderBack />
      <div className="container">
        <div className="mainbody" style={{height: '90vh'}}>
          <div className="bg-white shadow profile-box my-4">

            {edit == false ? 
              <div>
                <div className="text-end"><button className="btn btn-outline-dark" onClick={() => setEdit(true)}><Icon.Pencil/> Edit</button></div>
                <div className="mb-2 col-12 text-center">
                  <label htmlFor="profile_image">
                    <img src={photoURL} width={"150px"} height={"150px"} className="rounded-circle" alt="Profile Pic" />
                  </label>
                </div>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Name : </strong> {inputs.name}</ListGroup.Item>
                  <ListGroup.Item><strong>Email Address : </strong> {inputs.email_address}</ListGroup.Item>
                  <ListGroup.Item><strong>Mobile Number : </strong> {inputs.mobile_number}</ListGroup.Item>
                  <ListGroup.Item><strong>Company / Store Name : </strong> {inputs.company_name}</ListGroup.Item>
                  <ListGroup.Item><strong>GST No. : </strong> {inputs.gst_no}</ListGroup.Item>
                  <ListGroup.Item><strong>Pin Code : </strong> {inputs.pin_code}</ListGroup.Item>
                  <ListGroup.Item><strong>State : </strong> {inputs.state_name}</ListGroup.Item>
                  <ListGroup.Item><strong>City : </strong> {inputs.city_name}</ListGroup.Item>
                  <ListGroup.Item><strong>Address : </strong> {inputs.address}</ListGroup.Item>
                </ListGroup>
              </div>
              :
              <div>
                
                {userDetails.profile_update === 1 ? 
                  <p className="text-danger text-center">You have to complete your profile.</p> 
                : 
                  <div className="text-end"><button className="btn btn-outline-dark" onClick={() => setEdit(false)}><Icon.X/> Cancel</button></div>
                }

                <div className="mb-2 col-12 text-center">
                  {/* <div><Icon.Pencil/></div> */}
                  <label htmlFor="profile_image">
                    <img src={photoURL} width={"150px"} height={"150px"} className="rounded-circle" alt="Profile Pic" />
                    <input type="file" className="d-none" name="profile_image" id="profile_image" onChange={onChangePicture} />
                  </label>
                </div>

                <form onSubmit={profileSubmit}>

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" name="name" id="name" className="form-control" onInput={profileChange} value={inputs.name} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email_address" className="form-label">Email Address</label>
                    <input type="text" name="email_address" id="email_address" className="form-control" onInput={profileChange} value={inputs.email_address} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input type="text" className="form-control" value={inputs.mobile_number} disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="company_name" className="form-label">Company / Store Name</label>
                    <input type="text" name="company_name" id="company_name" className="form-control" onInput={profileChange} value={inputs.company_name} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gst_no" className="form-label">GST No.</label>
                    <input type="text" name="gst_no" id="gst_no" className="form-control" onInput={profileChange} value={inputs.gst_no} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea name="address" id="address" className="form-control" value={inputs.address} onInput={profileChange}></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pin_code" className="form-label">Pin Code</label>
                    <input type="text" name="pin_code" id="pin_code" className="form-control" onInput={profileChange} value={inputs.pin_code} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <select className="form-control" name="state" id="state" onChange={profileChange}>
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

                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <select className="form-control" name="city" id="city" onChange={profileChange}>
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

                  <Button type="submit" variant="primary" className="btn-black-form">Save Profile</Button>

                </form>
              </div>
            }
          </div>

          {/* <div className="bg-white shadow profile-box my-4">
            <form onSubmit={passwordSubmit}>
              <div className="mb-3">
                <label className="form-label">Enter Password</label>
                <input type="text" className="form-control" name="password" onInput={profileChange}/>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="text" className="form-control" name="confirmpassword" onInput={profileChange}/>
              </div>
              <Button type="submit" variant="primary" className="btn-black-form">Change Password</Button>
            </form>
          </div> */}
        </div>

        <Modal show={modalShow.show} onHide={() => setModalShow({ show: false, title: '' })} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton className="shadow header-bg-modal">
            <Modal.Title id="contained-modal-title-vcenter" className="modal-title-edit">{modalShow.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ width: 'auto', height: '400px', position: 'relative' }}>
              <Cropper
                image={photoURL}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropChange={setCrop}
                onCropComplete={cropComplete}
              />
            </div>

            <div className="my-3 row">
              <label htmlFor="customRange3" className="col-sm-2 col-form-label">Zoom {zoomPercent(zoom)}</label>
              <div className="col-sm-10">
                <input type="range" className="form-range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(e.target.value)} id="customRange3" />
              </div>
            </div>

            <div className="mb-3 row">
              <label htmlFor="customRange4" className="col-sm-2 col-form-label">Rotation: {rotation + '°'}</label>
              <div className="col-sm-10">
                <input type="range" className="form-range" min="0" max="360" value={rotation} onChange={(e) => setRotation(e.target.value)} id="customRange4" />
              </div>
            </div>

            <button type="submit" className="btn btn-danger mb-3 me-3" onClick={() => setOpenCrop(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary mb-3" onClick={cropImage}>Upload</button>
          </Modal.Body>
        </Modal>

      </div>
    </div>
  );
}
export default Profile;

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
};