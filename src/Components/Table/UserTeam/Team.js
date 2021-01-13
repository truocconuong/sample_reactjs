import React, { Component } from "react";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./../style.css";
import Network from "../../../Service/Network";
import Fbloader from "../../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from 'lodash'
import Select from "react-select";
import { rulesAddTeam } from "../../../utils/rule";
import Validator from "../../../utils/validator";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast";

const api = new Network();

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      users: [],
      members: [],
      name: '',
      idLeader: '',
      team: '',
      emailSelected: '',
      isOpenDeleteUserPop: new Array(10).fill(false),
      member: null,
      formAddMemberToTeam: false,
      isLoading: false,
      isSelected: false,
      formAddTeam: true,
      errors: {},
      deleteRef: new Array(10),
      classToggleDetail: new Array(10).fill("show_mb"),
      classArr: new Array(10).fill("fa fa-caret-down"),
    };
    this.deleteRef = [];
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataTeam = this.getDataTeam.bind(this);
    this.getDataUser = this.getDataUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.toggleDeleteTeamPopup = this.toggleDeleteTeamPopup.bind(this);
    this.validator = new Validator(rulesAddTeam);
  }
  handleOnchange = async (event) => {
    console.log(event)
    this.setState({ isSelected: true, idLeader: event.value, emailSelected: event });
  };

  handleOnchangeMember = async (event) => {
    this.setState({ member: event });
  };
  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  }
  setDefaultState = () => {
    this.setState({
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      users: [],
      members: [],
      name: '',
      idLeader: '',
      team: '',
      emailSelected: '',
      member: null,
      errors: {},
      formAddMemberToTeam: false,
      isLoading: false,
      isSelected: false,
      formAddTeam: true,
      isOpenDeleteUserPop: new Array(10).fill(false),
    })
  }
  toggleForm(team) {
    this.resetForm();
    this.setState({ formAddTeam: this.state.team !== '' && this.state.team.id === team.id ? !this.state.formAddTeam : false },()=>{
      if (!this.state.formAddTeam) {
        this.setState({ team: team })
        this.loadDataUpdateToState(team.id);
      }
    })
  }
  async loadDataUpdateToState(id) {
    const response = await api.get(`/api/teams/${id}`);
    if (response) {
      const team = response.data.team;
      const data = {
        name: team.name
      };

      const idLeader = team.idLeader;
      if (!_.isNil(idLeader)) {
        const user = _.find(team.Users, user => user.id === idLeader);
        if (user) {
          data.emailSelected = { value: user.id, label: user.email }
        }
      }
      data.members = team.Users

      this.setState(data)

    }
  }
  async getDataTeam() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      const response = await api.get(
        `/api/teams?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );

      if (response) {
        setTimeout(() => {
          self.setState({
            data: response.data.list,
            totalRow: response.data.total,
            start: start,
            realSize: response.data.list.length,
          });
        }, 300);
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 1200);
      } else {
        self.setState({
          isLoading: false,
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log("Err in list job: ", err.response);
    }
  }

  async getDataUser() {
    const response = await api.post(`/api/admin/user/list`);
    if (response) {
      const users = _.map(response.data.user, user => {
        return { label: user.email, value: user.id , role : user.Role.name}
      })
      users[0].selected = true;
      console.log(users)
      this.setState({ users: users })
    }
  }
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
    });
    this.getDataTeam();
  }
  componentDidMount() {
    this.getDataTeam();
    this.getDataUser();
  }

  showEmailLeader(leaderId, users) {
    let email = '';
    if (!_.isNil(leaderId)) {
      const user = _.find(users, user => user.id === leaderId);
      if (user) {
        email = user.email;
      }
    }
    return email;
  }

  showPositionOfMember(user) {
    const leader = this.state.emailSelected;
    let position = 'Member'
    if (!_.isEmpty(leader)) {
      const idLeader = leader.value;
      if (user.id === idLeader) {
        position = 'Leader'
      }
    }
    return position
  }

  notification = () => {
    toast(<CustomToast title={"Create Team Successed !"} />, {
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
      transition: Zoom,
    });
  }

  async createTeam(e) {
    e.preventDefault();
    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      const { name, idLeader } = this.state
      const data = {
        name, idLeader
      }
      const response = await api.post(`/api/teams`, data);
      if (response) {
        this.setDefaultState();
        this.getDataTeam();
        this.getDataUser();
        this.resetForm();
        this.notification();

      }
    }
  }

  resetForm = () => {
    this.setState({ name: '', emailSelected: null })
  }


  showFormAddMemberToTeam = () => {
    this.setState({
      formAddMemberToTeam: !this.state.formAddMemberToTeam
    })
  }

  createMemberTeam = () => {
    const { member, members } = this.state;
    if (!_.isNil(member)) {
      members.push({ id: member.value, email: member.label });
      this.setState({ members: members })
    };
    this.showFormAddMemberToTeam();
  }

  removeMemberTeam = (id) => {
    const { members } = this.state;
    const filterMember = _.filter(members, member => member.id !== id);
    this.setState({ members: filterMember })
  }

  updateTeam = async (e) => {
    e.preventDefault();
    // const errors = this.validator.validate(this.state);
    // this.setState({
    //   errors: errors,
    // });

    // if (this.isEmpty(errors)) {
      const data = {
        name: this.state.name,
        members: this.state.members
      }
      if (!_.isNil(this.state.emailSelected)) {
        data.idLeader = this.state.emailSelected.value;
        const checkLeaderExistTeam = _.find(data.members, member => member.id === data.idLeader);
        if (!checkLeaderExistTeam) {
          const leader = {
            id: this.state.emailSelected.value,
            email: this.state.emailSelected.label
          };
          data.members.push(leader);
        }
      };
      const response = await api.patch(`/api/teams/${this.state.team.id}`, data)
      if (response) {
        this.setDefaultState();
        this.getDataTeam();
        this.getDataUser();
        toast(<CustomToast title={"Update team successed ! "} />, {
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
          transition: Zoom,
        });
      }
    // }
  }

  closeFormUpdate = () => {
    this.setDefaultState();
    this.getDataTeam();
    this.getDataUser();
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  removeTeam = async (id) => {
    const response = await api.delete(`/api/teams/${id}`)
    if (response) {
      this.setDefaultState();
      this.getDataTeam();
      this.getDataUser();
    }
  }

  showDetail(index) {
    let currentClass = this.state.classToggleDetail;
    let currentClassArr = this.state.classArr;
    if (this.state.classToggleDetail[index] === "hide_mb") {
      currentClass[index] = "show_mb";
      currentClassArr[index] = "fa fa-caret-down";
      this.setState({
        classToggleDetail: currentClass,
        classArr: currentClassArr,
      });
    } else {
      currentClassArr[index] = "fa fa-caret-right";
      currentClass[index] = "hide_mb";
      this.setState({
        classToggleDetail: currentClass,
        classArr: currentClassArr,
      });
    }
  }

  toggleDeleteTeamPopup(isShow, index) {
    let self = this;
    let currentIsOpenDeleteUserPop = new Array(10).fill(false);
    this.setState({
      isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
    }, function () {
      if (isShow) {
        currentIsOpenDeleteUserPop[index] = isShow;
        self.setState({
          isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
        });
      }
    });
  }
  render() {

    const data = this.state.data;
    const errors = this.state.errors;
    const leaders = _.filter(this.state.users,user => user.role ==='Leader'); 
    const members = _.filter(this.state.users,user => user.role ==='Member'); 
    const elmFormCreateTeam = (<div className="col-md-5 col-sm-12">
      <div className="card card-custom">
        <div className="card-header flex-wrap border-0 pt-6 pb-0">
          <div className="card-title">
            <h3 className="card-label">Add new team</h3>
          </div>
        </div>
        <div>
          <form className="form" onSubmit={this.createTeam}>
            <div className="card-body">
              <div className="form-group row ">
                <label className="col-form-label col-lg-3">
                  Name
                <span className="text-danger">*</span>
                </label>
                <div className="col-lg-9">
                  <input
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    type="text"
                    className={
                      errors.name
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                  <div className="valid-feedback">
                    Success! You've done it.
                </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-form-label  col-lg-3 ">
                  Leader
                </label>
                <div className="col-lg-9 col-md-9 col-sm-12">
                  <Select
                    name="option"
                    options={leaders}
                    value={this.state.emailSelected}
                    className={errors.idLeader ? 'invalid-selected' : ''}
                    onChange={this.handleOnchange}
                  />
                  <div className="invalid-feedback">
                    Shucks, check the formatting of that and try
                    again.
                </div>
                </div>
              </div>
            </div>


            <div className="card-footer">
              <div className="row">
                <div className="col-lg-9 ml-lg-auto">
                  <button
                    type="submit"
                    className="btn btn-primary font-weight-bold mr-2"
                  >
                    Add team
                </button>
                  <button onClick={this.resetForm}
                    type="button"
                    className="btn btn-light-primary font-weight-bold"
                  >
                    Clear
                </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>)

    const elmFormListMemberOfTeam = (
      <div className="card card-custom card-custom-update">
        <div className="card-header flex-wrap border-0 pt-6 pb-0">
          <div className="card-title card-title-cus">
            <h3 className="card-label">
              List member of team
              </h3>
            <button onClick={this.showFormAddMemberToTeam}
              type="submit"
              className="btn btn-primary font-weight-bold mr-2"
            >
              Add member
         </button>
          </div>
          <div className="card-toolbar">
            <div className="dropdown dropdown-inline mr-2">
           
            </div>
          </div>
        </div>
        <div className="card-body cus-pd-t-0">
          <div
            className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
            id="kt_datatable"
            style={{ position: "static", zoom: 1 }}
          >
            <table
              className="datatable-table"
              style={{ display: "block" }}
            >
              <thead className="datatable-head">
                <tr className="datatable-row" style={{ left: "0px" }}>
                  <th
                    data-field="OrderID"
                    className="datatable-cell datatable-cell-sort"
                  >
                    <span style={{ width: "200px" }}>Name</span>
                  </th>
                  <th
                    data-field="OrderID"
                    className="datatable-cell datatable-cell-sort"
                  >
                    <span style={{ width: "70px" }}>Position</span>
                  </th>

                  <th
                    data-field="Actions"
                    data-autohide-disabled="false"
                    className="datatable-cell datatable-cell-sort"
                  >
                    <span style={{ width: "90px" }}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="datatable-body" style={{}}>
                {this.state.members.map((user, index) => {
                  return (
                    <tr
                      key={index}
                      data-row={1}
                      className="datatable-row datatable-row-even"
                      style={{ left: "0px" }}
                    >
                      <td
                        data-field="OrderID"
                        aria-label="63868-257"
                        className="datatable-cell"
                      >
                        <span style={{ width: "200px" }}>
                          {user.email}
                        </span>
                      </td>
                      <td
                        data-field="OrderID"
                        aria-label="63868-257"
                        className="datatable-cell"
                      >
                        <span style={{ width: "70px" }}>
                          {this.showPositionOfMember(user)}
                        </span>
                      </td>


                      <td
                        data-field="Actions"
                        data-autohide-disabled="false"
                        aria-label="null"
                        className="datatable-cell"
                      >
                        <span
                          style={{
                            overflow: "visible",
                            position: "relative",
                            width: "90px",
                          }}
                        >
                          <a
                            onClick={() => this.removeMemberTeam(user.id)}
                            href="#"
                            className="btn btn-sm btn-clean btn-icon"
                            title="Delete user"
                          >
                            <span className="svg-icon svg-icon-md">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                version="1.1"
                              >
                                <g
                                  stroke="none"
                                  strokeWidth={1}
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <rect
                                    x={0}
                                    y={0}
                                    width={24}
                                    height={24}
                                  />
                                  <path
                                    d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z"
                                    fill="#000000"
                                    fillRule="nonzero"
                                  />
                                  <path
                                    d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                                    fill="#000000"
                                    opacity="0.3"
                                  />
                                </g>
                              </svg>
                            </span>
                          </a>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )

    const elmFormCreateMemberToTeam = (
      <div className="col-12 p=0">
        <div className="card card-custom card-custom-update">
          <div className="card-header flex-wrap border-0 pt-6 pb-0">
            <div className="card-title">
              <h3 className="card-label">Create member</h3>
            </div>
          </div>
          <div>
            <div className="form">
              <div className="card-body cus-pd-b-0">
                <div className="form-group row">
                  <label className="col-form-label  col-lg-3 ">
                    Member
                  </label>
                  <div className="col-lg-9 col-md-9 col-sm-12">
                    <Select
                      defaultValue={{ label: "Select Dept", value: 0 }}
                      name="option"
                      options={members}
                      value={this.state.member}
                      onChange={this.handleOnchangeMember}
                    />
                    <div className="invalid-feedback">
                      Shucks, check the formatting of that and try
                      again.
          </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="row">
                  <div className="col-lg-9 ml-lg-auto">
                    <a
                      onClick={this.createMemberTeam}
                      className="btn btn-primary font-weight-bold mr-2"
                    >
                      Save
          </a>
                    <button onClick={this.showFormAddMemberToTeam}
                      type="button"
                      className="btn btn-secondary"
                    >
                      Cancel
          </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)

    const elmFormUpdateTeam = (<div className="col-md-5 col-sm-12 animation">
      <div className="card card-custom">
        <div className="card-header flex-wrap border-0 pt-6 pb-0">
          <div className="card-title">
            <h3 className="card-label">Update team</h3>
          </div>
        </div>
        <div>
          <form className="form" onSubmit={this.updateTeam}>
            <div className="card-body cus-pd-b-0">
              <div className="form-group row ">
                <label className="col-form-label col-lg-3">
                  Name
          <span className="text-danger">*</span>
                </label>
                <div className="col-lg-9">
                  <input
                    key="hihii"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    className={
                      errors.name
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                  />
                  <div className="valid-feedback">
                    Success! You've done it.
          </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-form-label  col-lg-3 ">
                  Leader
                </label>
                <div className="col-lg-9 col-md-9 col-sm-12">
                  <Select
                    defaultValue={{ label: "Select Dept", value: 0 }}
                    name="option"
                    options={leaders}
                    value={this.state.emailSelected}
                    onChange={this.handleOnchange}
                  />
                  <div className="invalid-feedback">
                    Shucks, check the formatting of that and try
                    again.
          </div>
                </div>
              </div>
            </div>
            {this.state.formAddMemberToTeam ? elmFormCreateMemberToTeam : elmFormListMemberOfTeam}
            {this.state.formAddMemberToTeam ? '' : <div className="card-footer">
              <div className="row">
                <div className="col-lg-9 ml-lg-auto">
                  <button
                    type="submit"
                    className="btn btn-primary font-weight-bold mr-2"
                  >
                    Save
                </button>
                  <button onClick={this.closeFormUpdate}
                    type="button"
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>}
          </form>
        </div>
      </div>
    </div>)


    const elmForm = (this.state.formAddTeam ? elmFormCreateTeam : elmFormUpdateTeam)
    return (
      <div className="d-flex flex-column-fluid">
        {this.state.isLoading ? <Fbloader /> : null}
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        <div className="container container_user_cs dr_col">

          <div className="row">
            <div className="col-md-7 col-sm-12">
              
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">
                      List team
                      
                    </h3>
                  </div>
                  <div className="card-toolbar">
                   
                    <div className="dropdown dropdown-inline mr-2">
                     
                    </div>
                 
                  </div>
                </div>
                <div className="card-body">
                  <div
                    className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                    id="kt_datatable"
                    style={{ position: "static", zoom: 1 }}
                  >
                    <table
                      className="datatable-table"
                      style={{ display: "block" }}
                    >
                      <thead className="datatable-head">
                        <tr className="datatable-row" style={{ left: "0px" }}>
                          <th className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                            <span></span>
                          </th>
                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "130px" }}>Name</span>
                          </th>
                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "200px" }}>Leader</span>
                          </th>

                          <th
                            data-field="Actions"
                            data-autohide-disabled="false"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "90px" }}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="datatable-body" style={{}}>
                        {data.map((team, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr
                                key={index}
                                data-row={1}
                                className="datatable-row datatable-row-even"
                                style={{ left: "0px" }}
                              >
                                <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                  <span
                                    className="datatable-toggle-detail"
                                    onClick={this.showDetail.bind(this, index)}
                                  >
                                    <i
                                      className={this.state.classArr[index]}
                                    ></i>
                                  </span>
                                </td>
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                >
                                  <span style={{ width: "130px" }}>
                                    {team.name}
                                  </span>
                                </td>
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "200px" }}>
                                    {this.showEmailLeader(team.idLeader, team.Users)}
                                  </span>
                                </td>


                                <td
                                  data-field="Actions"
                                  data-autohide-disabled="false"
                                  aria-label="null"
                                  className="datatable-cell"
                                >
                                  <span
                                    style={{
                                      overflow: "visible",
                                      position: "relative",
                                      width: "90px",
                                    }}
                                  >
                                    <Link
                                      to={`#`}
                                      className="btn btn-sm btn-clean btn-icon mr-2"
                                      title="Edit user"
                                      onClick={() => this.toggleForm(team)}
                                    >
                                      <span className="svg-icon svg-icon-md">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          width="24px"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          version="1.1"
                                        >
                                          <g
                                            stroke="none"
                                            strokeWidth={1}
                                            fill="none"
                                            fillRule="evenodd"
                                          >
                                            <rect
                                              x={0}
                                              y={0}
                                              width={24}
                                              height={24}
                                            />
                                            <path
                                              d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                                              fill="#000000"
                                              fillRule="nonzero"
                                              transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "
                                            />
                                            <rect
                                              fill="#000000"
                                              opacity="0.3"
                                              x={5}
                                              y={20}
                                              width={15}
                                              height={2}
                                              rx={1}
                                            />
                                          </g>
                                        </svg>
                                      </span>
                                    </Link>
                                    <div
                                      onClick={this.toggleDeleteTeamPopup.bind(
                                        this,
                                        true,
                                        index
                                      )}
                                      ref={(ref) =>
                                        (this.deleteRef[index] = ref)
                                      }
                                      className="btn btn-sm btn-clean btn-icon"
                                      title="Delete user"
                                    >
                                      <span className="svg-icon svg-icon-md">
                                        <i className="la la-trash" />
                                      </span>
                                    </div>
                                    <Overlay
                                      show={
                                        this.state.isOpenDeleteUserPop[index]
                                      }
                                      target={this.deleteRef[index]}
                                      placement="right"
                                      rootClose={true}
                                      onHide={this.toggleDeleteTeamPopup.bind(
                                        this,
                                        false,
                                        index
                                      )}
                                      transition={false}
                                    >
                                      <Popover bsPrefix="popover popover_cs" id="popover-contained">
                                        <Popover.Title as="h3">
                                          Delete this team ?
                                        </Popover.Title>
                                        <Popover.Content>
                                          <div>
                                            <button onClick={this.removeTeam.bind(this, team.id)} type="button" className="btn btn-outline-danger btn-sm btn-sm-cs mr-2">Delete</button>
                                            <button onClick={this.toggleDeleteTeamPopup.bind(this, false, index)} type="button" className="btn btn-outline-secondary btn-sm btn-sm-cs">Cancel</button>
                                          </div>
                                        </Popover.Content>
                                      </Popover>
                                    </Overlay>
                                  </span>
                                </td>
                              </tr>
                              <tr
                                className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                              >
                                <td className="datatable-detail" colSpan="9">
                                  <table>
                                    <tbody>
                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Leader</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            {this.showEmailLeader(team.idLeader, team.Users)}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="datatable-pager datatable-paging-loaded fl_end">
                      <Pagination
                        defaultPageSize={this.state.pageSize}
                        current={this.state.pageNumber}
                        hideOnSinglePage={true}
                        showTitle={false}
                        onChange={this.handlePagination}
                        total={this.state.totalRow}
                        showLessItems={true}
                      />

                      <div className="datatable-pager-info my-2 mb-sm-0">
                        <span className="datatable-pager-detail">
                          Showing {this.state.start} -{" "}
                          {this.state.start + this.state.realSize - 1} of{" "}
                          {this.state.totalRow}
                        </span>
                      </div>
                    </div>
                  </div>
                
                </div>
              </div>
            
            </div>

          
            {elmForm}
          </div>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
  };
};

export default connect(mapStateToProps)(Team);