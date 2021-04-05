import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { withRouter } from "react-router";
import SubTask from "./EditTask";
import Network from "../../Service/Network";
import { toast, ToastContainer } from "react-toastify";
import Fbloader from "../libs/PageLoader/fbloader";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { formatDate } from "../../utils/common/convertDate";
import Select from "react-select";

const api = new Network();

const statuses = [
  { label: "New", value: "New" },
  { label: "Progress", value: "Progress" },
];

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 5,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      classArr: new Array(10).fill("fa fa-caret-down"),
      classToggleDetail: new Array(10).fill("show_mb"),
      filterStatus: null,
    };
  }

  handlePagination = async (page) => {
    await this.setState({
      pageNumber: page,
      loading: true,
    });
    this.getInitData();
  };

  getInitData = async () => {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      let url = `/api/v1/list-task?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`;
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      if (this.state.filterStatus !== null) {
        url += `&status=${this.state.filterStatus.value}`;
      }
      const response = await api.get(
        // `/api/v1/list-task?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
        url
      );

      if (response) {
        setTimeout(() => {
          console.log("res", response);
          self.setState({
            // isLoading: false,
            arrayBooleanPopover: new Array(response.data.data.list.length).fill(
              false
            ),
            data: response.data.data.list,
            totalRow: response.data.data.total,
            start: start,
            realSize: response.data.data.list.length,
          });
        }, 300);
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 1200);
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log("Err in list job: ", err.response);
    }
  };

  showDetailMain(index) {
    // console.log("index", index);
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

  handleDeleteTask = async (id) => {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.delete(`/api/v1/list-task/${id}`);
      console.log("aaa", response);
      toast.error("Delete task successful!", {
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

  handleFilterStatus = async (selectedStatus) => {
    // console.log("select", selectedStatus);
    await this.setState({
      filterStatus: selectedStatus,
    });
    this.getInitData();
  };

  componentDidMount() {
    this.getInitData();
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.isLoading !== this.props.isLoading) {
      this.getInitData();
    }
  }

  render() {
    const { data, dataSubtask, showModal, isLoading, showFilter } = this.state;
    return (
      <div>
        {isLoading ? <Fbloader /> : null}
        <div
          style={{
            width: "20%",
            marginBottom: "2vh",
          }}
        >
          <Select
            onChange={this.handleFilterStatus}
            placeholder="Filter status..."
            options={statuses}
            isClearable
          />
        </div>
        <div
          className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
          id="kt_datatable"
          style={{ position: "static", zoom: 1 }}
        >
          <table className="datatable-table" style={{ display: "block" }}>
            <thead className="datatable-head">
              <tr className="datatable-row" style={{ left: "0px" }}>
                <th className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                  <span style={{ width: "40px" }}></span>
                </th>
                <th
                  data-field="Title"
                  className="datatable-cell datatable-cell-sort"
                >
                  <span style={{ width: "160px" }}>Title</span>
                </th>
                <th
                  data-field="Content"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "160px" }}>Content</span>
                </th>
                <th
                  data-field="StateDate"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "130px" }}>Start Date</span>
                </th>
                <th
                  data-field="DueDate"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "130px" }}>Due Date</span>
                </th>
                <th
                  data-field="Status"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "130px" }}>Status</span>
                </th>
                <th
                  data-field="Tag"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "130px" }}>Tag</span>
                </th>
                <th
                  data-field="Subtask"
                  className="datatable-cell datatable-cell-sort hide_mb"
                >
                  <span style={{ width: "160px" }}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="datatable-body">
              {data.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr
                      data-row={index}
                      className="datatable-row"
                      style={{ left: "0px" }}
                    >
                      <td
                        onClick={() => this.showDetailMain(index)}
                        className="datatable-cell datatable-toggle-detail hide_desktop show_mb"
                        style={{ width: "40px" }}
                      >
                        <span className="datatable-toggle-detail">
                          <i className={this.state.classArr[index]}></i>
                        </span>
                      </td>
                      <td
                        data-field="Title"
                        className="datatable-cell"
                        onClick={() => this.showDetailMain(index)}
                      >
                        <span style={{ width: "160px" }}>{item.title}</span>
                      </td>
                      <td
                        data-field="Content"
                        className="datatable-cell hide_mb"
                      >
                        <span style={{ width: "160px" }}>{item.content}</span>
                      </td>
                      <td
                        data-field="StartDate"
                        className="datatable-cell hide_mb"
                      >
                        <span style={{ width: "130px" }}>
                          {formatDate(item.startDate)}
                        </span>
                      </td>
                      <td
                        data-field="DueDate"
                        className="datatable-cell hide_mb"
                      >
                        <span style={{ width: "130px" }}>
                          {formatDate(item.dueDate)}
                        </span>
                      </td>
                      <td
                        data-field="Status"
                        className="datatable-cell hide_mb"
                      >
                        <span style={{ width: "130px" }}>{item.status}</span>
                      </td>
                      <td data-field="Tag" className="datatable-cell hide_mb">
                        <span style={{ width: "130px" }}>{item.tag}</span>
                      </td>
                      <td
                        data-field="Subtask"
                        className="datatable-cell hide_mb"
                      >
                        <span style={{ width: "160px" }}>
                          <span
                            onClick={() =>
                              this.props.history.push(`/task/${item.id}`)
                            }
                            title="Edit Task"
                          >
                            <i className="fas fa-edit edit-subtask"></i>
                          </span>
                          <span
                            onClick={() => this.handleDeleteTask(item.id)}
                            title="Delete Task"
                          >
                            <i className="far fa-trash-alt edit-subtask"></i>
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr
                      className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                    >
                      <td
                        style={{ padding: "0", width: "100%" }}
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
                                <span style={{ width: "110px" }}>
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
                                <span style={{ width: "110px" }}>
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
                                <span style={{ width: "110px" }}>
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
                                <span style={{ width: "110px" }}>
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
                                <span style={{ width: "110px" }}>
                                  {item.tag}
                                </span>
                              </td>
                            </tr>
                            <tr className="datatable-row">
                              <td className="datatable-cell">
                                <span>Actions</span>
                              </td>
                              <td
                                data-field="Actions"
                                className="datatable-cell"
                                style={{}}
                              >
                                <span style={{ width: "110px" }}>
                                  <span
                                    onClick={() =>
                                      this.props.history.push(
                                        `/task/${item.id}`
                                      )
                                    }
                                    title="Edit Task"
                                  >
                                    <i className="fas fa-edit edit-subtask"></i>
                                  </span>
                                  <span
                                    onClick={() =>
                                      this.handleDeleteTask(item.id)
                                    }
                                    title="Delete Task"
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
    );
  }
}

export default withRouter(TaskList);
