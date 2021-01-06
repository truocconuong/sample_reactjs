import React, { Component } from "react";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import moment from "moment";
import Select from "react-select";

import "../style.css";
import { convertDriveToBase64 } from "../../../utils/common/convertDriveToBase64";

export default class DetailCandidateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      isOpen: true,
      className_iframe: "row ifram_close",
      button_show_cv: "View CV",
      nameJob: "",
      clientName: "",
      cv: "",
      location: "",
      arrayJob: [],
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.toggleShowCv = this.toggleShowCv.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
          {this.props.data.jobs[0].cv&&
            (this.props.base64 ? (
              <a
                onClick={() => {
                  // this.props.previewPdf(this.props.data.id)
                  this.props.togglePreviewPdf();
                }}
                className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
              >
                Raw CV
              </a>
            ) : (
              <button
                type="button"
                class="btn btn-primary spinner font-weight-bolder spinner-white spinner-right mr-3"
              >
                Raw CV
              </button>
            ))}
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  renderHeaderCustom(data) {
    return (
      <div className="header_modal_cs">
        <h4 style={{ marginBottom: "0" }}>{data.titleJob}</h4>
      </div>
    );
  }
  toggleShowCv() {
    if (this.state.className_iframe === "row ifram_close") {
      this.setState({
        className_iframe: "row ifram_close ifram_open",
        button_show_cv: "Hide Cv",
      });
    } else {
      this.setState({
        className_iframe: "row ifram_close",
        button_show_cv: "View CV",
      });
    }
  }

  handleOnchange = async (event) => {
    let data = this.state.arrayJob.find((item) => item.label === event.label);
    console.log("====>", data);
    this.setState({
      nameJob: data.label,
      clientName: data.value,
      cv: data.value,
      location: data.location,
    });
  };

  async componentWillReceiveProps() {
    this.setState({
      idCard: this.props.data.id, // id CandidateJob
      nameJob: this.props.data.jobs ? this.props.data.jobs[0].label : "",
      clientName: this.props.data.jobs ? this.props.data.jobs[0].value : "",
      cv: this.props.data.jobs ? this.props.data.jobs[0].cv : "",
      location: this.props.data.jobs ? this.props.data.jobs[0].location : "",
      arrayJob: this.props.data.jobs ? this.props.data.jobs : [],
    });
  }

  componentWillUpdate() {
    if (this.state.idCard) {
      if (this.state.idCard !== this.state.storageIdCard) {
        this.setState({
          storageIdCard: this.state.idCard,
          base64Drive: "",
        });
        if (this.state.cv) {
          new Promise(async (resolve, reject) => {
            const base64 = await convertDriveToBase64(this.state.cv);
            resolve(base64);
          }).then((base64) => {
            this.setState({
              base64Drive: base64,
            });
          });
        }
      }
    }
  }

  render() {
    let self = this;
    const data = this.props.data;
    // console.log(data)
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                titleJob: `${data.name}`,
              }),
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            height={"auto"}
            width={860}
          >
            <div className="wrap_candidate_detail">
              <div className="form-group mt-3">
                <label>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  readOnly
                  className="form-control"
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group kitin-check-select">
                <label>
                  Name job <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  defaultValue={data.jobs[0]}
                  options={data.jobs}
                  onChange={this.handleOnchange}
                  inputProps={{ readOnly: true }}
                />
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>
                    Location <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={this.state.location ? this.state.location : ""}
                    name="location"
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="col-lg-6">
                  <label>Client Name:</label>
                  <input
                    type="text"
                    value={this.state.clientName}
                    readOnly
                    name="clientName"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <label>
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    name="email"
                    readOnly
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>
                    Phone <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={data.phone}
                    name="phone"
                    readOnly
                    required
                    className="form-control"
                    placeholder="Enter phone"
                  />
                </div>
                <div className="col-lg-6">
                  <label>
                    Approach Date <span style={{ color: "red" }}>*</span>
                  </label>
                  <DatetimePickerTrigger showTimePicker={false}>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control custom_date_pickeer-kitin"
                        value={data.date}
                        readOnly
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-calendar icon-lg"></i>
                        </span>
                      </div>
                    </div>
                  </DatetimePickerTrigger>
                </div>
              </div>
              <div className="form-group">
                <label>Link cv</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={this.state.cv ? this.state.cv : ""}
                    name="cv"
                    className="form-control"
                    readOnly
                    placeholder="Enter link or import cv"
                  />
                  {this.state.base64Drive ? (
                    <a
                      href={`data:application/pdf;base64,${this.state.base64Drive}`}
                      download={`${
                        this.state.base64Drive ? data.name : ""
                      }.pdf`}
                      className="input-group-append"
                    >
                      <span className="input-group-text">
                        <i className="fas fa-cloud-download-alt"></i>
                      </span>
                    </a>
                  ) : (
                    <a href="#" className="input-group-append">
                      <span className="input-group-text">
                        <i className="fas fa-cloud-download-alt"></i>
                      </span>
                    </a>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input
                  type="text"
                  name="position"
                  value={data.position}
                  readOnly
                  className="form-control"
                  placeholder="Enter position"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleTextarea">Note Approach</label>
                <textarea
                  name="noteApproach"
                  value={data.noteApproach}
                  readOnly
                  className="form-control form-control-solid"
                  rows={3}
                />
              </div>
            </div>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}
