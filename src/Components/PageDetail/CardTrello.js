import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import Network from "../../Service/Network";
import { Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import { DatetimePickerTrigger } from "../libs/rc-datetime-picker";
import Select from "react-select";
import { Link } from "react-router-dom";
import { convertDriveToBase64 } from "../../utils/common/convertDriveToBase64";

const api = new Network();

export default class CardTrello extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idCard: "",
      name: "",
      idJob: "",
      nameJob: "",
      location: "",
      nameClient: "",
      email: "",
      phone: "",
      approachDate: "",
      cv: "",
      position: "",
      noteApproach: "",
      base64: "",
      validated: false,
      isLoading: false,
      id: null, // id của CandidateJob
      arrayLane: [],
      isLoading: false,
      laneSelect: {
        label: "",
        value: "",
      },
    };
    this.formCard = React.createRef();
  }

  handleChangeData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  componentWillReceiveProps() {
    let dataLane = {
      value: this.props.data.Lane ? this.props.data.Lane.id : "",
      label: this.props.data.Lane ? this.props.data.Lane.nameColumn : "",
    };
    this.setState({
      idCard: this.props.data.id, // id CandidateJob
      name: this.props.data.Candidate ? this.props.data.Candidate.name : "",
      idJob: this.props.data.jobId,
      nameJob: this.props.data.Job ? this.props.data.Job.title : "",
      location: this.props.data.Job ? this.props.data.Job.Location.name : "",
      nameClient: this.props.data.Job ? this.props.data.Job.Client.name : "",
      email: this.props.data.Candidate ? this.props.data.Candidate.email : "",
      phone: this.props.data.Candidate ? this.props.data.Candidate.phone : "",
      approachDate: moment(this.props.data.approachDate).format("YYYY/MM/DD"),
      cv: this.props.data.cv,
      position: this.props.data.position,
      noteApproach: this.props.data.noteApproach,
      arrayLane: this.props.lane,
      laneSelect: dataLane,
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

  handleOnchange = async (event) => {
    let obj = {
      label: event.label,
      value: event.value,
    };
    this.setState({
      laneSelect: obj,
    });
  };

  handleSubmit = async (event) => {
    this.setState({
      isLoading: true,
    });
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      this.setState({ validated: true, isLoading: false });
      return;
    }
    try {
      const data = {
        laneId: this.state.laneSelect.value,
        cv: this.state.cv,
        position: this.state.position,
        noteApproach: this.state.noteApproach,
      };
      const response = await api.patch(`/api/cards/${this.state.idCard}`, data);
      if (response) {
        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
          this.props.onHide();
          this.props.resetCandidateAddCard();
          toast(<CustomToast title={"Change lane of card success!"} />, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            className: "toast_login",
            closeButton: false,
            hideProgressBar: true,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
          });
        }, 800);
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log(err);
      toast(
        <CustomToast
          title={"Something went wrong please try again later!"}
          type="error"
        />,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          className: "toast_login",
          closeButton: false,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
        }
      );
    }
  };

  render() {
    const { validated, arrayLane } = this.state;
    const optLane = arrayLane.map((lane) => {
      return { label: lane.nameColumn, value: lane.id };
    });

    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.onHide}
        centered
      >
        <ToastContainer />
        <Modal.Header className="header-candidate-job">
          <Modal.Title>{`${this.state.name} - ${this.state.nameJob}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
            <div className="card-body card-body-update" ref={this.formCard}>
              <div className="form-group">
                <label>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChangeData}
                  required
                  disabled
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
                  value={this.state.nameJob}
                  name="nameJob"
                  onChange={this.handleChangeData}
                  required
                  disabled
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
                    value={this.state.location}
                    name="location"
                    disabled
                    onChange={this.handleChangeData}
                    required
                    className="form-control"
                  />
                </div>
                <div className="col-lg-6">
                  <label>Client Name:</label>
                  <input
                    type="text"
                    value={this.state.nameClient}
                    onChange={this.handleChangeData}
                    name="clientName"
                    disabled
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>
                    Lane <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    options={optLane}
                    value={this.state.laneSelect}
                    onChange={this.handleOnchange}
                  />
                </div>
                <div className="col-lg-6">
                  <label>
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={this.state.email}
                    name="email"
                    onChange={this.handleChangeData}
                    required
                    disabled
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
                    value={this.state.phone}
                    name="phone"
                    onChange={this.handleChangeData}
                    required
                    disabled
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
                        value={moment(this.state.approachDate).format(
                          "DD/MM/YYYY"
                        )}
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
                <label>Cv</label>
                <div className="input-group">
                  <input
                    disabled
                    type="text"
                    value={this.state.cv ? this.state.cv : ""}
                    name="cv"
                    className="form-control"
                    onChange={this.handleChangeData}
                    placeholder="Import CV"
                  />
                  {this.state.base64Drive ? (
                    <a
                      href={`data:application/pdf;base64,${this.state.base64Drive}`}
                      download={`${this.state.base64Drive ? this.state.name : ""
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
                  value={this.state.position ? this.state.position : ""}
                  onChange={this.handleChangeData}
                  className="form-control"
                  placeholder="Enter position"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleTextarea">Note Approach</label>
                <textarea
                  type="text"
                  name="noteApproach"
                  value={this.state.noteApproach ? this.state.noteApproach : ""}
                  onChange={this.handleChangeData}
                  className="form-control"
                  rows={3}
                />
              </div>
            </div>
            <div className="card-footer add-card ">
            {this.props.data.cv ? (
                this.props.base64 ? (
                  <Link
                    to={`/preview/candidate/${this.props.data.candidateId}/job/${this.props.data.jobId}`}
                    className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                  >
                    Refined CV
                  </Link>
                ) : (
                    <button 
                      disabled
                      type="button"
                      class="btn btn-primary style-btn-kitin font-weight-bolder mr-3"
                    >
                      Refined CV
                    </button>
                  )
              ) : ""}
              {this.props.data.cv &&
                (this.props.base64 ? (
                  <a
                    onClick={() => {
                      // this.props.previewPdf(this.props.data.id)
                      this.props.openPreviewPdfAndCloseCardTrello();
                    }}
                    className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                  >
                    Raw CV
                  </a>
                ) : (
                    <button
                      disabled
                      type="button"
                      class="btn btn-primary style-btn-kitin font-weight-bolder  mr-3"
                    >
                      Raw CV
                    </button>
                  ))}
              <button
                type="submit"
                className={
                  this.state.isLoading
                    ? "btn btn-primary font-weight-bolder style-btn-kitin spinner spinner-white spinner-right"
                    : "btn btn-primary font-weight-bolder style-btn-kitin "
                }
              >
                Save
              </button>
              <button
                type="reset"
                className="btn btn-secondary"
                onClick={this.props.onHide}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
