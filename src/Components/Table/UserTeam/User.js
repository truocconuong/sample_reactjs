import React, { Component } from "react";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "../style.css";
import Network from "../../../Service/Network";
import Fbloader from "../../libs/PageLoader/fbloader.js";
import Select from "react-select";

import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Validator from "../../../utils/validator.js";
import {
  rulesAddUser,
  rulesEditUser,
  rulesAddUserNotDirector,
  rulesEditUserNotDirector,
} from "../../../utils/rule.js";
import Slider from "react-slick";
import toastr from "toastr";
import { Nav } from "react-bootstrap";
import { defaultAva, domainServer } from "../../../utils/config.js";
import CustomToast from "../../common/CustomToast.js";
import { ToastContainer, toast, Zoom } from "react-toastify";

const api = new Network();
const customStyles = {
  menuList: (styles) => ({ ...styles, maxHeight: "130px" }),
};
toastr.options = {
  positionClass: "toast-top-right",
};

const settings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  focusOnSelect: false,
  draggable: false,
  swipe: false,
  arrows: false,
  className: "custom_slide",
};
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      isLoading: false,

      name: "",
      emailUser: "",
      password: "",
      roleId: {
        label: "",
        value: "",
      },
      teamId: {
        label: "",
        value: "",
      },
      listRole: [],
      listTeam: [],
      errors: {},
      isLoadingButtonAddUser: false,
      isLoadingButtonEditUser: false,
      isEditUser: false,
      isOpenDeleteUserPop: new Array(10).fill(false),
      // edit state
      nameEdit: "",
      emailUserEdit: "",
      passwordEdit: "",
      roleIdEdit: {
        label: "",
        value: "",
      },
      teamIdEdit: { label: "", value: "" },
      deleteRef: new Array(10),
      classToggleDetail: new Array(10).fill("show_mb"),
      classArr: new Array(10).fill("fa fa-caret-down"),
      isDirector: true,
    };
    this.deleteRef = [];

    this.handlePagination = this.handlePagination.bind(this);
    this.getDataUser = this.getDataUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.submitEditUser = this.submitEditUser.bind(this);

    // this.validatorEditUser = new Validator(rulesEditUser);
    // this.validatorEditUserNotDirector = new Validator(rulesEditUserNotDirector);
    this.resetForm = this.resetForm.bind(this);
    this.toggleEditUser = this.toggleEditUser.bind(this);
    this.toggleDeleteUserPop = this.toggleDeleteUserPop.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
  async handleDeleteUser(id) {
    try {
      const response = await api.delete(`/api/user/${id}`);
      if (response) {
        let self = this;
        console.log(response);
        toast(<CustomToast title={"Success!"} />, {
          position: toast.POSITION.TOP_RIGHT,
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
        this.toggleDeleteUserPop(false);
        setTimeout(() => {
          self.getDataUser();
        }, 500);
      }
    } catch (error) {
      console.log("err while delete user: ", error);
    }
  }

  toggleDeleteUserPop(isShow, index) {
    let self = this;
    let currentIsOpenDeleteUserPop = new Array(10).fill(false);
    this.setState(
      {
        isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
      },
      function () {
        if (isShow) {
          currentIsOpenDeleteUserPop[index] = isShow;
          self.setState({
            isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
          });
        }
      }
    );
  }
  toggleEditUser(isEdit, user) {
    let self = this;
    if (isEdit) {
      console.log(user);
      this.setState({
        idUserEdit: user.id,
        isEditUser: true,
        isDirector: user.Role.name === "Director" ? true : false,
        nameEdit: user.name,
        emailUserEdit: user.email,
        teamIdEdit: {
          label: user.teamId
            ? self.state.listTeam.length !== 0
              ? self.state.listTeam.find((e) => e.id == user.teamId).name
              : ""
            : "",
          value: user.teamId
            ? self.state.listTeam.length !== 0
              ? self.state.listTeam.find((e) => e.id == user.teamId).id + ""
              : user.teamId
            : "",
        }, //user.teamId ? user.teamId : "",
        roleIdEdit: {
          label: self.state.listRole.find((e) => e.id == user.Role.id).name,
          value: self.state.listRole.find((e) => e.id == user.Role.id).id,
        }, //user.Role.id,
        errors: {},
      });
      this.slide.slickGoTo(1, false);
    } else {
      this.slide.slickGoTo(0, false);
      this.setState({
        isEditUser: false,
        isDirector: true,
        email: "",
        name: "",
        password: "",
        roleId: {
          label: "",
          value: "",
        },
        teamId: {
          label: "",
          value: "",
        },
        errors: {},
      });
    }
  }
  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  resetForm() {
    this.setState({
      // reset input
      email: "",
      name: "",
      password: "",
      roleId: {
        label: "",
        value: "",
      },
      teamId: {
        label: "",
        value: "",
      },
      errors: {},
      isDirector: true,
    });
  }
  async submitEditUser(e) {
    e.preventDefault();
    if (!this.state.isDirector && this.props.role == "Director") {
      this.validatorEditUser = new Validator(rulesEditUserNotDirector); // validate cho role director
    } else {
      this.validatorEditUser = new Validator(rulesEditUser); // validate cho leader
    }
    const errors = this.validatorEditUser.validate(this.state);
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      console.log("submit form edit user");
      this.setState({
        isLoadingButtonEditUser: true,
      });

      try {
        let state = this.state;
        let self = this;
        let userEdit = {
          email: state.emailUserEdit,
          name: state.nameEdit,
          // password: state.passwordEdit,
          roleId: state.roleIdEdit.value,
          teamId: state.teamIdEdit.value === "" ? null : state.isDirector? null: state.teamIdEdit.value, // teamId khong bat buoc voi role = admin
        };
        // console.log(userEdit);
        const response = await api.patch(
          `/api/user/${state.idUserEdit}`,
          userEdit
        );
        if (response) {
          toast(<CustomToast title={"Success!"} />, {
            position: toast.POSITION.TOP_RIGHT,
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
          setTimeout(async () => {
            self.setState({
              isLoadingButtonEditUser: false,
            });
            await self.getDataUser();
          }, 1500);
        }
        // console.log(response);
      } catch (error) {
        console.log("err while submit form edit user: ", error.response);
        if (error.response.data.data.error === "PASSWORD_INCORRECT") {
          toastr.warning("Password incorrect!");
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              passwordEdit: error.response.data.data.message,
            },
            isLoadingButtonEditUser: false,
          }));
        }
      }
    } else {
      // co loi
      console.log(errors);
      return;
    }
  }
  async submitUser(e) {
    e.preventDefault();
    if (this.props.role === "Leader") {
      const idRoleMember = this.state.listRole.find((e) => e.name == "Member")
        .id;
      // const roleId = this.state.listRole[0].id;
      await this.setState({
        roleId: {
          label: "Member",
          value: idRoleMember,
        },
      });
    }

    if (!this.state.isDirector && this.props.role == "Director") {
      this.validator = new Validator(rulesAddUserNotDirector); // validate cho role director
    } else {
      this.validator = new Validator(rulesAddUser); // validate cho leader
    }
    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      console.log("submit form");
      this.setState({
        isLoadingButtonAddUser: true,
      });
      try {
        let state = this.state;
        let self = this;
        let newUser = {
          email: state.emailUser,
          name: state.name,
          password: state.password,
          roleId: state.roleId.value,
          teamId: state.teamId.value === "" ? null : state.teamId.value, // teamId khong bat buoc voi role = admin
        };
        console.log(newUser)
        const response = await api.post(`/api/register`, newUser);
        if (response) {
          toast(<CustomToast title={"Success!"} />, {
            position: toast.POSITION.TOP_RIGHT,
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
          setTimeout(async () => {
            self.resetForm();
            self.setState({
              isLoadingButtonAddUser: false,
            });
            await self.getDataUser();
          }, 1500);
        }
        // console.log(response);
      } catch (error) {
        console.log("err while submit form new user: ", error.response);
        if (error.response.data.data.error === "Email already exitsts!") {
          toastr.warning("Email already exitsts!");
          this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              emailUser: "Email already exitsts!",
            },
            isLoadingButtonAddUser: false,
          }));
        }
      }
    } else {
      // co loi
      console.log(errors);
      return;
    }
  }
  handleSelect(e, type) {
    let { value, label } = e;
    value += "";
    if (type == "roleId") {
      if (this.props.role == "Director" && this.state.listRole.length != 0) {
        // role director
        const idRoleDirector = this.state.listRole.find(
          (e) => e.name == "Director"
        ).id;
        if (value != idRoleDirector) {
          //với roleId không phải là Director
          this.setState({
            roleId: {
              label: label,
              value: value,
            },
            isDirector: false, // biến này để xác định nếu là Director thì k bắt buộc chọn Team
          });
        } else if (value == idRoleDirector) {
          // với roleId là Director
          this.setState({
            roleId: {
              label: label,
              value: value,
            },
            isDirector: true,
          });
        }
      }
    } else if (type == "teamId") {
      this.setState({
        teamId: {
          label: label,
          value: value,
        },
      });
    } else if (type == "roleIdEdit") {
      if (this.props.role == "Director" && this.state.listRole.length != 0) {
        // role director
        const idRoleDirector = this.state.listRole.find(
          (e) => e.name == "Director"
        ).id;
        if (value != idRoleDirector) {
          //với roleId không phải là Director
          this.setState({
            roleIdEdit: {
              label: label,
              value: value,
            },
            isDirector: false, // biến này để xác định nếu là Director thì k bắt buộc chọn Team
          });
        } else if (value == idRoleDirector) {
          // với roleId là Director
          this.setState({
            roleIdEdit: {
              label: label,
              value: value,
            },
            isDirector: true,
          });
        }
      }
    } else if (type == "teamIdEdit") {
      this.setState({
        teamIdEdit: {
          label: label,
          value: value,
        },
      });
    }

    console.log(label, value, this.state.isDirector);
    // console.log(this.props.role);
  }
  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    // console.log(name, value);
    // console.log(this.state.listRole);
    this.setState({
      [name]: value,
    });
    // if (this.props.role == "Director" && this.state.listRole.length != 0) {
    //   const idRoleDirector = this.state.listRole.find(
    //     (e) => e.name == "Director"
    //   ).id;
    //   if (name == "roleId" && value != idRoleDirector) {
    //     this.setState({
    //       [name]: value,
    //       isDirector: false,
    //     });
    //   } else if (name == "roleId" && value == idRoleDirector) {
    //     this.setState({
    //       [name]: value,
    //       isDirector: true,
    //     });
    //   } else {
    //     this.setState({
    //       [name]: value,
    //     });
    //   }
    // } else {
    //   this.setState({
    //     [name]: value,
    //   });
    // }
  }
  displayRole(role) {
    switch (role.name) {
      case "Director":
        return (
          <span className="label font-weight-bold label-lg  label-light-danger label-inline">
            {role.name}
          </span>
        );

      case "Leader":
        return (
          <span className="label font-weight-bold label-lg  label-light-success label-inline">
            {role.name}
          </span>
        );

      case "Member":
        return (
          <span className="label font-weight-bold label-lg  label-light-primary label-inline">
            {role.name}
          </span>
        );

      default:
        return null;
    }
  }
  async getDataUser() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
        isOpenDeleteUserPop: new Array(10).fill(false),
        classToggleDetail: new Array(10).fill("show_mb"),
        classArr: new Array(10).fill("fa fa-caret-down"),
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      if (this.props.role === "Director") {
        const [listUser, listRole, listTeam] = await Promise.all([
          api.get(
            `/api/admin/user?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
          ),
          api.get(`/api/all/role`),
          api.get(`/api/all/team`),
        ]);
        if (listUser && listRole && listTeam) {
          self.setState({
            data: listUser.data.list,
            totalRow: listUser.data.total,
            start: start,
            realSize: listUser.data.list.length,
            listRole: listRole.data.roles,
            listTeam: listTeam.data.teams,
          });
          // console.log(listTeam);
          setTimeout(() => {
            self.setState({
              isLoading: false,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            self.setState({
              isLoading: false,
            });
          }, 1000);
        }
      } else {
        const [listUser, listRole] = await Promise.all([
          api.get(
            `/api/admin/user?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
          ),
          api.get(`/api/all/role`),
        ]);
        if (listUser && listRole) {
          self.setState({
            data: listUser.data.list,
            totalRow: listUser.data.total,
            start: start,
            realSize: listUser.data.list.length,
            listRole: listRole.data.roles,
          });
          // console.log(listRole.data.roles);
          setTimeout(() => {
            self.setState({
              isLoading: false,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            self.setState({
              isLoading: false,
            });
          }, 1000);
        }
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log("Err in list memeber: ", err.response);
    }
  }
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
    });
    this.getDataUser();
  }
  componentDidMount() {
    if (window.innerWidth <= 768) {
      this.setState({
        screen: "mobile",
      });
    }
    this.getDataUser();
  }

  render() {
    const data = this.state.data;
    const state = this.state;
    const errors = this.state.errors;
    return (
      <div className="d-flex flex-column-fluid">
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />

        {this.state.isLoading ? <Fbloader /> : null}
        <div className="container d-flex container_user_cs dr_col">
          <div className="col-xl-8 pl-0 plm_0 prm_0 mb-3">
            <div className="card card-custom">
              <div className="card-header flex-wrap border-0 pt-6 pb-0">
                <div className="card-title">
                  <h3 className="card-label">
                    User Management
                    <span className="d-block text-muted pt-2 font-size-sm">
                      User management made easy
                    </span>
                  </h3>
                </div>
                <div className="card-toolbar">
                  <div className="dropdown dropdown-inline mr-2"></div>

                  {state.isEditUser ? (
                    <div
                      className="btn btn-primary font-weight-bolder"
                      onClick={this.toggleEditUser.bind(this, false)}
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
                            <rect x={0} y={0} width={24} height={24} />
                            <circle fill="#000000" cx={9} cy={15} r={6} />
                            <path
                              d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z"
                              fill="#000000"
                              opacity="0.3"
                            />
                          </g>
                        </svg>
                      </span>
                      Add new user
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="card-body">
                <div
                  className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                  id="kt_datatable"
                  style={{}}
                >
                  <table
                    className="datatable-table"
                    style={{ display: "block" }}
                  >
                    <thead className="datatable-head">
                      <tr className="datatable-row">
                        <th className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                          <span></span>
                        </th>
                        <th
                          data-field="OrderID"
                          className="datatable-cell datatable-cell-sort"
                        >
                          <span style={{ width: "314px" }}>Name</span>
                        </th>
                        <th
                          data-field="Country"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "158px" }}>Team</span>
                        </th>

                        <th
                          data-field="Status"
                          className="datatable-cell datatable-cell-sort datatable-cell-sorted hide_mb"
                          data-sort="asc"
                        >
                          <span style={{ width: "120px" }}>Role</span>
                        </th>
                        <th
                          data-field="Actions"
                          data-autohide-disabled="false"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "130px" }}>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="datatable-body" style={{}}>
                      {data.map((user, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr
                              data-row={9}
                              className="datatable-row datatable-row-even"
                              style={{ left: "0px" }}
                            >
                              <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                <span
                                  className="datatable-toggle-detail"
                                  onClick={this.showDetail.bind(this, index)}
                                >
                                  <i className={this.state.classArr[index]}></i>
                                </span>
                              </td>
                              <td
                                data-field="OrderID"
                                aria-label="69072-090"
                                className="datatable-cell"
                              >
                                <span style={{ width: "314px" }}>
                                  <div className="d-flex align-items-center">
                                    <div className="symbol symbol-50 symbol-light mr-2">
                                      <span className="symbol-label symbol-label-cs">
                                        <img
                                          src={
                                            user.linkAvatar
                                              ? domainServer +
                                                "/" +
                                                user.linkAvatar
                                              : defaultAva
                                          }
                                          className="h-100 align-self-center"
                                          alt=""
                                        />
                                      </span>
                                    </div>
                                    <div className="ml-4">
                                      <div
                                        onClick={() => {
                                          this.props.history.push(
                                            `/profile/${user.id}`
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className="text-hover-primary text-dark-75 font-weight-bolder font-size-lg mb-0"
                                      >
                                        {user.name}
                                      </div>
                                      <div className="text-muted font-weight-bold ">
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                </span>
                              </td>
                              <td
                                data-field="Country"
                                aria-label="Thailand"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "158px" }}>
                                  <div className="font-weight-bolder font-size-lg mb-0">
                                    {user.Team ? user.Team.name : null}
                                  </div>
                                </span>
                              </td>

                              <td
                                className="datatable-cell-sorted datatable-cell hide_mb"
                                data-field="Status"
                                aria-label={1}
                              >
                                <span style={{ width: "120px" }}>
                                  {this.displayRole(user.Role)}
                                </span>
                              </td>
                              <td
                                data-field="Actions"
                                data-autohide-disabled="false"
                                aria-label="null"
                                className="datatable-cell hide_mb"
                              >
                                <span
                                  style={{
                                    overflow: "visible",
                                    position: "relative",
                                    width: "130px",
                                  }}
                                >
                                  <span
                                    onClick={this.toggleEditUser.bind(
                                      this,
                                      true,
                                      user
                                    )}
                                    className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2"
                                    title="Edit details"
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
                                            d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "
                                          />
                                          <path
                                            d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            opacity="0.3"
                                          />
                                        </g>
                                      </svg>
                                    </span>
                                  </span>
                                  <span
                                    onClick={this.toggleDeleteUserPop.bind(
                                      this,
                                      true,
                                      index
                                    )}
                                    ref={(ref) => (this.deleteRef[index] = ref)}
                                    className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon"
                                    title="Delete"
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
                                  </span>

                                  <Overlay
                                    show={this.state.isOpenDeleteUserPop[index]}
                                    target={this.deleteRef[index]}
                                    placement="right"
                                    rootClose={true}
                                    onHide={this.toggleDeleteUserPop.bind(
                                      this,
                                      false,
                                      index
                                    )}
                                    transition={false}
                                  >
                                    <Popover
                                      bsPrefix="popover popover_cs"
                                      id="popover-contained"
                                    >
                                      <Popover.Title as="h3">
                                        Delete this user ?
                                      </Popover.Title>
                                      <Popover.Content>
                                        <div>
                                          <button
                                            onClick={this.handleDeleteUser.bind(
                                              this,
                                              user.id
                                            )}
                                            type="button"
                                            className="btn btn-outline-danger btn-sm btn-sm-cs mr-2"
                                          >
                                            Delete
                                          </button>
                                          <button
                                            onClick={this.toggleDeleteUserPop.bind(
                                              this,
                                              false,
                                              index
                                            )}
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm btn-sm-cs"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </Popover.Content>
                                    </Popover>
                                  </Overlay>
                                </span>
                              </td>
                            </tr>
                            {this.state.screen == "mobile" ? (
                              <tr
                                className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                              >
                                <td
                                  style={{ padding: "0", width: "100%" }}
                                  className="datatable-detail"
                                  colSpan="9"
                                >
                                  <table style={{ width: "100%" }}>
                                    <tbody>
                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>
                                            {" "}
                                            {user.Team ? user.Team.name : null}
                                          </span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            {this.displayRole(user.Role)}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Actions</span>
                                        </td>
                                        <td
                                          className="datatable-cell-sorted datatable-cell"
                                          data-field="Status"
                                          aria-label={1}
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            <span
                                              style={{
                                                overflow: "visible",
                                                position: "relative",
                                                width: "130px",
                                              }}
                                            >
                                              <span
                                                onClick={this.toggleEditUser.bind(
                                                  this,
                                                  true,
                                                  user
                                                )}
                                                className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2"
                                                title="Edit details"
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
                                                        d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                        transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "
                                                      />
                                                      <path
                                                        d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                        opacity="0.3"
                                                      />
                                                    </g>
                                                  </svg>
                                                </span>
                                              </span>
                                              <span
                                                onClick={this.toggleDeleteUserPop.bind(
                                                  this,
                                                  true,
                                                  index
                                                )}
                                                ref={(ref) =>
                                                  (this.deleteRef[index] = ref)
                                                }
                                                className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon"
                                                title="Delete"
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
                                              </span>

                                              <Overlay
                                                show={
                                                  this.state
                                                    .isOpenDeleteUserPop[index]
                                                }
                                                target={this.deleteRef[index]}
                                                placement="right"
                                                rootClose={true}
                                                onHide={this.toggleDeleteUserPop.bind(
                                                  this,
                                                  false,
                                                  index
                                                )}
                                                transition={false}
                                              >
                                                <Popover
                                                  bsPrefix="popover popover_cs"
                                                  id="popover-contained"
                                                >
                                                  <Popover.Title as="h3">
                                                    Delete this user ?
                                                  </Popover.Title>
                                                  <Popover.Content>
                                                    <div>
                                                      <button
                                                        onClick={this.handleDeleteUser.bind(
                                                          this,
                                                          user.id
                                                        )}
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm btn-sm-cs mr-2"
                                                      >
                                                        Delete
                                                      </button>
                                                      <button
                                                        onClick={this.toggleDeleteUserPop.bind(
                                                          this,
                                                          false,
                                                          index
                                                        )}
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm btn-sm-cs"
                                                      >
                                                        Cancel
                                                      </button>
                                                    </div>
                                                  </Popover.Content>
                                                </Popover>
                                              </Overlay>
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            ) : null}
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
          <div className="col-xl-4 p=0 plm_0 prm_0 ">
            <Slider ref={(c) => (this.slide = c)} {...settings}>
              <div className="card card-custom ">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">Add new user</h3>
                  </div>
                </div>
                <div>
                  <form
                    onSubmit={this.submitUser}
                    autoComplete="off"
                    className="form"
                  >
                    <div className="card-body">
                      <div className="form-group row ">
                        <label className="col-form-label col-lg-3">
                          Name
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-9">
                          <input
                            name="name"
                            onChange={this.handleInputChange}
                            type="text"
                            className={
                              errors.name
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            autoComplete="off"
                            value={state.name}
                            required
                          />
                        </div>
                      </div>

                      <input
                        type="password"
                        style={{ opacity: 0, position: "absolute" }}
                      />

                      <div className="form-group row ">
                        <label className="col-form-label col-lg-3">
                          Email
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-9">
                          <input
                            name="emailUser"
                            onChange={this.handleInputChange}
                            type="email"
                            className={
                              errors.emailUser
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            autoComplete="off"
                            value={state.emailUser}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group row ">
                        <label className="col-form-label col-lg-3">
                          Password
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-9">
                          <input
                            name="password"
                            onChange={this.handleInputChange}
                            type="password"
                            className={
                              errors.password
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            autoComplete="off"
                            value={state.password}
                            required
                          />
                        </div>
                      </div>
                      {this.props.role === "Director" ? (
                        <div>
                          <div className="form-group row">
                            <label className="col-form-label  col-lg-3 ">
                              Role
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-9 col-md-9 col-sm-12">
                              <Select
                                name="roleId"
                                className={
                                  errors.roleId ? "invalid-selected" : ""
                                }
                                options={state.listRole.map((role, index) => {
                                  return {
                                    value: role.id,
                                    label: role.name,
                                  };
                                })}
                                value={state.roleId}
                                onChange={(e) => this.handleSelect(e, "roleId")}
                                styles={customStyles}
                              />
                            </div>
                          </div>

                          {!this.state.isDirector ? (
                            <div className="form-group row">
                              <label className="col-form-label  col-lg-3 ">
                                Team
                                {this.state.isDirector ? null : (
                                  <span className="text-danger">*</span>
                                )}
                              </label>
                              <div className="col-lg-9 col-md-9 col-sm-12">
                                <Select
                                  name="teamId"
                                  className={
                                    errors.teamId ? "invalid-selected" : ""
                                  }
                                  options={state.listTeam.map((team, index) => {
                                    return {
                                      value: team.id,
                                      label: team.name,
                                    };
                                  })}
                                  value={state.teamId}
                                  onChange={(e) =>
                                    this.handleSelect(e, "teamId")
                                  }
                                  styles={customStyles}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <div className="col-lg-9 ml-lg-auto">
                          <button
                            type="submit"
                            className={
                              this.state.isLoadingButtonAddUser
                                ? "btn btn-primary font-weight-bold mr-2  spinner spinner-right spinner-white pr-15"
                                : "btn btn-primary font-weight-bold mr-2"
                            }
                          >
                            {this.state.isLoadingButtonAddUser
                              ? "Please wait"
                              : "Add user"}
                          </button>
                          <div
                            onClick={this.resetForm}
                            className="btn btn-light-primary font-weight-bold"
                          >
                            Clear
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card card-custom ">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">Edit user</h3>
                  </div>
                </div>
                <div>
                  <form
                    onSubmit={this.submitEditUser}
                    autoComplete="off"
                    className="form"
                  >
                    <div className="card-body">
                      <div className="form-group row ">
                        <label className="col-form-label col-lg-3">
                          Name
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-9">
                          <input
                            name="nameEdit"
                            onChange={this.handleInputChange}
                            type="text"
                            className={
                              errors.nameEdit
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            autoComplete="off"
                            value={state.nameEdit}
                            required
                          />
                        </div>
                      </div>

                      <input
                        type="password"
                        style={{ opacity: 0, position: "absolute" }}
                      />

                      <div className="form-group row ">
                        <label className="col-form-label col-lg-3">
                          Email
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-9">
                          <input
                            name="emailUserEdit"
                            onChange={this.handleInputChange}
                            type="email"
                            className={
                              errors.emailUserEdit
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            autoComplete="off"
                            value={state.emailUserEdit}
                            required
                          />
                        </div>
                      </div>

                      {this.props.role === "Director" ? (
                        <div>
                          <div className="form-group row">
                            <label className="col-form-label  col-lg-3 ">
                              Role
                              <span className="text-danger">*</span>
                            </label>
                            <div className="col-lg-9 col-md-9 col-sm-12">
                              <Select
                                name="roleIdEdit"
                                className={
                                  errors.roleIdEdit ? "invalid-selected" : ""
                                }
                                options={state.listRole.map((role, index) => {
                                  return {
                                    value: role.id,
                                    label: role.name,
                                  };
                                })}
                                value={state.roleIdEdit}
                                onChange={(e) =>
                                  this.handleSelect(e, "roleIdEdit")
                                }
                                styles={customStyles}
                              />
                            </div>
                          </div>

                          {!state.isDirector ? (
                            <div className="form-group row">
                              <label className="col-form-label  col-lg-3 ">
                                Team
                                {this.state.isDirector ? null : (
                                  <span className="text-danger">*</span>
                                )}
                              </label>
                              <div className="col-lg-9 col-md-9 col-sm-12">
                                <Select
                                  name="teamIdEdit"
                                  className={
                                    errors.teamIdEdit ? "invalid-selected" : ""
                                  }
                                  options={state.listTeam.map((team, index) => {
                                    return {
                                      value: team.id,
                                      label: team.name,
                                    };
                                  })}
                                  value={state.teamIdEdit}
                                  onChange={(e) =>
                                    this.handleSelect(e, "teamIdEdit")
                                  }
                                  styles={customStyles}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <div className="col-lg-5 ml-lg-auto mr-lg-auto d-flex center">
                          <button
                            type="submit"
                            className={
                              this.state.isLoadingButtonEditUser
                                ? "btn btn-primary font-weight-bold  spinner spinner-right spinner-white pr-15"
                                : "btn btn-primary font-weight-bold "
                            }
                          >
                            {this.state.isLoadingButtonEditUser
                              ? "Please wait"
                              : "Save change"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
