import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";


function PwaInstall(props) {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    const isIOS = isIPad || isIPhone;
    const isSafari = isIOS && webkit && !ua.match(/CriOS/i);
    if (isIOS || isSafari) {
      setIsIos(true);
      console.log("da vao day");
    }
    const handler = (e) => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);
  const onClick = (evt) => {
    evt.preventDefault();
    if (isIos) {
      console.log("vao day roi");
      setShowPopup(true);
      return;
    }
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
  }
  const popup = (
    <Modal
      size="sm"
      show={showPopup} //showPopup
      onHide={() => setShowPopup(false)}
      centered
      bsPrefix="modal_pwa modal"
    >
      <Modal.Header bsPrefix="header_cs_modal">
        <div className="install_app">Install App</div>
      </Modal.Header>
      <div className="modal_body_pwa">
        <p>
          Install this application on your homescreen for a better experience.
        </p>
        <p className="uk-text-small">
          Tap
          <img
            src="/img/share_icon.png"
            className="icon_share_ios"
            height="20"
            width="20"
          />
          then &quot;Add to Home Screen&quot;
        </p>
      </div>
      <div className="close_pwa_install" onClick={() => setShowPopup(false)}>Close</div>
      {/* <div className="modal-cus__right text-right">
        <button
          type="reset"
          className="btn btn-small btn-secondary"
          onClick={() => setShowPopup(false)}
        >
          Ok
        </button>
      </div> */}
    </Modal>
  );

  return (
    <>
      {popup}
      <div onClick={onClick} className="row_icon">
        <div className="wrap_icon_menu">
          <i className="fa fa-puzzle-piece hover_icon"></i>
        </div>
        <div className="content_menu">Install App</div>
      </div>
    </>
  );
}

export default PwaInstall;
