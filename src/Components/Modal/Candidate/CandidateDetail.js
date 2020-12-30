import React, { Component } from "react";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import moment from "moment";
import { convertDriveToBase64 } from "../../../utils/common/convertDriveToBase64";

import "../style.css";

export default class CandidateDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      isOpen: true,
      className_iframe: "row ifram_close",
      button_show_cv: "View CV",
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.toggleShowCv = this.toggleShowCv.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
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
  async componentWillReceiveProps() {
    if (this.props.data.cv) {
      const base64 = await convertDriveToBase64(this.props.data.cv);
      this.setState({
        base64Drive: base64,
      });
    }
  }
  render() {
    let self = this;
    const data = this.props.data;
    const candidate = this.props.data.Candidate;
    // console.log(data);
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                titleJob: `${candidate.name} `,
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
                  value={candidate.name}
                  readOnly
                  className="form-control"
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>
                  Name job <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={data.Job.title}
                  name="nameJob"
                  readOnly
                  className="form-control"
                  placeholder="Enter name job"
                />
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>
                    Location <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={data.Job.Location.name}
                    name="location"
                    readOnly
                    className="form-control"
                  />
                </div>
                <div className="col-lg-6">
                  <label>Client Name:</label>
                  <input
                    type="text"
                    value={data.Job.Client.name}
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
                    value={candidate.email}
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
                    value={candidate.phone}
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
                  <DatetimePickerTrigger
                    moment={moment(this.state.approachDate)}
                    showTimePicker={false}
                  >
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control custom_date_pickeer-kitin"
                        value={
                          data.approachDate
                            ? moment(data.approachDate).format("DD/MM/YYYY")
                            : moment(data.createdAt).format("DD/MM/YYYY")
                        }
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
                    value={data.cv ? data.cv : ""}
                    name="linkCv"
                    className="form-control"
                    readOnly
                    placeholder="Enter link or import cv"
                  />
                  <a
                    href={`data:application/pdf;base64,${this.state.base64Drive}`}
                    download={`${this.state.base64Drive ? candidate.name : ""}.pdf`}
                    className="input-group-append"
                  >
                    <span className="input-group-text">
                      <i className="fas fa-cloud-download-alt"></i>
                    </span>
                  </a>
                </div>
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input
                  type="text"
                  name="position"
                  value={data.position ? data.position : ""}
                  readOnly
                  className="form-control"
                  placeholder="Enter position"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleTextarea">Note Approach</label>
                <textarea
                  name="noteApproach"
                  value={data.noteApproach ? data.noteApproach : ""}
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
