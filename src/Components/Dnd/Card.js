import React, { Component } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Button, Modal, Overlay } from "react-bootstrap";
import Popover from "react-bootstrap/Popover";
import { Button as ButtonPop, Popover as PopoverPop, PopoverHeader, PopoverBody } from 'reactstrap';
import Select from 'react-select'
import _ from 'lodash'
import "./styles.css";
import { connect } from "react-redux";
import roleName from '../../utils/const'
import { defaultAva, domainServer } from "../../utils/config";
import * as moment from 'moment'
const Container = styled.div`
  margin-bottom: 8px;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  border-radius: 2px;
  padding: 6px 8px;
  background-color: #fff;
  font-family: "Poppins", sans-serif;
`;

const setPaddingBottomMembers = (length) => {
  let paddingBottom = 56;
  if (length > 3) {
    paddingBottom = 95
  }
  return {
    paddingBottom: `${paddingBottom}px`
  }
}

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDeleteUserPop: new Array(10).fill(false),
      showAddMember: false,
      userSelected: {},
      showListBoard: true,
      showListSkill: false,
      actions: [
        {
          slug: 'move',
          title: 'Move Card',
          roles: [roleName.LEADER, roleName.MEMBER]
        },
        {
          slug: 'storage',
          title: 'Storage Card',
          roles: [roleName.DIRECTOR, roleName.LEADER, roleName.MEMBER]
        }
      ],
      laneSelected: {},
      showAction: ''
    };
    this.showInfoMember = [];
    this.addMemberToCard = this.addMemberToCard.bind(this);
    this.removeMemberToCard = this.removeMemberToCard.bind(this)
  }

  toggleListSkill = () => {
    this.setState({
      showListSkill: !this.state.showListSkill
    }, () => {
      if (!this.state.showListSkill) {
        this.setState({
          showAction: ''
        })
      }
    })
  }

  toggleListBoard = () => {
    this.setState({
      userSelected: {},
      showListBoard: !this.state.showListBoard
    })
  }


  toggleAddMember = () => {
    this.setState({
      showListBoard: true,
      showAddMember: !this.state.showAddMember
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

  handleOnChangeUser = (e) => {
    this.setState({
      showListBoard: false,
      userSelected: e
    })
  }

  addMemberToCard(card_id, user) {
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
    this.toggleListBoard();
    this.toggleAddMember();
  }


  removeMemberToCard = (index, card_id, user_id) => {
    console.log("da vao day")
    this.props.removeMemberToCard(card_id, user_id);
    let currentIsOpenDeleteUserPop = this.state.isOpenDeleteUserPop;
    currentIsOpenDeleteUserPop[index] = false;
    this.setState({
      isOpenDeleteUserPop: currentIsOpenDeleteUserPop
    })
  }

  checkUserIsSelected = (users, user_id) => {
    let isSelected = false;
    isSelected = _.some(users, { id: user_id })
    return isSelected
  }

  showUserAnSelected = (usersTeam, userCard) => {
    const users = _.cloneDeep(usersTeam);
    for (const data of userCard) {
      _.remove(users, user => user.value === data.id)
    }
    return users
  }

  colorRandomSelected = () => {
    const colors = ['label-custom-name label label-xl label-inline label-light-dark', 'label-custom-name label label-xl label-inline label-light-dark', 'label-custom-name label label-xl label-inline label-light-success', 'label-custom-name label label-xl label-inline label-light-danger', 'label-custom-name label label-xl label-inline label-light-success'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random]
  }

  toggleMember = (selected, index, card_id, user) => {
    if (selected) {
      // remove member
      this.removeMemberToCard(index, card_id, user.value)
    } else {
      this.addMemberToCard(card_id, user)
      // add member
    }
  }

  formMoveCard = () => (
    <div className="form-move-card">
      <div className="form-move-card-content">
        <label>Name column </label>
        <span style={{ color: "red" }}>*</span>
        <Select
          name="option"
          options={this.props.lanes}
          value={this.state.laneSelected}
          onChange={(e) => {
            this.setState({
              laneSelected: e
            })
          }}
        />
      </div>
      <div className="form-move-card-footer text-center">
        <button onClick={() => {
          this.props.actionUpdateColumn(this.props.card, this.state.laneSelected.value);
          this.toggleListSkill()
        }} type="button" className="btn btn-primary">Save</button>
      </div>
    </div>
  )

  formStorage = () => (
    <div className="form-move-card">
      <div className="form-move-card-content text-center">
        <h4>Do you want to storage this card ?</h4>
        {/* <Select
          name="option"
          options={this.props.lanes}
          value={this.state.laneSelected}
          onChange={(e) => {
            this.setState({
              laneSelected: e
            })
          }}
        /> */}
      </div>
      <div className="form-move-card-footer text-center">
        <button onClick={() => {
          this.props.storageCard(this.props.card)
          this.toggleListSkill();
        }} type="button" className="btn btn-primary">Save</button>
      </div>
    </div>
  )

  backAction = () => {
    const updateState = {}
    if (this.state.showAction === '') {
      updateState.showListSkill = false
    } else {
      updateState.showAction = ''
    }
    this.setState(updateState)
  }

  render() {
    const users = this.props.card.content.user;
    const card = this.props.card.content;
    let usersTeam = [];
    let formAction;
    const action = {
      move: this.formMoveCard,
      storage: this.formStorage
    }

    if (this.state.showAction) {
      formAction = action[this.state.showAction]
    }

    if (!_.isEmpty(this.props.users)) {
      usersTeam.push(...this.props.users);
    }
    return (
      <Draggable draggableId={this.props.card.id} index={this.props.index}>
        {(provided) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div>
              <PopoverPop popperClassName="popover-modal-card" trigger="legacy" placement="bottom" isOpen={this.state.showAddMember} target={`Popover${this.props.card.id}`} toggle={this.toggleAddMember}>
                <PopoverBody>
                  <ul className="navi navi-hover navi-selected-ul">
                    <li className="navi-header font-weight-bold py-4">
                      <span className="font-size-lg">Toggle member to card:</span>
                      <i className="flaticon2-information icon-md text-muted" data-toggle="tooltip" data-placement="right" title="Click to learn more..." />
                    </li>
                    <li className="navi-separator mb-3 opacity-70" />
                    {usersTeam.map((user, index) => {
                      return (
                        <li key={index} className="navi-item navi-item-select-user" onClick={() => this.toggleMember(this.checkUserIsSelected(users, user.value), index, this.props.card.id, user)}>
                          <a className="navi-link navi-link-cus">
                            <span className="navi-text">
                              <span className={this.colorRandomSelected()}>{user.name}</span>
                            </span>
                            <label className="checkbox">
                              <input disabled readOnly type="checkbox" checked={this.checkUserIsSelected(users, user.value)} name="Checkboxes1" />
                              <span></span>
                            </label>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </PopoverBody>
              </PopoverPop>
              <PopoverPop popperClassName="popover-modal-card modal-actions" trigger="legacy" placement="bottom" isOpen={this.state.showListSkill} target={`PopoverSkill${this.props.card.id}`} toggle={this.toggleListSkill}>
                <PopoverBody>
                  <ul className="navi navi-hover navi-selected-ul">
                    <li className="navi-header font-weight-bold py-4 action-actions">
                      <span onClick={this.backAction} className="back-card"><i className="fas fa-arrow-left"></i></span>
                      <span className="font-size-lg">{this.state.showAction === '' ? 'Actions' : this.state.showAction}</span>
                    </li>
                    <li className="navi-separator mb-3 opacity-70" />

                    {this.state.showAction === '' ? (
                      this.state.actions.map((action, key) => (
                        _.includes(action.roles, this.props.role) ? (
                          <li key={key} onClick={() => {
                            const stateUpdate = {
                              showAction: action.slug
                            }
                            if (action.slug === 'move') {
                              if (this.props.card.content) {
                                const laneSelected = this.props.card.content.laneSelected;
                                stateUpdate.laneSelected = laneSelected
                              }
                            }
                            this.setState(stateUpdate)
                          }} className="action quareo-ok">{action.title}</li>
                        ) : ''
                      ))
                    ) : (
                        formAction()
                      )}

                  </ul>
                </PopoverBody>
              </PopoverPop>
              <div>
                <div className="body_card">
                  <div className="card card-custom gutter-b card-stretch mb-0">

                    {card.interview ? <div className="card-header ribbon ribbon-clip ribbon-right ribbon-ver-cus">
                      <div className="ribbon-target" style={{ top: '41px', height: '30px' }}>
                        <span className="ribbon-inner bg-success" /><i className="fa fa-star text-white" />
                      </div>
                    </div> : ''}
                    <div style={setPaddingBottomMembers(users.length)} className="card-body card-body-trello pt-4" onClick={this.props.open_detail_card}>
                      <div >
                        <div className="d-flex align-items-center mb-4">
                          <div className="d-flex flex-column card-header-detail">
                            <div className="card-header__title">
                              <div className="client-and-title">
                                {
                                  this.props.card.content.clientName ? (
                                    <div title={this.props.card.content.clientName} style={{ background: this.props.card.content.backgroundClient }} className="card-label">
                                      <span className="label-text">
                                        {this.props.card.content.clientName}
                                      </span>
                                    </div>
                                  ) : ''
                                }

                                <a className="text-dark font-weight-bold text-hover-primary font-size-h4 mb-0 manhxinh-style-title">{card.name} {card.nameJob}</a>
                              </div>
                              <div className="btn-skills" id={`PopoverSkill${this.props.card.id}`} onClick={(e) => {
                                e.stopPropagation();
                              }}><div className="skills-ok"><i className="fas fa-pencil-alt"></i></div></div>
                            </div>
                            <span className="text-muted font-weight-bold">{moment(card.approachDate).format('DD/MM/YYYY')}</span>
                          </div>

                        </div>

                        <p className="mb-4">{card.nameJob}</p>

                        <div className="mb-7 card-content-info">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-dark-75 font-weight-bolder mr-2 set-with-info">Email:</span>
                            <a title={card.email} className="text-muted text-hover-primary custom-dot-email">{
                              card.email
                            }</a>
                          </div>
                          <div className="d-flex justify-content-between align-items-cente my-1">
                            <span className="text-dark-75 font-weight-bolder mr-2 set-with-info">Phone:</span>
                            <a className="text-muted text-hover-primary ">{card.phone}</a>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-dark-75 font-weight-bolder mr-2">Position:</span>
                            <span className="text-muted font-weight-bold">{card.position}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="footer-card-detail">
                      <div className="mt-9 mb-6">
                        {
                          users.map((user, index) => {
                            return (
                              <div key={index} >
                                <Overlay
                                  show={
                                    this.state.isOpenDeleteUserPop[index]
                                  }
                                  target={this.showInfoMember[index]}
                                  placement="bottom"
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
                                          <a href=""><img height="50px" width="50px" src={user.linkAvatar ? `${domainServer + "/" + user.linkAvatar}`
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
                                        {this.props.role === roleName.LEADER
                                          ? (this.props.userId !== user.id ? <li>
                                            <a onClick={() => this.removeMemberToCard(index, this.props.card.id, user.id)} className="js-remove-member">Remove from Card</a>
                                          </li> : '')
                                          : null}
                                      </ul>
                                    </Popover.Content>
                                  </Popover>
                                </Overlay>
                              </div>
                            )
                          })
                        }
                        {users.map((user, index) => {
                          return (
                            <a ref={(ref) =>
                              (this.showInfoMember[index] = ref)
                            } onClick={this.toggleDeleteUserPop.bind(
                              this,
                              index
                            )}
                              key={index} className="btn btn-md btn-icon btn-light-facebook btn-pill mx-1">
                              <img style={{ height: '100%', borderRadius: '50%' }} width="100%" alt="Pic" src={user.linkAvatar ? `${domainServer + "/" + user.linkAvatar}`
                                : `${defaultAva}`} />
                            </a>

                          )
                        })}
                        <div id={`Popover${this.props.card.id}`} className={this.props.role !== roleName.DIRECTOR ? 'btn btn-md btn-icon btn-light-facebook btn-pill mx-2' : 'btn btn-md btn-icon btn-light-facebook btn-pill mx-2 off-button-add-user'} data-toggle="tooltip" title="" data-original-title="More users">
                          <i className="fas fa-plus"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )
        }
      </Draggable>
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
  };
};

export default connect(mapStateToProps)(Card);
