import React from "react";
import '../pages/intro.css';
import HeaderBack from '../pages/header-back';
import * as Icon from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { clear } from "@testing-library/user-event/dist/clear";

function Library({ userDetails }) {

  const notify = (type, msg) => {
    if(type === 'success')
    toast.success(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'alert')
    toast.warn(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
    else if(type === 'error')
    toast.error(msg, {position:"top-center", newestOnTop:true, autoClose:5000, closeOnClick:true, rtl:false, pauseOnFocusLoss:true, draggable:true, theme:"dark"});
  }

  const [librarydata, setlibrary] = useState([]);

  useEffect(() => {
    fetchlibrary();
  }, [userDetails])

  function fetchlibrary() {
    axios.get(process.env.REACT_APP_ADMIN_URL + 'libraryDetails.php?user_type=' + userDetails.user_type).then(function (response) {
      var data = response.data;
      if (data.statusCode === 200) {
        setlibrary(data.library);
      }
    });
  }

  const [folderName, setFolderName] = useState(null);
  const [media, setMedia] = useState([]);
  const [showMedia, setShowMedia] = useState(false);
  const fetchMedia = (folderName, media) => {
    setFolderName(folderName);
    setMedia(media);
    setShowMedia(true);
  }

  const showFolder = () => {
    setFolderName(null);
    setMedia([]);
    setShowMedia(false);
  }

  function downloadUrl(url, heading) {

    console.log("path : "+ Directory.Documents);
    // return

    axios.get(url, { responseType: "blob" }).then(function (response) {
      var res = response.data;
      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = function () {
        let base64 = reader.result.toString();
        let filePath = heading +".pdf";
        Filesystem.writeFile({
          path: filePath, data: base64, directory: Directory.Documents
        }).then((res) => {
          console.log("file location : " + res.uri)

          FileOpener.open({
            filePath: res.uri,
          });

          notify("success", "Document saved in your directory");
        }, (err) => {
          notify("alert", "Something went wrong");
        })

      }
    });
  }

  const [popupMedia, setPopupMedia] = useState(null);
  const handlePopupMedia = (media) => {
    setPopupMedia(media);
    handleView(true);
  }

  const [view, setView] = useState(false);
  const handleView = (status) => setView(status);

  const [searchValue, setsearchValue] = useState('');
  const inputChange = (event) => {
    const value = event.target.value;
    setsearchValue(value);
  }

  return (
    <div>
      <ToastContainer />
      <HeaderBack />

      <div className="container">

        <div className="my-2 ms-2">
          <ul className="list-unstyled d-flex">
            <li><span className="text-decoration-none text-dark me-2" onClick={() => showFolder()}>Folders</span></li>
            {folderName != null ? <li><span className="text-decoration-none text-dark"> / {folderName}</span></li> : ''}
          </ul>
        </div>

        <div className="">
          <div className="my-3 position-relative">
            <input type="text" name="search" onInput={inputChange} class="form-control" placeholder="Search By Name" />
            <Icon.Search className="searchIcon" />
          </div>
        </div>

        {
        !showMedia ? 

          !librarydata ? ''
          : librarydata.length === 0 ?
            <div className="empty-box shadow my-4 text-center">
              <img src={require('../img/empty-box.png')} alt="" />
              <h3>No Offers</h3>
              <p>We will announce offers very soon.</p>
            </div>
          : 
          <div className="row">
            {librarydata.map((item) =>
              searchValue.length == 0 ? 
              <div className="col-6">
                <div className="shadow my-4 p-4 bg-white rounded">
                  <div className="text-center" onClick={() => fetchMedia(item.folder_name, item.media)}>
                      <Icon.FolderFill fontSize={50}/>
                      <hr/>
                      <h6>{item.folder_name}</h6>
                  </div>
                </div>
              </div>
              : (item.folder_name.includes(searchValue)) ? 
              <div className="col-6">
                <div className="shadow my-4 p-4 bg-white rounded">
                  <div className="text-center" onClick={() => fetchMedia(item.folder_name, item.media)}>
                      <Icon.FolderFill fontSize={50}/>
                      <hr/>
                      <h6>{item.folder_name}</h6>
                  </div>
                </div>
              </div>
              : ''
            )}
          </div>

        : 
        <div className="row">
          {media.map((item) => 
          <div className="col-6">
            <div className="shadow my-4 p-4 bg-white rounded">
              <div className="text-center">
                <div className="mb-2">
                {item.media_type=='AUDIO' ? <Icon.MicFill fontSize={50}/> 
                : item.media_type=='VIDEO' ? <Icon.CameraReelsFill fontSize={50}/> 
                : item.media_type=='IMAGE' ? <Icon.Image fontSize={50}/> 
                : item.media_type=='PDF' ? <Icon.FilePdfFill fontSize={50}/> 
                : '' }
                </div>
                <h6>{item.media_heading}</h6>
                <hr/>
                <div className="row">
                  {item.media_type == 'PDF' ? 
                  <div className="col text-center">
                    <Icon.Download onClick={() => downloadUrl(process.env.REACT_APP_ADMIN_URL + '../' + item.path + item.media, item.media_heading)} fontSize={20}/>
                  </div>
                  :
                  <div className="col text-center">
                    <Icon.EyeFill onClick={() => handlePopupMedia(item) } fontSize={20}/>
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
        }

      </div>

      <Modal show={view} onHide={() => handleView(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2 text-center">
            {popupMedia != null ?
              popupMedia.media_type == 'AUDIO' ? 
                <audio controls><source src={process.env.REACT_APP_ADMIN_URL + '../' + popupMedia.path + popupMedia.media} type="audio/mpeg"/></audio>
                : popupMedia.media_type == 'VIDEO' ? 
                  <video width="100%" height="250" controls><source src={process.env.REACT_APP_ADMIN_URL + '../' + popupMedia.path + popupMedia.media} type="video/mp4"/></video> 
                  : popupMedia.media_type == 'IMAGE' ? 
                    <img src={process.env.REACT_APP_ADMIN_URL + '../' + popupMedia.path + popupMedia.media} width="100%" /> 
                    : ''
            : ''}
          </div>
          
        </Modal.Body>
      </Modal>

    </div>
  );
}
export default Library;