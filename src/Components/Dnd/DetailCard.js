import React, { Component, useRef } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import Select from "react-select";
import Popover from "react-bootstrap/Popover";
import ModalAddMember from "./ModalAddMember";
import { connect } from "react-redux";
import { defaultAva, domainServer } from "../../utils/config";
import { Button as ButtonPop, Popover as PopoverPop, PopoverHeader, PopoverBody } from 'reactstrap';
import _ from 'lodash'
import roleName from '../../utils/const'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import toastr from 'toastr'
import Network from "../../Service/Network";
import * as moment from 'moment'
import Validator from "../../utils/validator";
import { rulesCreateNewCard } from "../../utils/rule";

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
    };
    this.addMember = [];
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleDeleteUserPop = this.toggleDeleteUserPop.bind(this)
    this.onChangeUploadHandler = this.onChangeUploadHandler.bind(this)
    this.validator = new Validator(rulesCreateNewCard);
  }

  toggleShowPopupAddMember = () => {
    this.setState({
      showPopupAddMember: !this.state.showPopupAddMember
    })
  }


  toggleDeleteUserPop(index) {
    let self = this;
    const isShow = this.state.isOpenDeleteUserPop[index]
    let currentIsOpenDeleteUserPop = new Array(10).fill(false);
    this.setState({
      isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
    }, function () {
      currentIsOpenDeleteUserPop[index] = !isShow;
      self.setState({
        isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
      });
    });

  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show,
    })
  }
  setTarget = (target) => {
    this.setState({
      target: target,
    })
  }

  handleClick = (event) => {
    this.toggleShow();
    this.setTarget(event.target);
  };


  handleInputChange = (e) => {
    this.props.update(e);
  }

  removeUserCard = (card_id, user_id, index) => {
    this.props.removeMemberToCard(card_id, user_id);
  }

  addMemberToCard = (card_id, user) => {
    const data = {
      card_id,
      content: {
        id: user.value,
        email: user.label,
        name: user.name,
        linkAvatar: user.linkAvatar
      }
    }
    this.props.addMemberToCard(data)
  }

  handleOnChangeJobSelected = (e) => {
    this.setState({
      jobSelected: e
    })
    this.props.handleOnChangeJobSelected(e);
  }

  toggleAddMember = () => {
    this.setState({
      showAddMember: !this.state.showAddMember
    })
  }
  checkUserIsSelected = (users, user_id) => {
    let isSelected = false;
    isSelected = _.some(users, { id: user_id })
    return isSelected
  }
  colorRandomSelected = () => {
    const colors = ['label label-xl label-inline label-light-dark', 'label label-xl label-inline label-light-dark', 'label label-xl label-inline label-light-success', 'label label-xl label-inline label-light-danger', 'label label-xl label-inline label-light-success'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random]
  }

  toggleMember = (selected, index, card_id, user) => {
    if (selected) {
      // remove member
      this.props.removeMemberToCard(card_id, user.value)
    } else {
      this.addMemberToCard(card_id, user)
      // add member
    }
    this.toggleAddMember();
  }

  async onChangeUploadHandler(event) {
    const card = this.props.data_detail.content;
    if (card.name === '' || card.nameJob === '') {
      toastr.error("You need to fill in all the information before uploading cv !");
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
        formData.append("nameFile", `${card.name} ${card.nameJob}`)
        formData.append("idJob", `${card.idJob}`)

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
              this.updatePropsLinkCv(fileName);
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

  updatePropsLinkCv = (value) => {
    const data = {
      target: {
        name: 'linkCv',
        value: value
      },
    }
    this.props.update(data)
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  updateCard = () => {
    const data = this.props.data_detail.content;
    const errors = this.validator.validate(data);
    delete errors['laneId']
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      this.props.updateCard();
    }
  }

  render() {
    const errors = this.state.errors
    const users = [];
    let usersTeam = [];
    const data_detail = this.props.data_detail.content;
    if (this.props.show) {
      users.push(...this.props.data.content.user);
    }
    if (!_.isEmpty(this.props.users)) {
      usersTeam.push(...this.props.users);
    }
    data_detail.approachDate = moment(data_detail.approachDate).format("YYYY-MM-DD");

    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onHide} centered>
        <Modal.Header closeButton>
          <div className="card-detail-header">
            <div className="detail-header__title">
              <h4>Update card</h4>
            </div>
            <div className="detail_header__sticky">
              {this.props.role === roleName.LEADER ? <div className="dropdown dropdown-inline" data-toggle="tooltip" title="Quick actions" data-placement="left">   <a id={`Proveti${this.props.data.id}`} className="btn btn-clean btn-hover-light-primary btn-sm btn-icon" >
                <i className="ki ki-bold-more-hor" />
              </a>
                <PopoverPop popperClassName="popover-modal-card" trigger="legacy" placement="right" isOpen={this.state.showAddMember} target={`Proveti${this.props.data.id}`} toggle={this.toggleAddMember}>
                  <PopoverBody>
                    <ul className="navi navi-hover">
                      <li className="navi-header font-weight-bold py-4">
                        <span className="font-size-lg">Toggle member to card:</span>
                        <i className="flaticon2-information icon-md text-muted" data-toggle="tooltip" data-placement="right" title="Click to learn more..." />
                      </li>
                      <li className="navi-separator mb-3 opacity-70" />

                      {usersTeam.map((user, index) => {
                        return (
                          <li key={index} className="navi-item" onClick={() => this.toggleMember(this.checkUserIsSelected(users, user.value), index, this.props.data.id, user)}>
                            <a className="navi-link navi-link-cus">
                              <span className="navi-text">
                                <span className={this.colorRandomSelected()}>{user.name}</span>
                              </span>
                              <label className="checkbox">
                                <input type="checkbox" readOnly checked={this.checkUserIsSelected(users, user.value)} name="Checkboxes1" />
                                <span></span>
                              </label>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </PopoverBody>
                </PopoverPop>   </div> : ''}

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
                  <input type="text" value={data_detail.name} onChange={this.handleInputChange.bind(this)} name="name" className="form-control"
                    placeholder="Enter name" />
                </div>

                <div className="form-group">
                  <label>Name job </label>
                  <span style={{ color: "red" }}>*</span>
                  <Select
                    name="option"
                    options={this.props.jobs}
                    value={data_detail.jobSelected}
                    onChange={this.handleOnChangeJobSelected}
                  />
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Location</label>
                    <input disabled value={data_detail.location} type="text" onChange={this.handleInputChange.bind(this)} name="location" className="form-control" />
                  </div>
                  <div className="col-lg-6">
                    <label>Client Name</label>
                    <input disabled value={data_detail.clientName} type="text" onChange={this.handleInputChange.bind(this)} name="clientName" className="form-control" />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-12">
                    <label>Email </label>
                    <span style={{ color: "red" }}>*</span>
                    <input value={data_detail.email} type="email" onChange={this.handleInputChange.bind(this)} name="email" className="form-control"
                      placeholder="Enter email" />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Phone </label>
                    <span style={{ color: "red" }}>*</span>
                    <input value={data_detail.phone} type="text" onChange={this.handleInputChange.bind(this)} name="phone" className="form-control" placeholder="Enter phone" />
                  </div>
                  <div className="col-lg-6">
                    <label>Approach Date </label>
                    <input value={data_detail.approachDate} type="date" onChange={this.handleInputChange.bind(this)} name="approachDate" className="form-control"
                      placeholder="Enter approachDate" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Position </label>
                  <input value={data_detail.position} type="text" onChange={this.handleInputChange.bind(this)} name="position" className="form-control"
                    placeholder="Enter position" />
                </div>

                <div className="form-group">
                  <label>Link cv </label>
                  <div className="input-group">
                    <input type="text" value={data_detail.linkCv} onChange={this.handleInputChange.bind(this)} name="linkCv" className={
                      errors.linkCv
                        ? "form-control is-invalid"
                        : "form-control"
                    } placeholder="Enter link or import cv" />
                    <label htmlFor="uploadCV" className="custom-label-upload">
                      <div className="input-group-append custom-div-upload"><span className="input-group-text"><i className="fas fa-cloud-upload-alt"></i><input onChange={this.onChangeUploadHandler} id="uploadCV" type="file" className="form-control mb-2 mr-sm-2" style={{ display: 'none' }} placeholder="Jane Doe" /></span></div>
                    </label>
                  </div>
                </div>


                <div className="form-group">
                  <label htmlFor="exampleTextarea">Approach Point </label>
                  <span style={{ color: "red" }}>*</span>
                  <textarea value={data_detail.noteApproach} name="noteApproach" onChange={this.handleInputChange} className={
                    errors.noteApproach
                      ? "form-control is-invalid"
                      : "form-control"
                  } rows={3} />
                </div>

              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer bsPrefix="footer-modal-cus">
          <div className="modal-cus__left">
            <div className="symbol-group symbol-hover">
              {
                users.map((user, index) => {
                  return (
                    <Overlay
                      key={index}
                      show={
                        this.state.isOpenDeleteUserPop[index]
                      }
                      target={this.addMember[index]}
                      placement="top"
                      transition={false}
                      rootClose={true}
                      onHide={this.toggleDeleteUserPop.bind(
                        this,
                        index
                      )}
                    >
                      <Popover id="popover-contained">
                        <Popover.Content>
                          <div className="mini-profile">
                            <div className="mini-profile-member member-large">
                              <a><img height="50px" width="50px" src={user.linkAvatar ? `${domainServer + "/" + user.linkAvatar}`
                                : `${defaultAva}`} alt="" /></a>
                            </div>
                            <div className="mini-profile-info">
                              <h3 className="mini-profile-info-title">
                                <a className="mini-profile-info-title-link js-profile">{user.name}</a>
                              </h3>
                              <p>{user.email}</p>
                            </div>
                          </div>
                          <ul className="pop-over-list">
                            {
                              this.props.role === roleName.LEADER ?
                                <li>
                                  <a onClick={() => this.removeUserCard(this.props.data.id, user.id, index)} className="js-remove-member">Remove from Card</a>
                                </li> : ''
                            }
                          </ul>
                        </Popover.Content>
                      </Popover>
                    </Overlay>
                  )
                })
              }
              {users.map((user, index) => {
                return (
                  <a ref={(ref) =>
                    (this.addMember[index] = ref)
                  } onClick={this.toggleDeleteUserPop.bind(
                    this,
                    index
                  )} key={index} className="btn btn-md btn-icon btn-light-facebook btn-pill mx-2">
                    <img style={{ height: '100%', borderRadius: '50%' }} width="100%" alt="Pic" src={user.linkAvatar ? `${domainServer + "/" + user.linkAvatar}`
                      : `${defaultAva}`} />
                  </a>
                )
              })}
              {this.state.showPopupAddMember ? <ModalAddMember addMemberToCard={this.addMemberToCard} card_id={this.props.data.id} usersTeam={users} users={this.props.users}></ModalAddMember> : ''}
            </div>
          </div>

          <div className="modal-cus__right">
            {
              data_detail.interview ?
                <Button onClick={this.props.toggleDetailInterview} variant="btn btn-success btn-interview">{moment(data_detail.interview.timeInterview).format('dddd DD/MM/YYYY HH:mm')}</Button>
                :
                <Button variant="btn btn-success btn-interview" onClick={() => this.props.toggleDetailCardAndInterview()}>Create Interview</Button>

            }
            <Button variant="primary btn-interview" onClick={this.updateCard}>Save</Button>
            <Button variant="light" onClick={this.props.onHide}>Close</Button>
          </div>
        </Modal.Footer>
      </Modal >
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
    update: (e) => ownProps.update(e),
    addMemberToCard: (data) => ownProps.addMemberToCard(data),
  };
};

export default connect(mapStateToProps)(DetailCard);
