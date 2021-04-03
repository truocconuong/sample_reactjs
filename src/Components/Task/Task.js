import React, { Component } from "react";
import TaskList from "./TaskList";
import "./style.css";
import { Modal, Button } from "react-bootstrap";
import Network from "../../Service/Network";
import { formatDateInput } from "../../utils/common/convertDate";
import Select from "react-select";
import { toast } from "react-toastify";
import Validator from "../../utils/validator";
import { rulesAddTask } from "../../utils/rule";
import _ from "lodash";
import moment from "moment";
import Fbloader from "../libs/PageLoader/fbloader";
import InterviewList from "./InterviewList";

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

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addTask: {
        title: "",
        content: "",
        startDate: "",
        dueDate: "",
        status: "",
        tag: null,
      },
      errors: {},
      isLoading: false,
    };
    this.validator = new Validator(rulesAddTask);
  }

  defaultState = () => {
    const addTask = {
      title: "",
      content: "",
      startDate: "",
      dueDate: "",
      status: "",
      tag: null,
    };
    this.setState({
      addTask,
      errors: {},
    });
  };

  handleShowModal = () => {
    this.setState({
      showModal: true,
    });
    this.defaultState();
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  };

  handleInputChangeModal = (e) => {
    const { name, value } = e.target;
    const { errors } = this.state;
    delete errors[name];
    const addTask = this.state.addTask;
    addTask[name] = value;
    this.setState({
      addTask,
      errors,
    });
  };

  handleSelectedModal = (name, value) => {
    const addTask = this.state.addTask;
    const { errors } = this.state;
    delete errors[name];
    addTask[name] = value;
    this.setState({
      addTask,
      errors,
    });
  };
  handleAddTask = async (e) => {
    e.preventDefault();
    const { addTask } = this.state;
    const errors = this.validator.validate(this.state.addTask);
    if (moment(addTask.startDate).isBefore(moment(), "day")) {
      errors.startDate =
        "Start date needs to be greater than or equal to the current date.";
    }
    if (moment(addTask.dueDate).isBefore(moment(), "day")) {
      errors.dueDate =
        "Due date needs to be greater than or equal to the current date.";
    } else if (
      moment(addTask.dueDate).isBefore(moment(addTask.startDate), "day")
    ) {
      errors.dueDate =
        "Due date needs to be greater than or equal to the Start date.";
    }
    this.setState({
      errors,
    });
    if (_.isEmpty(errors)) {
      this.setState({
        isLoading: true,
      });
      let submitAddTask = this.state.addTask;
      submitAddTask["status"] = submitAddTask["status"].value;
      if (submitAddTask["tag"] !== null) {
        submitAddTask["tag"] = submitAddTask["tag"].value;
      }
      submitAddTask["parentId"] = null;
      try {
        const response = await api.post(`/api/v1/list-task`, submitAddTask);
        console.log("sent", response);
        toast.success("Add task successful!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          showModal: false,
        });
      } catch (e) {
        console.log("ERROR ADD TASK =====> ", e.message);
      }
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const { showModal, addTask, errors, isLoading } = this.state;

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
                        <h3 className="card-label">List Task</h3>
                      </div>
                      <div className="card-toolbar">
                        <div className="dropdown dropdown-inline mr-2"></div>

                        <a
                          onClick={this.handleShowModal}
                          //   href="#"
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
                                <circle fill="#000000" cx={9} cy={15} r={6} />
                                <path
                                  d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z"
                                  fill="#000000"
                                  opacity="0.3"
                                />
                              </g>
                            </svg>
                          </span>
                          New Task
                        </a>
                      </div>
                    </div>
                    <div className="card-body">
                      <TaskList isLoading={isLoading} />
                    </div>
                  </div>
                  <div
                    style={{ marginTop: "3vh" }}
                    className="d-flex w_100 dr_col justify-content-center"
                  >
                    <InterviewList nameColumn="Onboarding" />
                    <InterviewList nameColumn="Interview F2F" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          size="lg"
          centered
          show={showModal}
          onHide={this.handleCloseModal}
        >
          <Modal.Header>
            <Modal.Title>Add Task</Modal.Title>
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
                        value={addTask["title"]}
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
                        value={addTask["content"]}
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
                        <input
                          onChange={this.handleInputChangeModal}
                          type="date"
                          name="startDate"
                          value={formatDateInput(addTask["startDate"])}
                          class={
                            errors.startDate
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter your start task"
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
                          value={formatDateInput(addTask["dueDate"])}
                          class={
                            errors.dueDate
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter your end task"
                        />
                        {errors.dueDate && (
                          <span class="form-text text-danger">
                            {errors.dueDate}
                          </span>
                        )}
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
                          value={addTask["status"]}
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
                          value={addTask["tag"]}
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
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Close
            </Button>
            <Button onClick={this.handleAddTask} variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Task;
