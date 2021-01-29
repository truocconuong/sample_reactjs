import React, { Component } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import Select from "react-select";
import * as moment from "moment";
import { convertDateLocal } from "../../../utils/common/convertDate";
class DetailInterviewCard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
    };
  }

  render() {
    const { errors } = this.state;
    const data = this.props.data;
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.onHide}
        centered
      >
        <Modal.Header closeButton>
          <div className="card-detail-header">
            <div className="detail-header__title">
              <h4>Interview Detail</h4>
            </div>
          </div>
        </Modal.Header>
        {this.props.show ? (
          <form className="form" onSubmit={this.handleCreateInterview}>
            <div className="card-body">
              <div className="form-group">
                <label>Name:</label>
                <input
                  disabled
                  type="text"
                  value={data.CandidateJob.Candidate.name}
                  className="form-control mb-2 mr-sm-2"
                  placeholder="Enter namejob"
                />
              </div>

              <div className="form-group">
                <label>Name job:</label>
                <input
                  disabled
                  type="text"
                  value={data.CandidateJob.Job.title}
                  className="form-control mb-2 mr-sm-2"
                  placeholder="Enter namejob"
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  disabled
                  type="text"
                  value={data.CandidateJob.Candidate.email}
                  className="form-control mb-2 mr-sm-2"
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  disabled
                  type="text"
                  value={data.CandidateJob.Candidate.phone}
                  className="form-control mb-2 mr-sm-2"
                />
              </div>
              <div className="form-group">
                <label>Link Zoom:</label>
                <input
                  disabled
                  type="text"
                  value={data.linkZoom ? data.linkZoom : ""}
                  className="form-control mb-2 mr-sm-2"
                />
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <label>Location:</label>
                    <input
                      disabled
                      type="text"
                      name="location"
                      value={data.CandidateJob.Job.Location.name}
                      onChange={this.handleInputChange}
                      className={
                        errors.location
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Please enter location"
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Type:</label>
                    <input
                      disabled
                      type="text"
                      name="location"
                      value={data.type}
                      onChange={this.handleInputChange}
                      className={
                        errors.location
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Please enter location"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <label> Time Interview:</label>
                    <input
                      disabled
                      type="text"
                      name="timeInterview"
                      value= {convertDateLocal(data.timeInterview)}
                      onChange={this.handleInputChange}
                      className={
                        errors.timeInterview
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Enter Time Interview"
                    />
                  </div>
                  <div className="col-md-6">
                    <label> Time Interview End:</label>
                    <input
                      disabled
                      type="text"
                      name="timeInterviewEnd"
                      value={convertDateLocal(data.timeInterviewEnd)}
                      onChange={this.handleInputChange}
                      className={
                        errors.timeInterviewEnd
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Enter Time Interview"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-cus__right text-right">
                <button
                  type="reset"
                  className="btn btn-secondary"
                  onClick={this.props.onHide}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}
      </Modal>
    );
  }
}

export default DetailInterviewCard;
