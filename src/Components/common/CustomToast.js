import React, { useState } from "react";

export default function CustomToast(props) {
  if (props.type == "error") {
    return (
      <div
        className="alert alert-custom alert-light-danger fade show "
        role="alert"
      >
        <div className="alert-icon">
          <i className="flaticon-warning"></i>
        </div>
        <div className="alert-text">{props.title}</div>
        <div className="alert-close">
          <button type="button" className="close" onClick={props.closeToast}>
            <span aria-hidden="true">
              <i className="ki ki-close"></i>
            </span>
          </button>
        </div>
      </div>
    );
  } else if (props.type == "warning") {
    return (
      <div
        className="alert alert-custom alert-light-warning fade show "
        role="alert"
      >
        <div className="alert-icon">
          <i className="flaticon-warning"></i>
        </div>
        <div className="alert-text">{props.title}</div>
        <div className="alert-close">
          <button type="button" className="close" onClick={props.closeToast}>
            <span aria-hidden="true">
              <i className="ki ki-close"></i>
            </span>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="alert alert-custom alert-light-primary fade show "
        role="alert"
      >
        <div className="alert-text">{props.title}</div>
        <div className="alert-close">
          <button type="button" className="close" onClick={props.closeToast}>
            <span aria-hidden="true">
              <i className="ki ki-close"></i>
            </span>
          </button>
        </div>
      </div>
    );
  }
}
