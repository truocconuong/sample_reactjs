import React, { Component } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import { Popover as PopoverPop, PopoverHeader, PopoverBody } from "reactstrap";
import Popover from "react-bootstrap/Popover";

import Select from "react-select";
import moment from "moment";
import { formatDateInput, formatDate } from "../../utils/common/convertDate";
import Network from "../../Service/Network";
import { toast, ToastContainer } from "react-toastify";
import Validator from "../../utils/validator";
import { rulesAddTask } from "../../utils/rule";
import _ from "lodash";
import Fbloader from "../libs/PageLoader/fbloader";
import { defaultAva, domainServer } from "../../utils/config";
import { connect } from "react-redux";

const api = new Network();

const tags = [
  { label: "Monthly", value: "Monthly" },
  { label: "Weekly", value: "Weekly" },
  { label: "Urgent", value: "Urgent" },
];

const statuses = [
  { label: "New", value: "New" },
  { label: "Progress", value: "Progress" },
  { label: "Done", value: "Done" },
];

class SubTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDeleteUserPop: new Array(10).fill(false),
      classArrModal: new Array(10).fill("fa fa-caret-down"),
      classToggleDetailModal: new Array(10).fill("show_mb"),
      dataTask: {},
      dataSubtask: [],
      showAddModal: false,
      showEditModal: false,
      isLoading: false,
      dataSubtaskModal: {
        title: "",
        content: "",
        startDate: "",
        dueDate: "",
        status: "",
        tag: "",
      },
      errors: {},
      dataUserAssignJob: [],
      userAssign: [],
      // delete user assign
      isOpen: false,
      idUserDelete: "",
      isLoadingAssign: false,
      showAssignUser: false,
    };
    this.validator = new Validator(rulesAddTask);
    this.showInfoMember = [];
  }

  getInitData = async () => {
    try {
      let response = await api.get(`/api/assign/list/user`);

      const getTask = await api.get(
        `/api/v1/list-task/${this.props.match.params.id}`
      );
      const getSubtask = await api.get(
        `/api/v1/sub-task/${this.props.match.params.id}?pageSize=10&pageNumber=1`
      );
      const dataTask = getTask.data.listTask;
      dataTask["status"] = {
        label: dataTask["status"],
        value: dataTask["status"],
      };

      if (dataTask["tag"] !== null) {
        dataTask["tag"] = {
          label: dataTask["tag"],
          value: dataTask["tag"],
        };
      } else {
        dataTask["tag"] = {
          label: "",
          value: "",
        };
      }

      const subtask = getSubtask.data.listTask.map(function (item) {
        item["status"] = {
          label: item["status"],
          value: item["status"],
        };

        if (item["tag"] !== null) {
          item["tag"] = {
            label: item["tag"],
            value: item["tag"],
          };
        } else {
          item["tag"] = {
            label: "",
            value: "",
          };
        }
        return item;
      });

      // console.log("title", subtask);

      this.setState({
        dataTask,
        dataSubtask: subtask,
        isLoading: false,
        dataUserAssignJob: dataTask.Users,
      });
    } catch (error) {
      console.log("ERROR get data =====>", error.message);
    }
  };

  getUserAssign = async () => {
    // dung để lấy danh sách các user để assign
    try {
      let response = await api.get(`/api/v1/all/assign/list/user`);
      if (response.data.success) {
        this.setState({
          userAssign: response.data.user,
        });
      }
    } catch (err) {
      console.log(err);
    }
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

  confirmDelete = (userId, index) => {
    this.toggleDeleteUserPop(index);
    this.setState({
      isOpen: true,
      idUserDelete: userId,
    });
  };

  toggleAssignUser = () => {
    this.setState({
      showAssignUser: !this.state.showAssignUser,
    });
  };

  handleOnchange = async (event) => {
    this.setState({
      isLoadingAssign: true,
    });
    const idJob = this.props.match.params.id;
    const { dataUserAssignJob } = this.state;
    let check = dataUserAssignJob.find((item) => {
      return item.TaskUser.userId === event.value;
    });
    if (check) {
      toast.error("User has been assigned", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setState({
        isLoadingAssign: false,
      });
    } else {
      try {
        let response = await api.post(`/api/v1/list-task/${idJob}/user`, {
          userId: event.value,
        });
        toast.success("Add assign user successful!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        this.getInitData();
      } catch (err) {
        toast.error("Something went wrong please try again later!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(err);
      }
      this.setState({
        isLoadingAssign: false,
      });
    }
  };

  handleDeleteAssignUser = async (userId, index) => {
    const taskId = this.props.match.params.id;
    try {
      const response = await api.delete(
        `/api/v1/task/${taskId}/user/${userId}`
      );
      toast.success("Delete user assign successful!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.getInitData();
      this.toggleDeleteUserPop(index);
      this.setState({
        isOpen: true,
        idUserDelete: userId,
      });
    } catch (e) {
      console.log("ERROR delete delete user assign====>", e.message);
    }
  };

  defaultModal = () => {
    const empty = {
      title: "",
      content: "",
      startDate: "",
      dueDate: "",
      status: "",
      tag: "",
    };

    this.setState({
      dataSubtaskModal: empty,
      errors: {},
    });
  };

  handleAddSubtask = () => {
    this.setState({
      showAddModal: true,
    });
    this.defaultModal();
  };

  handleCloseAddModal = () => {
    this.setState({
      showAddModal: false,
    });
  };

  handleCloseEditModal = () => {
    this.setState({
      showEditModal: false,
    });
  };

  handleEditSubtask = (subtask) => {
    this.setState({
      showEditModal: true,
      dataSubtaskModal: subtask,
    });
  };

  handleDeleteSubtask = async (id) => {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.delete(`/api/v1/list-task/${id}`);
      toast.success("Delete subtask successful!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.setState({
        isLoading: false,
      });
      this.getInitData();
    } catch (error) {
      console.log("ERROR delete task =====>", error.message);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;

    const dataTask = this.state.dataTask;
    dataTask[name] = value;
    this.setState({
      dataTask,
    });
  };

  handleInputChangeModal = (e) => {
    const { name, value } = e.target;
    const { errors } = this.state;
    delete errors[name];
    const dataSubtaskModal = this.state.dataSubtaskModal;
    dataSubtaskModal[name] = value;
    this.setState({
      dataSubtaskModal,
      errors,
    });
  };

  handleSelected = (name, value) => {
    const dataTask = this.state.dataTask;
    dataTask[name] = value;
    // errors
    this.setState({
      dataTask,
    });
  };

  handleSelectedModal = (name, value) => {
    const { errors } = this.state;
    const dataSubtaskModal = this.state.dataSubtaskModal;
    dataSubtaskModal[name] = {
      label: value.value,
      value: value.value,
    };
    delete errors[name];
    this.setState({
      dataSubtaskModal,
      errors,
    });
  };

  handleSubmitAddModal = async (e) => {
    e.preventDefault();
    this.handleSubmitModal(
      "add",
      "/api/v1/sub-task",
      "Add subtask successful!"
    );
  };

  handleSubmitEditModal = (id) => {
    this.handleSubmitModal(
      "edit",
      `/api/v1/list-task/${id}`,
      "Add subtask successful!"
    );
  };

  handleSubmitModal = async (type, url, message) => {
    const { dataSubtaskModal } = this.state;
    const errors = this.validator.validate(this.state.dataSubtaskModal);

    if (
      moment(dataSubtaskModal.dueDate).isBefore(
        moment(dataSubtaskModal.startDate),
        "day"
      )
    ) {
      errors.dueDate =
        "Due date needs to be greater than or equal to the Start date.";
    }
    this.setState({
      errors,
      isLoading: true,
    });
    if (_.isEmpty(errors)) {
      let submitAddSubtask = this.state.dataSubtaskModal;
      submitAddSubtask["status"] = submitAddSubtask["status"].value;
      if (submitAddSubtask["tag"] !== null) {
        submitAddSubtask["tag"] = submitAddSubtask["tag"].value;
      }
      if (type === "add") {
        submitAddSubtask["parentId"] = this.props.match.params.id;
      }

      const submit = {
        title: submitAddSubtask.title,
        content: submitAddSubtask.content,
        startDate: submitAddSubtask.startDate,
        dueDate: submitAddSubtask.dueDate,
        status: submitAddSubtask.status.value,
        tag: submitAddSubtask.tag,
      };

      try {
        if (type === "add") {
          const response = await api.post(url, submitAddSubtask);
        } else {
          const response = await api.patch(url, submit);
        }
        toast.success(message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          showAddModal: false,
          showEditModal: false,
        });
        this.getInitData();
      } catch (e) {
        console.log("ERROR ADD TASK =====> ", e.message);
      }
    }
    this.setState({
      isLoading: false,
    });
  };

  handleSubmit = async () => {
    const { dataTask } = this.state;
    const errors = this.validator.validate(this.state.dataTask);
    if (moment(dataTask.dueDate).isBefore(moment(dataTask.startDate), "day")) {
      errors.dueDate =
        "Due date needs to be greater than or equal to the Start date.";
    }
    this.setState({
      errors,
    });
    if (_.isEmpty(errors)) {
      let submitUpdateTask = this.state.dataTask;
      if (submitUpdateTask["tag"] !== null) {
        submitUpdateTask["tag"] = submitUpdateTask["tag"].value;
      }

      const submit = {
        title: submitUpdateTask.title,
        content: submitUpdateTask.content,
        startDate: submitUpdateTask.startDate,
        dueDate: submitUpdateTask.dueDate,
        status: submitUpdateTask.status.value,
        tag: submitUpdateTask.tag,
      };

      try {
        const response = await api.patch(
          `/api/v1/list-task/${this.props.match.params.id}`,
          submit
        );
        toast.success("Update task successful!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.props.history.push("/task");
      } catch (e) {
        console.log("ERROR ADD TASK =====> ", e.message);
      }
    }
  };

  showDetailModal(index) {
    let currentClass = this.state.classToggleDetailModal;
    let currentClassArr = this.state.classArrModal;
    if (this.state.classToggleDetailModal[index] === "hide_mb") {
      currentClass[index] = "show_mb";
      currentClassArr[index] = "fa fa-caret-down";
      this.setState({
        classToggleDetailModal: currentClass,
        classArrModal: currentClassArr,
      });
    } else {
      currentClassArr[index] = "fa fa-caret-right";
      currentClass[index] = "hide_mb";
      this.setState({
        classToggleDetailModal: currentClass,
        classArrModal: currentClassArr,
      });
    }
  }

  componentDidMount() {
    this.getInitData();
    this.getUserAssign();
  }
  render() {
    const {
      dataTask,
      showAddModal,
      showEditModal,
      dataSubtask,
      dataSubtaskModal,
      dataUserAssignJob,
      userAssign,
      isLoading,
      errors,
    } = this.state;

    const optUser = userAssign.map((user) => {
      return { label: user.name, value: user.id };
    });

    return (
      <>
        <div style={{ width: "100%" }}>
          <div className={`d-flex flex-column flex-row-fluid wrapper pl_100`}>
            <div className="content d-flex flex-column flex-column-fluid">
              {isLoading ? <Fbloader /> : null}
              <div className="d-flex flex-column-fluid">
                <div className="container">
                  <div className="card card-custom">
                    <div className="card-header flex-wrap border-0 pt-6 pb-0">
                      <div className="card-title responsive-title-page">
                        <h3 style={{ width: "160px" }} className="card-label">
                          Edit Task
                        </h3>
                        {/* user */}
                        <div
                          style={{ margin: 0 }}
                          className="assign-user-css responsive-user"
                        >
                          {dataUserAssignJob.map((user, index) => {
                            if (!user.isFirst) {
                              return (
                                <div key={index}>
                                  <Overlay
                                    show={this.state.isOpenDeleteUserPop[index]}
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
                                      <Popover.Content className="custom-popver-kitin">
                                        <div>
                                          <p className="text-center">
                                            {user.email}
                                          </p>
                                          {this.props.role === "Admin" ? (
                                            <Button
                                              onClick={() =>
                                                this.handleDeleteAssignUser(
                                                  user.TaskUser.UserId,
                                                  index
                                                )
                                              }
                                              style={{ width: "100%" }}
                                              className="btn btn-primary"
                                            >
                                              Remove
                                            </Button>
                                          ) : (
                                            ""
                                          )}
                                        </div>

                                        {this.props.role === "Leader" ? (
                                          <span
                                            className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon"
                                            title="Delete"
                                            onClick={() =>
                                              this.confirmDelete(
                                                user.TaskUser.userId,
                                                index
                                              )
                                            }
                                          >
                                            <span className="svg-icon svg-icon-md svg-icon-primary">
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
                                        ) : null}
                                      </Popover.Content>
                                    </Popover>
                                  </Overlay>
                                </div>
                              );
                            } else {
                              return (
                                <div key={index}>
                                  <Overlay
                                    show={this.state.isOpenDeleteUserPop[index]}
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
                                      <Popover.Content className="custom-popver-kitin">
                                        <p>{user.name}bbbbbbbbbbb</p>
                                      </Popover.Content>
                                    </Popover>
                                  </Overlay>
                                </div>
                              );
                            }
                          })}
                          {dataUserAssignJob.map((user, index) => {
                            return (
                              <div
                                key={index}
                                ref={(ref) =>
                                  (this.showInfoMember[index] = ref)
                                }
                                onMouseOver={this.toggleDeleteUserPop.bind(
                                  this,
                                  index
                                )}
                                className="btn btn-md btn-icon btn-pill mr-2 custom-pointer"
                              >
                                {user.linkAvatar ? (
                                  <img
                                    src={`${domainServer}/${user.linkAvatar}`}
                                    className="h-100 align-self-end w-100"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={defaultAva}
                                    className="h-100 align-self-end"
                                    alt=""
                                  />
                                )}
                              </div>
                            );
                          })}

                          {this.state.isLoadingAssign ? (
                            <div
                              className="btn btn-md btn-icon btn-pill font-size-sm spinner spinner-primary spinner-left mr-2"
                              style={{
                                cursor: "wait",
                              }}
                            ></div>
                          ) : null}

                          <PopoverPop
                            popperClassName="popover-modal-card"
                            trigger="legacy"
                            placement="bottom"
                            isOpen={this.state.showAssignUser}
                            target={`Popover-khanhdeptrai`}
                            toggle={this.toggleAssignUser}
                          >
                            <PopoverBody>
                              {this.state.isLoadingAssign ? (
                                <Select
                                  options={optUser}
                                  onChange={this.handleOnchange}
                                  isDisabled
                                />
                              ) : (
                                <Select
                                  options={optUser}
                                  onChange={this.handleOnchange}
                                  closeMenuOnSelect={true}
                                />
                              )}
                            </PopoverBody>
                          </PopoverPop>

                          <div
                            id={`Popover-khanhdeptrai`}
                            className={
                              this.props.role === "Member"
                                ? "btn btn-md btn-icon btn-light-facebook btn-pill mr-2 off-button-add-user"
                                : "btn btn-md btn-icon btn-light-facebook btn-pill mr-2"
                            }
                            data-toggle="tooltip"
                            title=""
                            data-original-title="More users"
                          >
                            <i className="fas fa-plus"></i>
                          </div>
                        </div>
                        {/* </div> */}
                      </div>
                      <div className="card-toolbar">
                        <Button
                          style={{ margin: "0 5px" }}
                          variant="secondary"
                          onClick={() => this.props.history.push("/task")}
                        >
                          Back
                        </Button>
                        {this.props.role === "Admin" ? (
                          <Button
                            style={{ margin: "0 5px" }}
                            variant="primary"
                            onClick={this.handleSubmit}
                          >
                            Save Changes
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      {/* edit task */}
                      <div className="card card-custom">
                        <form>
                          <div className="card-body responsive-task">
                            <div className="form-group mb-8">
                              <div class="form-group">
                                <label>
                                  Title <span class="text-danger">*</span>
                                </label>
                                <input
                                  name="title"
                                  value={dataTask["title"]}
                                  onChange={this.handleInputChange}
                                  type="text"
                                  className={
                                    errors.title
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  placeholder="Enter title"
                                />
                                {errors.title && (
                                  <span class="form-text text-danger">
                                    {errors.title}
                                  </span>
                                )}
                              </div>
                              <div class="form-group">
                                <label>
                                  Content <span class="text-danger">*</span>
                                </label>
                                <input
                                  name="content"
                                  value={dataTask["content"]}
                                  onChange={this.handleInputChange}
                                  type="text"
                                  className={
                                    errors.content
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  placeholder="Enter content"
                                />
                                {errors.content && (
                                  <span class="form-text text-danger">
                                    {errors.content}
                                  </span>
                                )}
                              </div>
                              <div className="responsive-task__date">
                                <div class="form-group">
                                  <label>
                                    Start Date{" "}
                                    <span class="text-danger">*</span>
                                  </label>

                                  <div className="filter-date-row">
                                    <div
                                      className="filter-board-item"
                                      style={{ width: "100%" }}
                                    >
                                      <input
                                        name="startDate"
                                        value={formatDateInput(
                                          dataTask["startDate"]
                                        )}
                                        onChange={this.handleInputChange}
                                        type="date"
                                        name="startDate"
                                        className={
                                          errors.startDate
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        placeholder="Enter your start card"
                                      />
                                      {errors.startDate && (
                                        <span class="form-text text-danger">
                                          {errors.startDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div class="form-group">
                                  <label>
                                    Due Date <span class="text-danger">*</span>
                                  </label>

                                  <div className="filter-date-row">
                                    <div
                                      className="filter-board-item"
                                      style={{ width: "100%" }}
                                    >
                                      <input
                                        name="dueDate"
                                        value={formatDateInput(
                                          dataTask["dueDate"]
                                        )}
                                        onChange={this.handleInputChange}
                                        type="date"
                                        name="dueDate"
                                        className={
                                          errors.dueDate
                                            ? "form-control is-invalid"
                                            : "form-control"
                                        }
                                        placeholder="Enter your start card"
                                      />
                                      {errors.dueDate && (
                                        <span class="form-text text-danger">
                                          {errors.dueDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="responsive-task__date">
                                <div class="form-group">
                                  <label>
                                    Status <span class="text-danger">*</span>
                                  </label>

                                  <Select
                                    options={statuses}
                                    className={
                                      errors.status ? "invalid-select" : ""
                                    }
                                    value={dataTask["status"]}
                                    onChange={(e) =>
                                      this.handleSelected("status", e)
                                    }
                                  />
                                  {errors.status && (
                                    <span class="form-text text-danger">
                                      {errors.status}
                                    </span>
                                  )}
                                </div>
                                <div></div>

                                <div class="form-group">
                                  <label>Tag</label>

                                  <Select
                                    value={dataTask["tag"]}
                                    onChange={(e) =>
                                      this.handleSelected("tag", e)
                                    }
                                    options={tags}
                                    class="form-control"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      {/* subtask */}
                      <div className="card card-custom">
                        <div className="card-header flex-wrap border-0 pt-6 pb-0">
                          <div className="card-title ">
                            <h3 className="card-label">List Subtask</h3>
                          </div>
                          <div className="card-toolbar">
                            <div className="dropdown dropdown-inline mr-2"></div>

                            <a
                              onClick={this.handleAddSubtask}
                              className="btn btn-primary font-weight-bolder"
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
                                    <circle
                                      fill="#000000"
                                      cx={9}
                                      cy={15}
                                      r={6}
                                    />
                                    <path
                                      d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z"
                                      fill="#000000"
                                      opacity="0.3"
                                    />
                                  </g>
                                </svg>
                              </span>
                              New Subtask
                            </a>
                          </div>
                        </div>
                        <div class="card-body responsive-subtask">
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
                                <tr
                                  className="datatable-row"
                                  style={{ left: "0px" }}
                                >
                                  <th
                                    className="datatable-cell datatable-toggle-detail hide_desktop show_mb"
                                    style={{ width: "40px" }}
                                  >
                                    <span></span>
                                  </th>
                                  <th
                                    data-field="Title"
                                    className="datatable-cell datatable-cell-sort"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Title
                                    </span>
                                  </th>
                                  <th
                                    data-field="Content"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Content
                                    </span>
                                  </th>
                                  <th
                                    data-field="StateDate"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Start Date
                                    </span>
                                  </th>
                                  <th
                                    data-field="DueDate"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Due Date
                                    </span>
                                  </th>
                                  <th
                                    data-field="Status"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Status
                                    </span>
                                  </th>
                                  <th
                                    data-field="Tag"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>Tag</span>
                                  </th>
                                  <th
                                    data-field="Actions"
                                    className="datatable-cell datatable-cell-sort hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      Actions
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="datatable-body">
                                {dataSubtask.map((item, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      {/* main subtask */}
                                      <tr
                                        data-row={index}
                                        className="datatable-row"
                                        style={{ left: "0px" }}
                                      >
                                        <td
                                          onClick={() =>
                                            this.showDetailModal(index)
                                          }
                                          className="datatable-cell datatable-toggle-detail hide_desktop show_mb"
                                          style={{ width: "40px" }}
                                        >
                                          <span className="datatable-toggle-detail">
                                            <i
                                              className={
                                                this.state.classArrModal[index]
                                              }
                                            ></i>
                                          </span>
                                        </td>
                                        <td
                                          data-field="Title"
                                          className="datatable-cell"
                                          onClick={() =>
                                            this.showDetailModal(index)
                                          }
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.title}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Content"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span
                                            className="limit-1-line-content"
                                            style={{ width: "100px" }}
                                          >
                                            {item.content}
                                          </span>
                                        </td>
                                        <td
                                          data-field="StartDate"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {formatDate(item.startDate)}
                                          </span>
                                        </td>
                                        <td
                                          data-field="DueDate"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {formatDate(item.dueDate)}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Status"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.status && item.status.value}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Tag"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.tag && item.tag.value}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Actions"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            <span
                                              title="Edit Subtask"
                                              onClick={() =>
                                                this.handleEditSubtask(item)
                                              }
                                            >
                                              <i className="fas fa-edit edit-subtask"></i>
                                            </span>
                                            <span
                                              onClick={() =>
                                                this.handleDeleteSubtask(
                                                  item.id
                                                )
                                              }
                                              title="Delete Subtask"
                                            >
                                              <i className="far fa-trash-alt edit-subtask"></i>
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                      {/* responsive */}
                                      <tr
                                        className={`datatable-row-detail hide_desktop ${this.state.classToggleDetailModal[index]}`}
                                      >
                                        <td
                                          style={{
                                            padding: "0",
                                            width: "100%",
                                          }}
                                          className="datatable-detail"
                                          colSpan="7"
                                        >
                                          <table style={{ width: "100%" }}>
                                            <tbody>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Content</span>
                                                </td>
                                                <td
                                                  data-field="Content"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    {item.content}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Start Date</span>
                                                </td>
                                                <td
                                                  data-field="StartDate"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    {formatDate(item.startDate)}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Due Date</span>
                                                </td>
                                                <td
                                                  data-field="DueDate"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    {formatDate(item.dueDate)}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Status</span>
                                                </td>
                                                <td
                                                  data-field="Status"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    {item.status &&
                                                      item.status.value}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Tag</span>
                                                </td>
                                                <td
                                                  data-field="Tag"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    {item.tag && item.tag.value}
                                                  </span>
                                                </td>
                                              </tr>
                                              <tr className="datatable-row">
                                                <td className="datatable-cell">
                                                  <span>Actions</span>
                                                </td>
                                                <td
                                                  data-field="Tag"
                                                  className="datatable-cell"
                                                  style={{}}
                                                >
                                                  <span
                                                    style={{ width: "110px" }}
                                                  >
                                                    <span
                                                      title="Edit Subtask"
                                                      onClick={() =>
                                                        this.handleEditSubtask(
                                                          item
                                                        )
                                                      }
                                                    >
                                                      <i className="fas fa-edit edit-subtask"></i>
                                                    </span>
                                                    <span
                                                      onClick={() =>
                                                        this.handleDeleteSubtask(
                                                          item.id
                                                        )
                                                      }
                                                      title="Delete Subtask"
                                                    >
                                                      <i className="far fa-trash-alt edit-subtask"></i>
                                                    </span>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Subtask */}
        <Modal
          size="lg"
          centered
          show={showAddModal}
          onHide={this.handleCloseAddModal}
        >
          <Modal.Header>
            <Modal.Title>Add Subtask</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card card-custom">
              <form>
                <div className="card-body">
                  <div className="form-group mb-8">
                    <div class="form-group">
                      <label>
                        Title <span class="text-danger">*</span>
                      </label>
                      <input
                        name="title"
                        value={dataSubtaskModal["title"]}
                        type="text"
                        className={
                          errors.title
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="Enter title"
                        onChange={this.handleInputChangeModal}
                      />
                      {errors.title && (
                        <span class="form-text text-danger">
                          {errors.title}
                        </span>
                      )}
                    </div>
                    <div class="form-group">
                      <label>
                        Content <span class="text-danger">*</span>
                      </label>
                      <input
                        name="content"
                        value={dataSubtaskModal["content"]}
                        type="text"
                        className={
                          errors.content
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="Enter content"
                        onChange={this.handleInputChangeModal}
                      />
                      {errors.content && (
                        <span class="form-text text-danger">
                          {errors.content}
                        </span>
                      )}
                    </div>
                    <div className="responsive-task__date">
                      <div class="form-group">
                        <label>
                          Start Date <span class="text-danger">*</span>
                        </label>

                        <input
                          onChange={this.handleInputChangeModal}
                          type="date"
                          name="startDate"
                          value={formatDateInput(dataSubtaskModal["startDate"])}
                          className={
                            errors.startDate
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter your start card"
                        />
                        {errors.startDate && (
                          <span class="form-text text-danger">
                            {errors.startDate}
                          </span>
                        )}
                      </div>
                      <div></div>
                      <div class="form-group">
                        <label>
                          Due Date <span class="text-danger">*</span>
                        </label>

                        <input
                          onChange={this.handleInputChangeModal}
                          type="date"
                          name="dueDate"
                          value={formatDateInput(dataSubtaskModal["dueDate"])}
                          className={
                            errors.dueDate
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter your start card"
                        />
                        {errors.dueDate && (
                          <span class="form-text text-danger">
                            {errors.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="responsive-task__date">
                      <div class="form-group">
                        <label>
                          Status <span class="text-danger">*</span>
                        </label>

                        <Select
                          value={dataSubtaskModal["status"]}
                          closeMenuOnSelect={true}
                          options={statuses}
                          className={errors.status ? "invalid-select" : ""}
                          onChange={(e) =>
                            this.handleSelectedModal("status", e)
                          }
                        />
                        {errors.status && (
                          <span class="form-text text-danger">
                            {errors.status}
                          </span>
                        )}
                      </div>
                      <div></div>

                      <div class="form-group">
                        <label>Tag</label>

                        <Select
                          closeMenuOnSelect={true}
                          value={dataSubtaskModal["tag"]}
                          options={tags}
                          onChange={(e) => this.handleSelectedModal("tag", e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseAddModal}>
              Close
            </Button>
            <Button onClick={this.handleSubmitAddModal} variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* edit subtask */}
        <Modal
          size="lg"
          centered
          show={showEditModal}
          onHide={this.handleCloseEditModal}
        >
          <Modal.Header>
            <Modal.Title>Edit Subtask</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card card-custom">
              <form>
                <div className="card-body">
                  <div className="form-group mb-8">
                    <div class="form-group">
                      <label>
                        Title <span class="text-danger">*</span>
                      </label>
                      <input
                        name="title"
                        value={dataSubtaskModal["title"]}
                        type="text"
                        class={
                          errors.title
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="Enter title"
                        onChange={this.handleInputChangeModal}
                      />
                      {errors.title && (
                        <span class="form-text text-danger">
                          {errors.title}
                        </span>
                      )}
                    </div>
                    <div class="form-group">
                      <label>
                        Content <span class="text-danger">*</span>
                      </label>
                      <input
                        name="content"
                        value={dataSubtaskModal["content"]}
                        type="text"
                        class={
                          errors.content
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="Enter content"
                        onChange={this.handleInputChangeModal}
                      />
                      {errors.content && (
                        <span class="form-text text-danger">
                          {errors.content}
                        </span>
                      )}
                    </div>
                    <div className="responsive-task__date">
                      <div class="form-group">
                        <label>
                          Start Date <span class="text-danger">*</span>
                        </label>

                        <div className="filter-date-row">
                          <div
                            className="filter-board-item"
                            style={{ width: "100%" }}
                          >
                            <input
                              onChange={this.handleInputChangeModal}
                              type="date"
                              name="startDate"
                              value={formatDateInput(
                                dataSubtaskModal["startDate"]
                              )}
                              class={
                                errors.startDate
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              placeholder="Enter your start card"
                            />
                            {errors.startDate && (
                              <span class="form-text text-danger">
                                {errors.startDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div class="form-group">
                        <label>
                          Due Date <span class="text-danger">*</span>
                        </label>

                        <div className="filter-date-row">
                          <div
                            className="filter-board-item"
                            style={{ width: "100%" }}
                          >
                            <input
                              onChange={this.handleInputChangeModal}
                              type="date"
                              name="dueDate"
                              value={formatDateInput(
                                dataSubtaskModal["dueDate"]
                              )}
                              class={
                                errors.dueDate
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              placeholder="Enter your start card"
                            />
                            {errors.dueDate && (
                              <span class="form-text text-danger">
                                {errors.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="responsive-task__date">
                      <div class="form-group">
                        <label>
                          Status <span class="text-danger">*</span>
                        </label>

                        <Select
                          value={dataSubtaskModal["status"]}
                          closeMenuOnSelect={true}
                          options={statuses}
                          className={errors.status ? "invalid-select" : ""}
                          onChange={(e) =>
                            this.handleSelectedModal("status", e)
                          }
                        />
                        {errors.status && (
                          <span class="form-text text-danger">
                            {errors.status}
                          </span>
                        )}
                      </div>
                      <div></div>

                      <div class="form-group">
                        <label>Tag</label>

                        <Select
                          closeMenuOnSelect={true}
                          value={dataSubtaskModal["tag"]}
                          options={tags}
                          onChange={(e) => this.handleSelectedModal("tag", e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseEditModal}>
              Close
            </Button>
            <Button
              onClick={() => this.handleSubmitEditModal(dataSubtaskModal.id)}
              variant="primary"
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
    role: state.auth.role,
  };
};

export default connect(mapStateToProps)(SubTask);
