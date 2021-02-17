import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import { rulesCreateNewCard } from "../../utils/rule";
import Validator from "../../utils/validator";
import * as moment from 'moment'
import { domainServer } from "../../utils/config";
import axios from "axios";
import validator from 'validator'
import Network from "../../Service/Network";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast";
import _ from 'lodash'

const api = new Network();
export default class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      position: '',
      clientName: '',
      phone: '',
      email: '',
      location: '',
      approachDate: moment().format("YYYY-MM-DD"),
      linkCv: '',
      nameJob: '',
      idJob: '',
      noteApproach: '',
      laneId: '',
      facebook: '',
      linkedin: '',
      skype: '',
      socialType: {
        facebook: false,
        linkedin: false,
        skype: false
      },
      candidates: [],
      candidatesPhone: [],
      jobSelected: {},
      emailSelected: {},
      laneSelected: {},
      phoneSelected: {},
      errors: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleOnChangeJob = this.handleOnChangeJob.bind(this)
    this.handleOnChangeLane = this.handleOnChangeLane.bind(this)
    this.onChangeUploadHandler = this.onChangeUploadHandler.bind(this);
    this.validator = new Validator(rulesCreateNewCard);
  }

  handleOnChangePhone = (e) => {
    if (e) {
      if (e.phone) {
        this.setState({
          emailSelected: {
            ...e,
            label: e.email
          },
          phoneSelected: {
            ...e
          },
          email: e.email,
          name: e.name,
          phone: e.phone
        })
      }
    }
  }

  handleInputChangePhone = (phone) => {
    if (phone !== '') {
      const response = api.get(`/api/admin/search/phone/candidate?phone=${phone}`)
      response.then((result) => {
        const candidates = _.map(result.data.candidate, candidate => {
          return {
            ...candidate,
            value: candidate.id,
            label: candidate.phone
          }
        });
        this.setState({
          phoneSelected: {
            value: phone,
            label: phone
          },
          phone: phone,
          candidatesPhone: candidates,
        })
      })
    }
  }

  handleOnChangeEmail = (e) => {
    if (e) {
      if (e.email) {
        this.setState({
          phoneSelected: {
            ...e,
            label: e.phone
          },
          emailSelected: {
            ...e,
            label: e.email
          },
          email: e.email,
          name: e.name,
          phone: e.phone
        })
      }
    }
  }

  handleInputChangeEmail = (email) => {
    if (email !== '') {
      email = email.replace(/ /g,'');
      const response = api.get(`/api/admin/candidate/user?email=${email}`)
      response.then((result) => {
        const candidates = _.map(result.data.candidate, candidate => {
          return {
            ...candidate,
            value: candidate.id,
            label: candidate.email
          }
        });
        this.setState({
          emailSelected: {
            value: email,
            label: email
          },
          email: email,
          candidates: candidates,
        })
      })
    }
  }

  defaultState = () => {
    this.setState({
      name: '',
      position: '',
      clientName: '',
      phone: '',
      email: '',
      location: '',
      approachDate: moment().format("YYYY-MM-DD"),
      linkCv: '',
      nameJob: '',
      idJob: '',
      noteApproach: '',
      laneId: '',
      candidates: [],
      candidatesPhone: [],
      jobSelected: {},
      emailSelected: {},
      laneSelected: {},
      phoneSelected: {},
      errors: {},
      facebook: '',
      linkedin: '',
      skype: '',
      socialType: {
        facebook: false,
        linkedin: false,
        skype: false
      },
    })
  }

  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
    if (name === 'email') {
      const checkEmail = validator.isEmail(value);
      if (!checkEmail) {
        const errors = this.state.errors;
        errors[name] = "not valid";
        this.setState({
          errors
        })
      } else {
        this.removeError(name)
      }
    } else if (name === 'phone') {
      const checkPhone = validator.isMobilePhone(value, ['vi-VN'])
      if (!checkPhone) {
        const errors = this.state.errors;
        errors[name] = "not valid";
        this.setState({
          errors
        })
      } else {
        this.removeError(name)
      }

    } else {
      this.removeError(name)
    }

  }

  removeError = (key) => {
    const { errors } = this.state;
    delete errors[key];
    this.setState({
      errors: errors
    })
  }


  handleOnChangeLane(e) {
    this.setState({
      laneSelected: e,
      laneId: e.value
    });
    this.removeError('laneId')
  }

  handleOnChangeJob(e) {
    this.setState({
      clientName: e.clientName,
      location: e.locationName,
      jobSelected: e,
      nameJob: e.value,
      idJob: e.id
    });

    this.removeError('nameJob')

  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  createCard = (e) => {
    e.preventDefault();
    const data = this.state;
    let errors = this.validator.validate(data);
    if (!this.props.isAddCardNoColumn) {
      delete data['laneId']
      delete errors['laneId']
    }
    if (data.email !== '') {
      delete errors['phone'];
      delete errors['social'];
    }

    if (data.phone !== '') {
      delete errors['email'];
      delete errors['social'];
    }

    if (data.facebook !== '' || data.linkedin !== '' || data.skype !== '') {
      delete errors['email'];
      delete errors['phone'];
      delete errors['social'];
    }

    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      delete data['jobSelected'];
      delete data['laneSelected'];
      delete data['errors']
      delete data['candidates']
      delete data['emailSelected']
      delete data['phoneSelected']
      delete data['candidatesPhone']
      delete data['socialType']
      this.props.createCardToLane(data);
      this.defaultState();
    }
  }


  async onChangeUploadHandler(event) {
    const { name, nameJob, idJob } = this.state;
    if (name === '' || nameJob === '') {

      toast(<CustomToast title={"You need to fill in all the information before uploading"} type={"error"} />, {
        position: toast.POSITION.TOP_CENTER,
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
        transition: Zoom,
      });
    } else {
      try {
        let file_size = event.target.files[0].size;
        // console.log(file_size)
        if (file_size > 3145728) {
          toast.error("Image file size too big!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return false;
        }
        var formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("nameFile", `${name} ${nameJob}`)
        formData.append("idJob", `${idJob}`)

        const request_header = api.getHeaderUpload();
        const request_server = api.domain;
        var self = this;
        const config = {
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        };
        config.headers = request_header.headers;
        axios
          .post(request_server + "/api/cards/upload/cv", formData, config)
          .then((res) => {
            if (res) {
              const fileName = `${res.data.fileName}`;
              self.setState({
                linkCv: fileName
              })
            } else {
              toast.error("Something went wrong please try again later!", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
          })
          .catch((err) => {
            toast.error("Something went wrong please try again later!", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          });
      } catch (e) {
        console.log(e);
      }

    }
  }

  toggleCheckBoxSocial = (e) => {
    const name = e.target.name;
    const { socialType } = this.state;
    socialType[name] = !socialType[name];
    this.setState({
      socialType: socialType,
      [name]: '',
    })
  }

  render() {
    const { errors } = this.state;
    const { isAddCardNoColumn, lanes } = this.props;
    return (
      <Modal size="lg" show={this.props.show} onHide={() => {
        this.defaultState();
        this.props.onHide();
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ToastContainer closeOnClick autoClose={1000} rtl={false} />
          <form className="form">
            <div className="card-body card-body-update">
              <div className="form-group">
                <label>Name </label>
                <span style={{ color: "red" }}>*</span>
                <input value={this.state.name} type="text" onChange={this.handleInputChange.bind(this)} name="name" className={
                  errors.name
                    ? "form-control is-invalid"
                    : "form-control"
                }
                  placeholder="Enter name" />
              </div>

              {
                isAddCardNoColumn ? (
                  <div className="form-group">
                    <label>Name column </label>
                    <span style={{ color: "red" }}>*</span>
                    <Select
                      name="option"
                      className={errors.laneId ? 'invalid-selected' : ''}
                      options={lanes}
                      value={this.props.jobSelected}
                      onChange={this.handleOnChangeLane}
                    />
                  </div>
                ) : null
              }


              <div className="form-group">
                <label>Name job </label>
                <span style={{ color: "red" }}>*</span>
                <Select
                  name="option"
                  className={errors.nameJob ? 'invalid-selected' : ''}
                  options={this.props.jobs}
                  value={this.props.jobSelected}
                  onChange={this.handleOnChangeJob}
                />
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>Location </label>
                  <input disabled value={this.state.location} type="text" onChange={this.handleInputChange.bind(this)} name="location" className="form-control" />
                </div>
                <div className="col-lg-6">
                  <label>Client Name </label>
                  <input disabled type="text" value={this.state.clientName} onChange={this.handleInputChange.bind(this)} name="clientName" className="form-control" />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <label>Email </label>
                  <span style={{ color: "red" }}>*</span>
                  <CreatableSelect
                    formatCreateLabel={() => `${this.state.email ? this.state.email : ''}`}
                    name="option"
                    className={errors.email ? 'invalid-selected' : ''}
                    options={this.state.candidates}
                    isClearable
                    onInputChange={this.handleInputChangeEmail}
                    onChange={this.handleOnChangeEmail}
                    value={this.state.emailSelected}
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-12">
                  <div
                    style={{ padding: "4px" }}
                    className={
                      errors.social ? 'social-group invalid-selected' : 'social-group'
                    }
                  >
                    <label>Social </label>
                    <span style={{ color: "red" }}>*</span>
                    <div className="checkbox-inline checkbox-iniline-social">
                      <label className="checkbox checkbox-lg">
                        <input value={this.state.facebook} type="checkbox" onChange={this.toggleCheckBoxSocial} checked={this.state.socialType.facebook} name="facebook" />
                        <span></span>
                            Facebook
                        </label>
                      <label className="checkbox checkbox-lg">
                        <input value={this.state.linkedin} type="checkbox" onChange={this.toggleCheckBoxSocial} checked={this.state.socialType.linkedin} name="linkedin" />
                        <span></span>
                          Linkedin
                        </label>
                      <label className="checkbox checkbox-lg">
                        <input value={this.state.skype} type="checkbox" onChange={this.toggleCheckBoxSocial} checked={this.state.socialType.skype} name="skype" />
                        <span></span>
                            Skype
                        </label>
                    </div>
                  </div>
                  {this.state.socialType.facebook ? (
                    <div className="form-group-social">
                      <div className="input-group">
                        <div className="input-group-prepend"><span className="input-group-text"><i className="la fab fa-facebook-square icon-lg"></i></span></div>
                        <input onChange={this.handleInputChange} name="facebook" type="text" className="form-control" placeholder="Facebook" />
                      </div>
                    </div>
                  ) : ''}
                  {this.state.socialType.linkedin ? (
                    <div className="form-group-social">
                      <div className="input-group">
                        <div className="input-group-prepend"><span className="input-group-text"><i className="la fab fa-linkedin icon-lg"></i></span></div>
                        <input onChange={this.handleInputChange} name="linkedin" type="text" className="form-control" placeholder="Linkedin" />
                      </div>
                    </div>
                  ) : ''}

                  {this.state.socialType.skype ? (
                    <div className="form-group-social">
                      <div className="input-group">
                        <div className="input-group-prepend"><span className="input-group-text"><i className="la fab fa-skype icon-lg"></i></span></div>
                        <input onChange={this.handleInputChange} name="skype" type="text" className="form-control" placeholder="Skype" />
                      </div>
                    </div>
                  ) : ''}
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-6">
                  <label>Phone </label>
                  <span style={{ color: "red" }}>*</span>
                  <CreatableSelect
                    formatCreateLabel={() => `${this.state.phone ? this.state.phone : ''}`}
                    name="option"
                    className={errors.phone ? 'invalid-selected' : ''}
                    options={this.state.candidatesPhone}
                    isClearable
                    onInputChange={this.handleInputChangePhone}
                    onChange={this.handleOnChangePhone}
                    value={this.state.phoneSelected}
                  />


                </div>
                <div className="col-lg-6">
                  <label>Approach Date </label>
                  <input type="date" defaultValue={this.state.approachDate} onChange={this.handleInputChange.bind(this)} name="approachDate" className={
                    errors.approachDate
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                    placeholder="Enter approachDate" />
                </div>
              </div>

              <div className="form-group">
                <label>Position</label>
                <input type="text" onChange={this.handleInputChange.bind(this)} name="position" className={
                  errors.position
                    ? "form-control is-invalid"
                    : "form-control"
                }
                  placeholder="Enter position" />
              </div>
              <div className="form-group">
                <label>Link cv </label>
                <div className="input-group">
                  <input disabled type="text" value={this.state.linkCv} onChange={this.handleInputChange.bind(this)} name="linkCv" className={
                    errors.linkCv
                      ? "form-control is-invalid"
                      : "form-control"
                  } placeholder="Import CV" />
                  <label htmlFor="uploadCV" className="custom-label-upload">
                    <div className="input-group-append custom-div-upload"><span className="input-group-text"><i className="fas fa-upload"></i><input onChange={this.onChangeUploadHandler} id="uploadCV" type="file" className="form-control mb-2 mr-sm-2" style={{ display: 'none' }} placeholder="Jane Doe" /></span></div>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exampleTextarea">Approach Point </label>
                <span style={{ color: "red" }}>*</span>
                <textarea name="noteApproach" onChange={this.handleInputChange} className={
                  errors.noteApproach
                    ? "form-control is-invalid"
                    : "form-control"
                } rows={3} defaultValue={""} />
              </div>
            </div>
            <div className="card-footer add-card">
              <button type="reset" className="btn btn-primary mr-2" onClick={this.createCard}>Save</button>
              <button type="reset" className="btn btn-secondary" onClick={this.props.onHide}>Cancel</button>
            </div>
          </form>
        </Modal.Body>
      </Modal >
    );
  }
}
