import React, { Component, useRef } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import Select from "react-select";
import Popover from "react-bootstrap/Popover";
import ModalAddMember from "./ModalAddMember";
import { connect } from "react-redux";
import { defaultAva, domainServer } from "../../utils/config";
import {
  Button as ButtonPop,
  Popover as PopoverPop,
  PopoverHeader,
  PopoverBody,
  UncontrolledCollapse,
  CardBody,
  Card,
} from "reactstrap";
import _ from "lodash";
import roleName from "../../utils/const";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import toastr from "toastr";
import Network from "../../Service/Network";
import * as moment from "moment";
import Validator from "../../utils/validator";
import { rulesCreateNewCard } from "../../utils/rule";
import { Link } from "react-router-dom";
import { convertDateLocal } from "../../utils/common/convertDate";
import { DatetimePickerTrigger } from "../libs/rc-datetime-picker";

const api = new Network();
class DetailCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      target: null,
      isOpenDeleteUserPop: new Array(10).fill(false),
      jobSelected: {},
      showPopupAddMember: false,
      updated: true,
      showAddMember: false,
      errors: {},
      history: [],
      name: "",
      position: "",
      clientName: "",
      phone: "",
      email: "",
      location: "",
      approachDate: "",
      cv: "",
      refineCv: "",
      nameJob: "",
      noteApproach: "",
      noteRecruiter: "",
      idJob: "",
      laneId: "",
      content: "",
      contentEdit: "",
      facebook: "",
      linkedin: "",
      skype: "",
      expectedDate: "",
      dueDate: "",
      socialType: {
        facebook: true,
        linkedin: true,
        skype: true,
      },
      openFormEditComment: false,
      openFormInputComment: false,
      comments: [],
      laneSelected: {},
    };
    this.addMember = [];
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleDeleteUserPop = this.toggleDeleteUserPop.bind(this);
    this.onChangeUploadHandler = this.onChangeUploadHandler.bind(this);
    this.validator = new Validator(rulesCreateNewCard);
    this.showHistoryCard = this.showHistoryCard.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.renderRowActivity = this.renderRowActivity.bind(this);
    this.removeUserCard = this.removeUserCard.bind(this);
  }
  toggleFormEditContent = (comment) => {
    this.setState({
      [`contentEdit${comment.id}`]: comment.content,
    });
  };

  setDefaultCommentBox = () => {
    this.setState({
      openFormInputComment: false,
    });
  };
  openFormInputComment = () => {
    this.setState({
      openFormInputComment: true,
    });
  };
  handleOnChangeLane = (e) => {
    this.setState({
      laneSelected: e,
      laneId: e.value,
    });
  };

  async showHistoryCard() {
    try {
      if (this.state.isShowHistory) {
        this.setState({
          isShowHistory: false,
        });
      } else {
        let self = this;
        const data = {
          cardId: self.props.data_detail.id,
        };
        const response = await api.post(`/api/history/card`, data);
        if (response) {
          this.setState({
            history: response.data.historyCard,
            isShowHistory: true,
          });

          // console.log(response.data.historyCard);
        }
      }
    } catch (error) {
      console.log("err while fetch data history card: ", error);
    }
  }

  toggleShowPopupAddMember = () => {
    this.setState({
      showPopupAddMember: !this.state.showPopupAddMember,
    });
  };

  toggleDeleteUserPop(index) {
    let self = this;
    const isShow = this.state.isOpenDeleteUserPop[index];
    let currentIsOpenDeleteUserPop = new Array(10).fill(false);
    this.setState(
      {
        isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
      },
      function () {
        currentIsOpenDeleteUserPop[index] = !isShow;
        self.setState({
          isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
        });
      }
    );
  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };
  setTarget = (target) => {
    this.setState({
      target: target,
    });
  };

  handleClick = (event) => {
    this.toggleShow();
    this.setTarget(event.target);
  };

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
    // this.props.update(e);
  }

  removeUserCard = async (card_id, user_id, index) => {
    await this.props.removeMemberToCard(card_id, user_id);
    await this.toggleDeleteUserPop(index);

  };

  addMemberToCard = (card_id, user) => {
    const data = {
      card_id,
      content: {
        id: user.value,
        email: user.label,
        name: user.name,
        linkAvatar: user.linkAvatar,
      },
    };
    this.props.addMemberToCard(data);
  };

  handleOnChangeJobSelected = (e) => {
    this.setState({
      jobSelected: e,
      idJob: e.id,
    });
    // this.props.handleOnChangeJobSelected(e);
  };

  toggleAddMember = () => {
    this.setState({
      showAddMember: !this.state.showAddMember,
    });
  };
  checkUserIsSelected = (users, user_id) => {
    let isSelected = false;
    isSelected = _.some(users, { id: user_id });
    return isSelected;
  };
  colorRandomSelected = () => {
    const colors = [
      "label-custom-name label label-xl label-inline label-light-dark",
      "label-custom-name label label-xl label-inline label-light-dark",
      "label-custom-name label label-xl label-inline label-light-success",
      "label-custom-name label label-xl label-inline label-light-danger",
      "label-custom-name label label-xl label-inline label-light-success",
    ];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  };

  toggleMember = (selected, index, card_id, user) => {
    if (selected) {
      // remove member
      this.props.removeMemberToCard(card_id, user.value);
    } else {
      this.addMemberToCard(card_id, user);
      // add member
    }
    this.toggleAddMember();
  };

  async onChangeUploadHandler(event, nameLink) {
    const card = this.props.data_detail.content;
    if (card.name === "" || card.nameJob === "") {
      toastr.error(
        "You need to fill in all the information before uploading cv !"
      );
    } else {
      try {
        let file_size = event.target.files[0].size;
        // console.log(file_size)
        if (file_size > 5145728) {
          toast.error("Image file size too big!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return false;
        }
        let nameFile = `${card.name} ${card.nameJob}`;
        if (nameLink === 'refineCv') {
          const getIndex = event.target.files[0].name.indexOf('.')
          nameFile = event.target.files[0].name.slice(0, getIndex);
        }
        var formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("nameFile", nameFile);
        formData.append("idJob", `${card.idJob}`);

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
              this.updatePropsLinkCv(fileName, nameLink);
            } else {
              toast.error("Something went wrong please try again later!", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong please try again later!", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  updatePropsLinkCv = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  updateCard = () => {
    const data = this.state;
    const errors = this.validator.validate(data);
    delete errors["laneId"];
    this.setState({
      errors: errors,
      isShowHistory: false,
      history: [],
    });

    if (data.email !== "") {
      delete errors["phone"];
      delete errors["social"];
    }

    if (data.phone !== "") {
      delete errors["email"];
      delete errors["social"];
    }

    if (data.facebook !== "" || data.linkedin !== "" || data.skype !== "") {
      delete errors["email"];
      delete errors["phone"];
      delete errors["social"];
    }

    if (this.isEmpty(errors)) {
      const content = this.state;
      const data = {
        name: content.name,
        position: content.position,
        clientName: content.clientName,
        phone: content.phone,
        email: content.email,
        location: content.location,
        approachDate: content.approachDate,
        expectedDate: content.expectedDate,
        dueDate: content.dueDate,
        cv: content.linkCv,
        refineCv: content.refineCv,
        nameJob: content.nameJob,
        noteRecruiter: content.noteRecruiter,
        noteApproach: content.noteApproach,
        idJob: content.idJob,
        laneId: content.laneId,
        facebook: content.facebook,
        linkedin: content.linkedin,
        skype: content.skype,
      };
      this.props.updateCard(data);
    }
  };
  hideModal() {
    this.props.onHide();
    this.setState({
      isShowHistory: false,
      history: [],
    });
  }

  componentWillReceiveProps = (props) => {
    // console.log(props.data.content)
    this.setDefaultCommentBox();
    const content = props.data_detail.content;
    const cardIdOld = this.state.cardId;
    content.cardId = props.data_detail.id;
    this.setState(content, () => {
      if (cardIdOld !== content.cardId) {
        this.getAllCommentOfCard(content.cardId);
      }
    });
  };

  getAllCommentOfCard = async (cardId) => {
    const response = await api.get(`/api/v1/comment/${cardId}/card`);
    if (response) {
      const comments = response.data.list;
      this.setState({
        comments: comments,
      });
    }
  };

  renderRowActivity(e, index) {
    // console.log(e.content)
    if (e.type == "update_card") {
      let content = JSON.parse(e.content);
      return (
        <div className="row_history" key={index}>
          <div className="symbol symbol-50 symbol-light ">
            <span className="symbol-label symbol-label-cs cs_ava_history">
              <img
                src={
                  e.User.linkAvatar
                    ? domainServer + "/" + e.User.linkAvatar
                    : defaultAva
                }
                className="h-100 align-self-end"
                alt=""
              />
            </span>
          </div>
          <div className="wrap_left_content_history">
            <div className="conten_history">
              <span className="name_history">{e.User.name}</span>
              {` has update this card:`}
            </div>
            <ul>
              {content.map((e, i) => {
                return (
                  <li className="cs_update_history" key={i}>
                    <span className="key_history">{`${e.path}: `}</span>
                    {e.lhs} <span className="change_to">change to</span> {e.rhs}
                    {/* {`${e.lhs} => ${e.rhs}`} */}
                  </li>
                );
              })}
            </ul>
            <div className="time_history">
              {moment(e.createdAt).format("hh:mma DD/MM/YYYY")}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row_history" key={index}>
          <div className="symbol symbol-50 symbol-light ">
            <span className="symbol-label symbol-label-cs cs_ava_history">
              <img
                src={
                  e.User.linkAvatar
                    ? domainServer + "/" + e.User.linkAvatar
                    : defaultAva
                }
                className="h-100 align-self-end"
                alt=""
              />
            </span>
          </div>
          <div className="wrap_left_content_history">
            <div className="conten_history">
              <span className="name_history"> {e.User.name} </span>
              {`${e.content}`}
            </div>
            <div className="time_history">
              {moment(e.createdAt).format("hh:mma DD/MM/YYYY")}
            </div>
          </div>
        </div>
      );
    }
  }

  createComment = async () => {
    const cardId = this.props.data_detail.id;
    const { comments } = this.state;
    const data = {
      content: this.state.content,
    };
    const response = await api.post(`/api/v1/comment/${cardId}/card`, data);
    if (response) {
      const comment = response.data.comment;
      comments.unshift(comment);
      this.setState({
        comments,
        openFormInputComment: false,
        content: "",
      });
    }
  };

  removeComment = async (id) => {
    const { comments } = this.state;
    const response = await api.delete(`/api/v1/comment/${id}`);
    if (response) {
      this.setState({
        comments: _.filter(comments, (comment) => comment.id !== id),
      });
    }
  };

  handleInputChangeEditContent = (e, comment) => {
    const value = e.target.value;
    this.setState({
      [`contentEdit${comment.id}`]: value,
    });
  };
  editComment = async (comment) => {
    const content = this.state[`contentEdit${comment.id}`];
    const { comments } = this.state;
    const item = {
      content: content,
    };
    const response = await api.patch(`/api/v1/comment/${comment.id}`, item);
    if (response) {
      for (const commentState of comments) {
        if (commentState.id === comment.id) {
          commentState.content = content;
        }
      }
      this.setState({
        comments: comments,
      });
    }
  };

  handleChangeDatePicker(_moment, fields) {
    this.setState({
      [fields]: moment(_moment),
    });
  }

  render() {
    const errors = this.state.errors;
    const users = [];
    let usersTeam = [];
    const data_detail = this.state;
    if (this.props.show) {
      users.push(...this.props.data.content.user);
    }
    if (!_.isEmpty(this.props.users)) {
      usersTeam.push(...this.props.users);
    }
    data_detail.approachDate = moment(data_detail.approachDate).format(
      "YYYY-MM-DD"
    );

    if (data_detail.dueDate) {
      data_detail.dueDate = moment(data_detail.dueDate).format(
        "YYYY-MM-DD"
      );

      console.log(data_detail.expectedDate)
    }

    return (
      <Modal size="lg" show={this.props.show} onHide={this.hideModal} centered>
        <Modal.Header closeButton>
          <div></div>
          <div className="card-detail-header">
            <div className="detail-header__title">
              <h4>Update card</h4>
            </div>
            <div className="detail_header__sticky">
              {this.props.role !== roleName.DIRECTOR ? (
                <div
                  className="dropdown dropdown-inline"
                  data-toggle="tooltip"
                  title="Quick actions"
                  data-placement="left"
                >
                  {" "}
                  <a
                    id={`Proveti${this.props.data.id}`}
                    className="btn btn-clean btn-hover-light-primary btn-sm btn-icon"
                  >
                    <i className="ki ki-bold-more-hor" />
                  </a>
                  <PopoverPop
                    popperClassName="popover-modal-card"
                    trigger="legacy"
                    placement="right"
                    isOpen={this.state.showAddMember}
                    target={`Proveti${this.props.data.id}`}
                    toggle={this.toggleAddMember}
                  >
                    <PopoverBody>
                      <ul className="navi navi-hover navi-selected-ul">
                        <li className="navi-header font-weight-bold py-4">
                          <span className="font-size-lg">
                            Toggle member to card:
                          </span>
                          <i
                            className="flaticon2-information icon-md text-muted"
                            data-toggle="tooltip"
                            data-placement="right"
                            title="Click to learn more..."
                          />
                        </li>
                        <li className="navi-separator mb-3 opacity-70" />

                        {usersTeam.map((user, index) => {
                          return (
                            <li
                              key={index}
                              className="navi-item"
                              onClick={() =>
                                this.toggleMember(
                                  this.checkUserIsSelected(users, user.value),
                                  index,
                                  this.props.data.id,
                                  user
                                )
                              }
                            >
                              <a className="navi-link navi-link-cus">
                                <span className="navi-text">
                                  <span className={this.colorRandomSelected()}>
                                    {user.name}
                                  </span>
                                </span>
                                <label className="checkbox">
                                  <input
                                    type="checkbox"
                                    readOnly
                                    checked={this.checkUserIsSelected(
                                      users,
                                      user.value
                                    )}
                                    name="Checkboxes1"
                                  />
                                  <span></span>
                                </label>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </PopoverBody>
                  </PopoverPop>{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="card-detail">
            <form className="form">
              <div className="card-body card-body-update">
                <div className="form-group">
                  <label>Name </label>
                  <span style={{ color: "red" }}>*</span>
                  <input
                    type="text"
                    value={data_detail.name}
                    disabled={
                      this.props.role === roleName.DIRECTOR ? true : false
                    }
                    onChange={this.handleInputChange.bind(this)}
                    name="name"
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>

                <div className="form-group">
                  <label>Name job </label>
                  <span style={{ color: "red" }}>*</span>
                  <Select
                    isDisabled={
                      this.props.role === roleName.DIRECTOR ? true : false
                    }
                    name="option"
                    options={this.props.jobs}
                    value={data_detail.jobSelected}
                    onChange={this.handleOnChangeJobSelected}
                  />
                </div>
                {
                  <div className="form-group">
                    <label>Column</label>
                    <span style={{ color: "red" }}>*</span>
                    <Select
                      isDisabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      name="option"
                      options={this.props.lanes}
                      value={data_detail.laneSelected}
                      onChange={this.handleOnChangeLane}
                    />
                  </div>
                }
                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Location</label>
                    <input
                      disabled
                      value={data_detail.location}
                      type="text"
                      onChange={this.handleInputChange.bind(this)}
                      name="location"
                      className="form-control"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Client Name</label>
                    <input
                      disabled
                      value={data_detail.clientName}
                      type="text"
                      onChange={this.handleInputChange.bind(this)}
                      name="clientName"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-12">
                    <label>Email </label>
                    <span style={{ color: "red" }}>*</span>
                    <input
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.email}
                      type="email"
                      onChange={this.handleInputChange.bind(this)}
                      name="email"
                      className={
                        errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-12">
                    <div
                      style={{ padding: "4px" }}
                      className={
                        errors.social
                          ? "social-group invalid-selected"
                          : "social-group"
                      }
                    >
                      <label>Social </label>
                      <span style={{ color: "red" }}>*</span>
                      {/* <div className="checkbox-inline checkbox-iniline-social">
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
                    </div> */}
                    </div>
                    {this.state.socialType.facebook ? (
                      <div className="form-group-social">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="la fab fa-facebook-square icon-lg"></i>
                            </span>
                          </div>
                          <input
                            value={data_detail.facebook}
                            onChange={this.handleInputChange}
                            name="facebook"
                            type="text"
                            className="form-control"
                            placeholder="Facebook"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.socialType.linkedin ? (
                      <div className="form-group-social">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="la fab fa-linkedin icon-lg"></i>
                            </span>
                          </div>
                          <input
                            value={data_detail.linkedin}
                            onChange={this.handleInputChange}
                            name="linkedin"
                            type="text"
                            className="form-control"
                            placeholder="Linkedin"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.state.socialType.skype ? (
                      <div className="form-group-social">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="la fab fa-skype icon-lg"></i>
                            </span>
                          </div>
                          <input
                            value={data_detail.skype}
                            onChange={this.handleInputChange}
                            name="skype"
                            type="text"
                            className="form-control"
                            placeholder="Skype"
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Phone </label>
                    <span style={{ color: "red" }}>*</span>
                    <input
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.phone}
                      type="text"
                      onChange={this.handleInputChange.bind(this)}
                      name="phone"
                      className={
                        errors.phone
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Enter phone"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Approach Date </label>
                    <input
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.approachDate}
                      type="date"
                      onChange={this.handleInputChange.bind(this)}
                      name="approachDate"
                      className="form-control"
                      placeholder="Enter approachDate"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-6">
                    <label> Expected Date:</label>
                    <DatetimePickerTrigger
                      moment={data_detail.expectedDate ? moment(data_detail.expectedDate).add(7,'hours') : null}
                      onChange={(_moment) =>
                        this.handleChangeDatePicker(_moment, "expectedDate")
                      }
                      showTimePicker={true}
                      className="custom-date-picker-interview"
                    >
                      <div className="custom-date-picker-interview__wrap">
                        <input readOnly name="expectedDate" value={data_detail.expectedDate ? moment(data_detail.expectedDate).add(7,'hours').format('YYYY-MM-DD HH:mm') : null} className={'form-control'}
                          placeholder="Enter Time Expected Date" />
                        <div className="input-group-append">
                          <span className="input-group-text">
                            <i className="la la-calendar icon-lg"></i>
                          </span>
                        </div>
                      </div>
                    </DatetimePickerTrigger>
                  </div>
                  {/* <div className="col-lg-6">
                    <label>Expected Date</label>
                    <input
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.expectedDate}
                      type="date"
                      onChange={this.handleInputChange.bind(this)}
                      name="expectedDate"
                      className="form-control"
                      placeholder="Enter expectedDate"
                    />
                  </div> */}
                  {/* <div className="col-lg-6">
                    <label>Due Date</label>
                    <input
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.dueDate}
                      type="date"
                      onChange={this.handleInputChange.bind(this)}
                      name="dueDate"
                      className="form-control"
                      placeholder="Enter dueDate"
                    />
                  </div> */}
                </div>

                <div className="form-group">
                  <label>Position </label>
                  <input
                    disabled={
                      this.props.role === roleName.DIRECTOR ? true : false
                    }
                    value={data_detail.position ? data_detail.position : ""}
                    type="text"
                    onChange={this.handleInputChange.bind(this)}
                    name="position"
                    className="form-control"
                    placeholder="Enter position"
                  />
                </div>

                <div className="form-group">
                  <label>Link cv </label>
                  <div className="input-group">
                    <input
                      type="text"
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.linkCv ? data_detail.linkCv : ""}
                      onChange={this.handleInputChange.bind(this)}
                      name="linkCv"
                      className={
                        errors.linkCv
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder="Import CV"
                    />
                    <label htmlFor="uploadRefineCv" className="custom-label-upload">
                      <div className="input-group-append custom-div-upload">
                        <span className="input-group-text">
                          <i className="fas fa-upload"></i>
                          <input
                            onChange={(e) => {
                              this.onChangeUploadHandler(e, 'linkCv')
                            }}
                            id="uploadRefineCv"
                            type="file"
                            accept="application/pdf"
                            className="form-control mb-2 mr-sm-2"
                            style={{ display: "none" }}
                            placeholder="Jane Doe"
                          />
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Link refine cv </label>
                  <div className="input-group">
                    <input
                      type="text"
                      disabled={
                        this.props.role === roleName.DIRECTOR ? true : false
                      }
                      value={data_detail.refineCv ? data_detail.refineCv : ""}
                      onChange={this.handleInputChange.bind(this)}
                      name="refineCv"
                      className="form-control"
                      placeholder="Import refine CV"
                    />
                    <label htmlFor="uploadCV" className="custom-label-upload">
                      <div className="input-group-append custom-div-upload">
                        <span className="input-group-text">
                          <i className="fas fa-upload"></i>
                          <input
                            onChange={(e) => {
                              this.onChangeUploadHandler(e, 'refineCv')
                            }}
                            id="uploadCV"
                            type="file"
                            accept="application/pdf"
                            className="form-control mb-2 mr-sm-2"
                            style={{ display: "none" }}
                            placeholder="Jane Doe"
                          />
                        </span>
                      </div>
                    </label>
                  </div>
                </div>


                <div className="form-group">
                  <label htmlFor="exampleTextarea">Approach Point </label>
                  <span style={{ color: "red" }}>*</span>
                  <textarea
                    disabled={
                      this.props.role === roleName.DIRECTOR ? true : false
                    }
                    value={
                      data_detail.noteApproach ? data_detail.noteApproach : ""
                    }
                    name="noteApproach"
                    onChange={this.handleInputChange}
                    className={
                      errors.noteApproach
                        ? "form-control scroll-approach is-invalid"
                        : "form-control scroll-approach"
                    }
                    rows={3}
                  />
                </div>

                {
                  data_detail.referalId ? (
                    <div className="form-group">
                      <label htmlFor="exampleTextarea">Not for recruiter</label>
                      <textarea
                        disabled={
                          this.props.role === roleName.DIRECTOR ? true : false
                        }
                        value={
                          data_detail.noteRecruiter ? data_detail.noteRecruiter : ""
                        }
                        name="noteRecruiter"
                        onChange={this.handleInputChange}
                        className="form-control scroll-approach"
                        rows={3}
                      />
                    </div>
                  ) : ''
                }
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer bsPrefix="footer-modal-cus">
          <div className="modal-cus__left">
            <div className="symbol-group symbol-hover">
              {users.map((user, index) => {
                return (
                  <Overlay
                    key={index}
                    show={this.state.isOpenDeleteUserPop[index]}
                    target={this.addMember[index]}
                    placement="top"
                    transition={false}
                    rootClose={true}
                    onHide={this.toggleDeleteUserPop.bind(this, index)}
                  >
                    <Popover id="popover-contained">
                      <Popover.Content>
                        <div className="mini-profile">
                          <div className="mini-profile-member member-large">
                            <a>
                              <img
                                height="50px"
                                width="50px"
                                src={
                                  user.linkAvatar
                                    ? `${domainServer + "/" + user.linkAvatar}`
                                    : `${defaultAva}`
                                }
                                alt=""
                              />
                            </a>
                          </div>
                          <div className="mini-profile-info">
                            <h3 className="mini-profile-info-title">
                              <a className="mini-profile-info-title-link js-profile">
                                {user.name}
                              </a>
                            </h3>
                            <p>{user.email}</p>
                          </div>
                        </div>
                        <ul className="pop-over-list">
                          {this.props.role === roleName.LEADER ? (
                            <li>
                              <a
                                onClick={() =>
                                  this.removeUserCard(
                                    this.props.data.id,
                                    user.id,
                                    index
                                  )
                                }
                                className="js-remove-member"
                              >
                                Remove from Card
                              </a>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </Popover.Content>
                    </Popover>
                  </Overlay>
                );
              })}
              {users.map((user, index) => {
                return (
                  <a
                    ref={(ref) => (this.addMember[index] = ref)}
                    onClick={this.toggleDeleteUserPop.bind(this, index)}
                    key={index}
                    className="btn btn-md btn-icon btn-light-facebook btn-pill mx-2"
                  >
                    <img
                      style={{ height: "100%", borderRadius: "50%" }}
                      width="100%"
                      alt="Pic"
                      src={
                        user.linkAvatar
                          ? `${domainServer + "/" + user.linkAvatar}`
                          : `${defaultAva}`
                      }
                    />
                  </a>
                );
              })}
              {this.state.showPopupAddMember ? (
                <ModalAddMember
                  addMemberToCard={this.addMemberToCard}
                  card_id={this.props.data.id}
                  usersTeam={users}
                  users={this.props.users}
                ></ModalAddMember>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="modal-cus__right">
            {data_detail.interview ? (
              <Button
                onClick={this.props.toggleDetailInterview}
                variant="btn btn-success btn-interview"
              >
                {convertDateLocal(data_detail.interview.timeInterview)}
              </Button>
            ) : (
              <Button
                variant="btn btn-success btn-interview"
                onClick={() => this.props.toggleDetailCardAndInterview()}
              >
                Create Interview
              </Button>
            )}

            {data_detail.isRefinePdf ? (
              <Link
                to={`/preview/candidate/${data_detail.candidateId}/job/${data_detail.idJob}`}
                className="btn btn-primary style-btn-kitin mr-3"
              >
                Refined CV
              </Link>
            ) : (
              ""
            )}
            {data_detail.linkCv ? (
              <Button
                variant="primary btn-interview"
                onClick={this.props.openPreviewPdfAndCloseCardTrello}
              >
                Raw CV
              </Button>
            ) : (
              ""
            )}
            {this.props.role !== roleName.DIRECTOR ? (
              <Button variant="primary btn-interview" onClick={this.updateCard}>
                Save
              </Button>
            ) : (
              ""
            )}
            <Button variant="light" onClick={this.hideModal}>
              Close
            </Button>
          </div>
        </Modal.Footer>
        <div onClick={this.setDefaultCommentBox} className="Wrap_history_card">
          <div className="wrap_icon_history">
            <div className="wrap_left_icon_act">
              <i className="flaticon2-calendar-1 custom_icon_history"></i>
              <div className="act_history">History</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={this.showHistoryCard.bind(this)}
            >
              {`${this.state.isShowHistory ? "Close" : "Show"}`}
            </button>
          </div>
          <div
            className={`wrap_row_history ${this.state.isShowHistory ? "active_history" : ""
              }`}
          >
            {this.state.isShowHistory
              ? this.state.history.map((e, index) => {
                return this.renderRowActivity(e, index);
              })
              : null}
            { }
          </div>
          <div className="wrap-comment-card">
            <div className="wrap_icon_history">
              <div className="wrap_left_icon_act">
                <i className="far fa-comment-dots custom_icon_history"></i>
                <div className="act_history">Comments</div>
              </div>
            </div>
            <div className="comment-card-content card-content-header">
              <div className="symbol symbol-50 symbol-light ">
                <span className="symbol-label symbol-label-cs cs_ava_history">
                  <img
                    src={
                      this.props.linkAvatar
                        ? domainServer + "/" + this.props.linkAvatar
                        : defaultAva
                    }
                    className="h-100 align-self-end"
                    alt=""
                  />
                </span>
              </div>
              <div
                className={
                  this.state.openFormInputComment
                    ? "height-open-form-comment comment-box"
                    : "height-default-form-comment comment-box"
                }
              >
                <textarea
                  onClick={(e) => {
                    e.stopPropagation();
                    this.openFormInputComment();
                  }}
                  onChange={this.handleInputChange}
                  value={this.state.content}
                  name="content"
                  placeholder="Write a comment ..."
                  className="comment-box-input"
                ></textarea>
                <div className="action-comment">
                  <button
                    onClick={this.createComment}
                    disabled={this.state.content === "" ? true : false}
                    type="button"
                    className={
                      this.state.content === ""
                        ? "btn btn-light  button-save-comment"
                        : "btn btn-primary button-save-comment"
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {this.state.comments.map((comment) => (
              <div className="comment-card-content">
                <div className="content-item">
                  <div className="symbol symbol-50 symbol-light ">
                    <span className="symbol-label symbol-label-cs cs_ava_history">
                      <img
                        src={
                          comment.User.linkAvatar
                            ? domainServer + "/" + comment.User.linkAvatar
                            : defaultAva
                        }
                        className="h-100 align-self-end"
                        alt=""
                      />
                    </span>
                  </div>
                  <div className="name-comment">
                    <span className="font-weight-name">
                      {comment.User.name}
                    </span>
                    <span>
                      {moment(comment.updatedAt).format("DD/MM/YYYY hh:mm")}
                    </span>
                    <div className="name-comment-content">
                      {comment.content}
                    </div>
                    <div className="action-comment-content">
                      <span>
                        <a
                          onClick={() => {
                            this.toggleFormEditContent(comment);
                          }}
                          id={`action-comment-item${comment.id}`}
                          className="action-comment-item"
                        >
                          Edit
                        </a>
                        {/* - <a onClick={() => {
                          this.removeComment(comment.id)
                        }} className="action-comment-item">Delete</a> */}
                      </span>
                    </div>
                    <UncontrolledCollapse
                      toggler={`#${`action-comment-item${comment.id}`}`}
                    >
                      <div className="height-open-form-comment comment-box-edit">
                        <textarea
                          onChange={(e) => {
                            this.handleInputChangeEditContent(e, comment);
                          }}
                          value={`${this.state[`contentEdit${comment.id}`]}`}
                          defaultValue={comment.content}
                          name="contentEdit"
                          placeholder="Write a comment ..."
                          className="comment-box-input"
                        ></textarea>
                        <div className="action-comment">
                          <button
                            onClick={() => {
                              this.editComment(comment);
                            }}
                            type="button"
                            className="btn btn-primary button-save-comment"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </UncontrolledCollapse>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
    userId: state.auth.userId,
    linkAvatar: state.auth.linkAvatar,
    // update: (e) => ownProps.update(e),
    addMemberToCard: (data) => ownProps.addMemberToCard(data),
  };
};

export default connect(mapStateToProps)(DetailCard);
