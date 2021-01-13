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
import Popover from "react-popover";
import { defaultAva, domainServer } from "../../utils/config";
const api = new Network();

export default class CandidateCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      validated: false,
      isLoading: false,
      id: null, // id của CandidateJob
      arrayLane: [],
      idLane: "",
      isOpenAddMember: false,
      users: [],
      listAssign: [],
    };
    this.formCard = React.createRef();
    this.toggleAddMember = this.toggleAddMember.bind(this);
    this.renderBodyAddMember = this.renderBodyAddMember.bind(this);
    this.assignMember = this.assignMember.bind(this);
    this.removeUserCard = this.removeUserCard.bind(this);
  }
  removeUserCard(member){
    this.setState((state) => ({
      users: [...state.users, member],
      listAssign: [...state.listAssign.filter(user => user.userId != member.userId)], // them lai vao list user
    }));
  }
  assignMember(member) {
    this.setState((state) => ({
      listAssign: [...state.listAssign, member],
      users: [...state.users.filter(user => user.userId != member.userId)], //xoa user khoi list sau khi add
    }));
  }
  toggleAddMember(isShow) {
    this.setState({
      isOpenAddMember: isShow,
    });
  }
  handleChangeData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  componentWillReceiveProps(props) {
    this.setState({
      id: this.props.data.idCandidateJob,
      name: this.props.data.name,
      idJob: this.props.data.jobId,
      nameJob: this.props.data.nameJob,
      location: this.props.data.location,
      nameClient: this.props.data.nameClient,
      email: this.props.data.email,
      phone: this.props.data.phone,
      approachDate: moment(this.props.data.approachDate).format("YYYY/MM/DD"),
      cv: this.props.data.cv,
      arrayLane: this.props.lane,
      idLane: this.props.lane.length > 0 ? this.props.lane[0].id : "",
      users: [...props.users]
    });
  }

  handleSubmit = async (event) => {
    this.setState({
      isLoading: true,
    });
    const form = event.currentTarget;
    let currentTargetRect = event.target.getBoundingClientRect();
    const event_offsetY = -currentTargetRect.top;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      this.formCard.current.scrollIntoView({
        left: 0,
        top: 200,
        behavior: "smooth",
      });
      this.formCard.current.scrollIntoView({ behavior: "smooth" });
      this.setState({ validated: true, isLoading: false });
      return;
    }
    try {
      const data = {
        approachDate: moment(this.state.approachDate).format("YYYY-MM-DD"),
        cv: this.state.cv,
        position: this.state.position,
        noteApproach: this.state.noteApproach,
        laneId: this.state.idLane,
        isAddCard: true,
        from: "detail_job",
        listAssign: this.state.listAssign
      };
      console.log(this.state.listAssign)
      // return;
      const response = await api.patch(`/api/cards/${this.state.id}`, data);
      if (response) {
        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
          this.props.onHide();
          this.props.resetCandidateAddCard();
          toast(<CustomToast title={"Add card success!"} />, {
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

  handleOnchange = async (event) => {
    this.setState({
      idLane: event.value,
    });
  };

  componentWillUpdate() {
    if (this.state.id) {
      if (this.state.id !== this.state.storageIdCard) {
        this.setState({
          storageIdCard: this.state.id,
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
 
  renderBodyAddMember() {
    return (
      <div className="">
        {/*begin::Card*/}
        <div className="card card-custom card-stretch card_add_mem">
          <div className="card-header">
            <div className="card-title">
              <h4 className="card-label">Assign member</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="wrap_member_add_card">
              {this.state.users.map((e, index) => {
                return (
                  <div
                    onClick={this.assignMember.bind(this, e)}
                    className="row_add_mem_card"
                    key={index}
                  >
                    <div className="ava_add_mem_card">
                      <img
                        style={{ width: "100%" }}
                        src={
                          e.linkAvatar
                            ? `${domainServer + "/" + e.linkAvatar}`
                            : `${defaultAva}`
                        }
                      />
                    </div>
                    <div className="name_member_add">{e.name} </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/*end::Card*/}
      </div>
    );
  }
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
        <Modal.Header>
          <Modal.Title>{`${this.props.data.name} - ${this.props.data.nameJob}`}</Modal.Title>
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
                    onChange={this.handleChangeData}
                    required
                    disabled
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
                  <label>Lane</label>
                  <Select
                    defaultValue={optLane[0]}
                    options={optLane}
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
                    disabled
                    onChange={this.handleChangeData}
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
                <label>Link cv</label>
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
                  value={this.state.position}
                  onChange={this.handleChangeData}
                  className="form-control"
                  placeholder="Enter position"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleTextarea">Note Approach</label>
                <textarea
                  name="noteApproach"
                  value={this.state.noteApproach}
                  onChange={this.handleChangeData}
                  className="form-control"
                  rows={3}
                />
              </div>
            </div>
            <div className="card-footer add-card add-card-nam pl-0 pr-0">
              <div>
                <Popover
                  isOpen={this.state.isOpenAddMember}
                  body={this.renderBodyAddMember()}
                  onOuterAction={this.toggleAddMember.bind(this, false)}
                  className="pop_cs_nam"
                  preferPlace={"above"}
                  place={"above"}
                >
                  <div
                    onClick={this.toggleAddMember.bind(this, true)}
                    className={
                      this.props.role !== "Director"
                        ? "btn btn-md btn-icon btn-light-facebook btn-pill mr-1"
                        : "btn btn-md btn-icon btn-light-facebook btn-pill off-button-add-user mr-1"
                    }
                  >
                    <i className="fas fa-plus"></i>
                  </div>
                </Popover>
                {this.state.listAssign.map((e, index) => {
                  return (
                    <div title={e.name} key={index} className="btn btn-md btn-icon btn-light-facebook btn-pill mx-1 cs_btn_fb" style={{position: 'relative'}}>
                      <div onClick={this.removeUserCard.bind(this, e)} className="wrap_icon_x"><i className="ki ki-close"></i></div>
                      <img
                        style={{ height: "100%", borderRadius: "50%" }}
                        width="100%"
                        alt="Pic"
                        src={
                          e.linkAvatar
                            ? `${domainServer + "/" + e.linkAvatar}`
                            : `${defaultAva}`
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div>
                {this.props.data.cv ? (
                  <Link
                    to={`/preview/candidate/${this.props.data.candidateId}/job/${this.props.data.jobId}`}
                    className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                  >
                    Refined CV
                  </Link>
                ) : (
                  ""
                )}

                {this.props.data.cv &&
                  (this.props.base64 && !this.props.isLoadingPdf? (
                    <a
                      onClick={() => {
                        // this.props.previewPdf(this.props.data.id)
                        this.props.openPreviewPdfAndCloseCandidateCard();
                      }}
                      className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                    >
                      Raw CV
                    </a>
                  ) : (
                    <button
                      onClick={()=>{
                        window.open(this.props.data.cv,'_blank')
                      }}
                      type="button"
                      className={this.props.isLoadingPdf ? `btn btn-primary spinner font-weight-bolder spinner-white spinner-right mr-3` : `btn btn-primary font-weight-bolder mr-3`}
                    >
                      Raw CV
                    </button>
                  ))}
                {this.props.role !== "Director" ? (
                  <button
                    type="submit"
                    className={
                      this.state.isLoading
                        ? "btn btn-primary font-weight-bolder style-btn-kitin spinner spinner-white spinner-right mr-3"
                        : "btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                    }
                  >
                    Save
                  </button>
                ) : null}
                <button
                  type="reset"
                  className="btn btn-secondary"
                  onClick={this.props.onHide}
                  // style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
