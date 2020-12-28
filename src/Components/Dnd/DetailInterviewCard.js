import React, { Component } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import { rulesCreateCardInterview } from "../../utils/rule";
import Validator from "../../utils/validator";
import Select from "react-select";
import * as moment from "moment";
class DetailInterviewCard extends Component {
  constructor() {
    super();
    this.state = {
      scrollBehaviour: "inside",
      timeInterview: "",
      timeInterviewEnd: "",
      typeSelected: {
        key: "",
        value: "",
      },
      type: "",
      errors: {},
    };

    this.types = [
      {
        value: "offline",
        label: "Offline",
      },
      {
        value: "online",
        label: "Online",
      },
    ];
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreateInterview = this.handleCreateInterview.bind(this);
    this.removeError = this.removeError.bind(this);
    this.handleOnChangeType = this.handleOnChangeType.bind(this);
    this.validator = new Validator(rulesCreateCardInterview);
  }

  handleOnChangeType(e) {
    this.setState({
      typeSelected: e,
      type: e.value,
    });
    this.removeError("type");
  }

  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    this.setState({
      [name]: value,
    });
    this.removeError(name);
  }

  defaultState = () => {
    this.setState({
      scrollBehaviour: "inside",
      timeInterview: "",
      timeInterviewEnd: "",
      typeSelected: {
        key: "",
        value: "",
      },
      type: "",
      errors: {},
    });
  };

  removeError = (key) => {
    const { errors } = this.state;
    delete errors[key];
    this.setState({
      errors: errors,
    });
  };

  componentDidMount() {
    this.defaultState();
  }

  handleCreateInterview(e) {
    e.preventDefault();

    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      const content = this.props.data.content;
      const data = {
        cardId: this.props.data.id,
        jobName: content.nameJob,
        location: content.location,
        timeInterview: this.state.timeInterview,
        timeInterviewEnd: `${this.state.timeInterview.substring(0, 11)}${
          this.state.timeInterviewEnd
        }`,
        type: this.state.type,
      };
      this.props.createInterview(data);
      this.defaultState();
    }
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  render() {
    const { errors } = this.state;
    const card = this.props.data.content;
    const interview = card.interview;
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
                  value={card.name}
                  className="form-control mb-2 mr-sm-2"
                  placeholder="Enter namejob"
                />
              </div>

              <div className="form-group">
                <label>Name job:</label>
                <input
                  disabled
                  type="text"
                  value={card.nameJob}
                  className="form-control mb-2 mr-sm-2"
                  placeholder="Enter namejob"
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  disabled
                  type="text"
                  value={card.email}
                  className="form-control mb-2 mr-sm-2"
                />
              </div>

              <div className="form-group">
                <label>Phone:</label>
                <input
                  disabled
                  type="text"
                  value={card.phone}
                  className="form-control mb-2 mr-sm-2"
                />
              </div>
              <div className="form-group">
                <label>Link Zoom:</label>
                <input
                  disabled
                  type="text"
                  value={interview.linkZoom ? interview.linkZoom : ""}
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
                      value={card.location}
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
                      value={interview.type}
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
                      value={moment(interview.timeInterview).format(
                        "DD/MM/YYYY HH:mm"
                      )}
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
                      value={moment(interview.timeInterviewEnd).format(
                        "DD/MM/YYYY HH:mm"
                      )}
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
