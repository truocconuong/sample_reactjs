import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";
import { formatDateInput } from "../../utils/common/convertDate";
import Network from "../../Service/Network";
import { toast, ToastContainer } from "react-toastify";
import Validator from "../../utils/validator";
import { rulesAddTask } from "../../utils/rule";
import _ from "lodash";
import Fbloader from "../libs/PageLoader/fbloader";

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
      classArrModal: new Array(10).fill("fa fa-caret-down"),
      classToggleDetailModal: new Array(10).fill("show_mb"),
      dataTask: [],
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
    };
    this.validator = new Validator(rulesAddTask);
  }

  getInitData = async () => {
    try {
      const getTask = await api.get(
        `/api/v1/list-task/${this.props.match.params.id}`
      );

      const getSubtask = await api.get(
        `/api/v1/sub-task/${this.props.match.params.id}?pageSize=10&pageNumber=1`
      );
      console.log("data", getSubtask);

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

      this.setState({
        dataTask,
        dataSubtask: getSubtask.data.listTask,
        isLoading: false,
      });
    } catch (error) {
      console.log("ERROR get data =====>", error.message);
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
      toast.error("Delete subtask successful!", {
        position: "top-right",
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
    const dataSubtaskModal = this.state.dataSubtaskModal;
    dataSubtaskModal[name] = value;
    this.setState({
      dataSubtaskModal,
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
    // console.log("value", value);
    const dataSubtaskModal = this.state.dataSubtaskModal;
    dataSubtaskModal[name] = {
      label: value.value,
      value: value.value,
    };
    // errors
    this.setState({
      dataSubtaskModal,
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

  handleSubmitEditModal = (e) => {
    e.preventDefault();
    // this.handleSubmitModal('edit', `/api/v1/list-task/${}`, 'Add subtask successful!')
  };

  handleSubmitModal = async (type, url, message) => {
    const { dataSubtaskModal } = this.state;
    const errors = this.validator.validate(this.state.dataSubtaskModal);
    if (
      moment(dataSubtaskModal.startDate).localeData - moment().localeData <
      0
    ) {
      errors.startDate =
        "Start date needs to be greater than or equal to the current date.";
    }
    if (moment(dataSubtaskModal.dueDate).localeData - moment().localeData < 0) {
      errors.dueDate =
        "Due date needs to be greater than or equal to the current date.";
    } else if (
      moment(dataSubtaskModal.dueDate).localeData -
        moment(dataSubtaskModal.startDate).localeData <
      0
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

      submitAddSubtask["parentId"] = this.props.match.params.id;

      try {
        if (type === "add") {
          const response = await api.post(url, submitAddSubtask);
        } else {
          const response = await api.patch(url, submitAddSubtask);
        }
        // console.log("sent", response);
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
          isLoading: false,
        });
        this.getInitData();
      } catch (e) {
        console.log("ERROR ADD TASK =====> ", e.message);
      }
    }
  };

  handleSubmit = () => {
    // console.log("submit form", this.state.dataTask);
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
    setTimeout({});
    this.getInitData();
  }
  render() {
    const {
      dataTask,
      showAddModal,
      showEditModal,
      dataSubtask,
      dataSubtaskModal,
      isLoading,
    } = this.state;

    // console.log("datasub", dataSubtaskModal);
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
                      <div className="card-title">
                        <h3 className="card-label">Edit Task</h3>
                      </div>
                      <div className="card-toolbar">
                        <Button
                          style={{ margin: "0 5px" }}
                          variant="secondary"
                          onClick={() => this.props.history.push("/task")}
                        >
                          Back
                        </Button>
                        <Button
                          style={{ margin: "0 5px" }}
                          variant="primary"
                          onClick={this.handleSubmit}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* edit task */}
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
                                  value={dataTask["title"]}
                                  onChange={this.handleInputChange}
                                  type="text"
                                  class="form-control"
                                  placeholder="Enter title"
                                />
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
                                  class="form-control"
                                  placeholder="Enter content"
                                />
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "48% 4% 48%",
                                }}
                              >
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
                                        className="form-control"
                                        placeholder="Enter your start card"
                                      />
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
                                        name="dueDate"
                                        value={formatDateInput(
                                          dataTask["dueDate"]
                                        )}
                                        onChange={this.handleInputChange}
                                        type="date"
                                        name="dueDate"
                                        className="form-control"
                                        placeholder="Enter your start card"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "48% 4% 48%",
                                }}
                              >
                                <div class="form-group">
                                  <label>
                                    Status <span class="text-danger">*</span>
                                  </label>

                                  <Select
                                    options={statuses}
                                    class="form-control"
                                    value={dataTask["status"]}
                                    onChange={(e) =>
                                      this.handleSelected("status", e)
                                    }
                                  />
                                </div>
                                <div></div>

                                <div class="form-group">
                                  <label>
                                    Tag <span class="text-danger">*</span>
                                  </label>

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
                          <div className="card-title">
                            <h3 className="card-label">List Subtask</h3>
                          </div>
                          <div className="card-toolbar">
                            <div className="dropdown dropdown-inline mr-2"></div>

                            <a
                              onClick={this.handleAddSubtask}
                              // href="#"
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
                        <div class="card-body">
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
                                            {item.startDate}
                                          </span>
                                        </td>
                                        <td
                                          data-field="DueDate"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.dueDate}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Status"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.status}
                                          </span>
                                        </td>
                                        <td
                                          data-field="Tag"
                                          className="datatable-cell hide_mb"
                                        >
                                          <span style={{ width: "100px" }}>
                                            {item.tag}
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
                                                    {item.startDate}
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
                                                    {item.dueDate}
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
                                                    {item.status}
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
                                                    {item.tag}
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
                        class="form-control"
                        placeholder="Enter title"
                        onChange={this.handleInputChangeModal}
                      />
                    </div>
                    <div class="form-group">
                      <label>
                        Content <span class="text-danger">*</span>
                      </label>
                      <input
                        name="content"
                        value={dataSubtaskModal["content"]}
                        type="text"
                        class="form-control"
                        placeholder="Enter content"
                        onChange={this.handleInputChangeModal}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "48% 4% 48%",
                      }}
                    >
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
                              className="form-control"
                              placeholder="Enter your start card"
                            />
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
                              className="form-control"
                              placeholder="Enter your start card"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "48% 4% 48%",
                      }}
                    >
                      <div class="form-group">
                        <label>
                          Status <span class="text-danger">*</span>
                        </label>

                        <Select
                          value={dataSubtaskModal["status"]}
                          closeMenuOnSelect={true}
                          options={statuses}
                          class="form-control"
                          onChange={(e) =>
                            this.handleSelectedModal("status", e)
                          }
                        />
                      </div>
                      <div></div>

                      <div class="form-group">
                        <label>
                          Tag <span class="text-danger">*</span>
                        </label>

                        <Select
                          closeMenuOnSelect={true}
                          value={dataSubtaskModal["tag"]}
                          options={tags}
                          class="form-control"
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
                        class="form-control"
                        placeholder="Enter title"
                        onChange={this.handleInputChangeModal}
                      />
                    </div>
                    <div class="form-group">
                      <label>
                        Content <span class="text-danger">*</span>
                      </label>
                      <input
                        name="content"
                        value={dataSubtaskModal["content"]}
                        type="text"
                        class="form-control"
                        placeholder="Enter content"
                        onChange={this.handleInputChangeModal}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "48% 4% 48%",
                      }}
                    >
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
                              className="form-control"
                              placeholder="Enter your start card"
                            />
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
                              className="form-control"
                              placeholder="Enter your start card"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "48% 4% 48%",
                      }}
                    >
                      <div class="form-group">
                        <label>
                          Status <span class="text-danger">*</span>
                        </label>

                        <Select
                          value={dataSubtaskModal["status"]}
                          closeMenuOnSelect={true}
                          options={statuses}
                          class="form-control"
                          onChange={(e) =>
                            this.handleSelectedModal("status", e)
                          }
                        />
                      </div>
                      <div></div>

                      <div class="form-group">
                        <label>
                          Tag <span class="text-danger">*</span>
                        </label>

                        <Select
                          closeMenuOnSelect={true}
                          value={dataSubtaskModal["tag"]}
                          options={tags}
                          class="form-control"
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
            <Button onClick={this.handleSubmitEditModal} variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default SubTask;
