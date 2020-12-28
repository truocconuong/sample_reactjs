import React, { Component } from "react";
import "rc-pagination/assets/index.css";
import "../style.css";
import Network from "../../../Service/Network";
import { connect } from "react-redux";
import Fbloader from "../../libs/PageLoader/fbloader.js";
import Performance from "./Performance.js";
import ListActiveJob from "./ListActiveJob.js";
import WeeklyTask from "./WeeklyTask.js";
import ManageMember from "./ManageMember.js";
import moment from "moment";
import Validator from "../../../utils/validator.js";
import { rulesCreateNewTask } from "../../../utils/rule.js";
import toastr from "toastr";
import Calendar from "./Calendar.js";
import RecruitmentProgress from "./RecruitmentProgress.js";
import Applicants from "./Applicants.js";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast.js";

const api = new Network();
toastr.options = {
  positionClass: "toast-top-right",
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumberJob: 1,
      pageSize: 5,
      pageNumberTask: 1,
      totalRowJob: 0,
      totalRowTask: 0,
      startJob: 0,
      dataJob: [],
      statusJob: "Active",
      isLoading: false,
      isLoadingListJob: false,
      isLoadingWeeklyTask: false,
      //date of list job
      startDateJob: moment().subtract(3, "M"),
      endDateJob: moment(),
      // date of performance
      startDate: moment().startOf("week"),
      endDate: moment().endOf("week"),
      // date of create new task
      startDateTask: moment(),
      endDateTask: moment().add(1, "days"),
      // date of weekly task
      startDateWeeklyTask: moment().startOf("week"),
      endDateWeeklyTask: moment().endOf("week"),
      // create new task state
      teamMemberId: {
        label: "",
        value: "",
      },
      contentTask: [{ content: "", percent: "" }],
      dataListTeamMember: [],
      errors: {},

      dataPerformance: [],
      dataLastLogin: [],
      dataWeeklyTask: [],
      startTask: 0,
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataJob = this.getDataJob.bind(this);
    this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this);
    this.getDataPerformance = this.getDataPerformance.bind(this);
    this.getInitData = this.getInitData.bind(this);
    this.handleInputChangeNewTask = this.handleInputChangeNewTask.bind(this);
    this.handleCreateNewTask = this.handleCreateNewTask.bind(this);
    this.validator = new Validator(rulesCreateNewTask);
    this.isEmpty = this.isEmpty.bind(this);
    this.clearValidate = this.clearValidate.bind(this);
    this.getDataWeeklyTask = this.getDataWeeklyTask.bind(this);
    this.changeStatusJob = this.changeStatusJob.bind(this);
    this.applyTimeJob = this.applyTimeJob.bind(this);
    this.applyTimeTask = this.applyTimeTask.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.addContentTask = this.addContentTask.bind(this);
    this.removeContentTask = this.removeContentTask.bind(this);
    this.handleChangePercentTask = this.handleChangePercentTask.bind(this);
    this.handleChangeContentTask = this.handleChangeContentTask.bind(this);
  }
  handleChangePercentTask(i, event) {
    let contentTask = this.state.contentTask;
    contentTask[i].percent = event.target.value;
    this.setState({ contentTask });
  }
  handleChangeContentTask(i, event) {
    let contentTask = this.state.contentTask;
    contentTask[i].content = event.target.value;
    this.setState({ contentTask });
  }
  removeContentTask(i) {
    let contentTask = this.state.contentTask;
    if (contentTask.length > 1) {
      contentTask.splice(i, 1);
      this.setState({ contentTask });
    } else {
      return;
    }
  }
  addContentTask() {
    this.setState((prevState) => ({
      contentTask: [...prevState.contentTask, { content: "", percent: "" }],
    }));
  }
  handleChangeSelect(e, type) {
    let { value, label } = e;
    console.log(label, value);
    if (type == "teamMemberId") {
      this.setState({
        teamMemberId: {
          value: value,
          label: label,
        },
      });
    }
  }
  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  clearValidate() {
    this.setState({
      errors: {},
    });
  }
  async handleCreateNewTask() {
    const errors = this.validator.validate(this.state);
    const contentTask = await this.state.contentTask.map((task, index) => {
      if (task.content == "" || task.percent == "") {
        return {
          content: task.content == "" ? "content not null" : null,
          percent: task.percent == "" ? "percent not null" : null,
        };
      } else {
        return {};
      }
    });
    console.log(contentTask);
    if (contentTask.find((e) => !this.isEmpty(e))) {
      errors["contentTask"] = contentTask;
    }
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      try {
        let self = this;
        let data = {
          userId: self.state.teamMemberId.value,
          content: self.state.contentTask,
          startDate: self.state.startDateTask.format("YYYY-MM-DD"),
          endDate: self.state.endDateTask.format("YYYY-MM-DD"),
        };
        const response = await api.post(`/api/task`, data);
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
          this.setState(
            {
              teamMemberId: "",
              contentTask: [{ content: "", percent: "" }],
              startDateTask: moment(),
              endDateTask: moment().add(1, "days"),
              errors: {},
            },
            function () {
              this.getDataWeeklyTask();
            }
          );
          return response;
        } else {
          return null;
        }
      } catch (error) {
        console.log("err while create new task: ", error);
      }
    } else {
      console.log("Validate err: ", errors);
      return null;
    }
  }
  handleInputChangeNewTask(e) {
    let self = this;
    const name = e.target.name;
    const value = e.target.value;
    // console.log(name, value);
    this.setState(
      {
        [name]: value,
      },
      function () {}
    );
  }

  handleChangeDatePicker(_moment, name, type) {
    let self = this;
    this.setState({
      [name]: _moment,
    });
  }
  async getInitData() {
    // console.log("da vao day", this.props.role)
    try {
      let self = this;
      this.setState({
        isLoading: true,
        isLoadingListJob: true,
        isLoadingWeeklyTask: true,
      });
      if (this.props.role === "Director") {
        const [
          responseJob,
          responsePerformance,
          responseLastLogin,
          responseListWeeklyTask,
        ] = await Promise.all([
          api.get(
            `/api/dashboard/jobs?pageSize=${this.state.pageSize}&pageNumber=${
              this.state.pageNumberJob
            }&status=${
              this.state.statusJob
            }&startDate=${this.state.startDateJob.format(
              "YYYY-MM-DD"
            )}&endDate=${this.state.endDateJob.format("YYYY-MM-DD")}`
          ),
          api.post(`/api/dashboard/cv`, {
            startDate: this.state.startDate.format("YYYY-MM-DD"),
            endDate: this.state.endDate.format("YYYY-MM-DD"),
          }),
          api.get(`/api/user/lastlogin`),
          api.post(
            `/api/task/team?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberTask}`,
            {
              startDate: this.state.startDateWeeklyTask.format("YYYY-MM-DD"),
              endDate: this.state.endDateWeeklyTask.format("YYYY-MM-DD"),
            }
          ),
        ]);
        if (
          responseJob &&
          responsePerformance &&
          responseLastLogin &&
          responseListWeeklyTask
        ) {
          this.setState({
            //job state
            dataJob: responseJob.data.list,
            totalRowJob: responseJob.data.total,
            startJob: 1,
            // performance state
            dataPerformance: responsePerformance.data.list,
            // last login
            dataLastLogin: responseLastLogin.data.list,
            // list member

            // list weekly task
            totalRowTask: responseListWeeklyTask.data.total,
            dataWeeklyTask: responseListWeeklyTask.data.tasks,
          });
          console.log(responsePerformance);
          setTimeout(() => {
            self.setState({
              isLoading: false,
              isLoadingListJob: false,
              isLoadingWeeklyTask: false,
            });
          }, 500);
        } else {
          this.setState({
            isLoading: false,
            isLoadingListJob: false,
          });
        }
      } else if (this.props.role === "Leader") {
        const [
          responseJob,
          responsePerformance,
          // responseLastLogin,
          responseListMember,
          responseListWeeklyTask,
        ] = await Promise.all([
          api.get(
            `/api/dashboard/jobs?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberJob}&status=${this.state.statusJob}&startDate=${this.state.startDateJob}&endDate=${this.state.endDateJob}`
          ),
          api.post(`/api/dashboard/cv`, {
            startDate: this.state.startDate.format("YYYY-MM-DD"),
            endDate: this.state.endDate.format("YYYY-MM-DD"),
          }),
          // api.get(`/api/user/lastlogin`),
          api.get(`/api/task/user`),
          api.post(
            `/api/task/team?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberTask}`,
            {
              startDate: this.state.startDateWeeklyTask.format("YYYY-MM-DD"),
              endDate: this.state.endDateWeeklyTask.format("YYYY-MM-DD"),
            }
          ),
        ]);
        if (
          responseJob &&
          responsePerformance &&
          // responseLastLogin &&
          responseListMember &&
          responseListWeeklyTask
        ) {
          this.setState({
            //job state
            dataJob: responseJob.data.list,
            totalRowJob: responseJob.data.total,
            startJob: 1,
            // performance state
            dataPerformance: responsePerformance.data.list,
            // last login
            // dataLastLogin: responseLastLogin.data.list,
            // list member
            dataListTeamMember: responseListMember.data.list,
            // list weekly task
            totalRowTask: responseListWeeklyTask.data.total,
            dataWeeklyTask: responseListWeeklyTask.data.tasks,
          });
          // console.log(responsePerformance)
          setTimeout(() => {
            self.setState({
              isLoading: false,
              isLoadingListJob: false,
              isLoadingWeeklyTask: false,
            });
          }, 1000);
        } else {
          this.setState({
            isLoading: false,
            isLoadingListJob: false,
          });
        }
      } else {
        // role Member
        const [responseJob, responseListWeeklyTask] = await Promise.all([
          api.get(
            `/api/dashboard/jobs?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberJob}&status=${this.state.statusJob}&startDate=${this.state.startDateJob}&endDate=${this.state.endDateJob}`
          ),
          api.post(
            `/api/task/team?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberTask}`,
            {
              startDate: this.state.startDateWeeklyTask.format("YYYY-MM-DD"),
              endDate: this.state.endDateWeeklyTask.format("YYYY-MM-DD"),
            }
          ),
        ]);
        if (
          responseJob
          // && responseListWeeklyTask
        ) {
          this.setState({
            //job state
            dataJob: responseJob.data.list,
            totalRowJob: responseJob.data.total,
            startJob: 1,
            // list weekly task
            totalRowTask: responseListWeeklyTask.data.total,
            dataWeeklyTask: responseListWeeklyTask.data.tasks,
          });
          setTimeout(() => {
            self.setState({
              isLoading: false,
              isLoadingListJob: false,
              isLoadingWeeklyTask: false,
            });
          }, 1000);
        } else {
          this.setState({
            isLoading: false,
            isLoadingListJob: false,
          });
        }
      }
    } catch (error) {
      console.log("err while get init data dashboard: ", error);
      this.setState({
        isLoading: false,
        isLoadingListJob: false,
      });
    }
  }
  changeStatusJob(status) {
    this.setState(
      {
        statusJob: status,
        pageNumberJob: 1,
      },
      function () {
        this.getDataJob();
      }
    );
  }
  async getDataPerformance() {
    // su dung cho fillter theo ngay
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      const response = await api.post(`/api/dashboard/cv`, {
        startDate: this.state.startDate.format("YYYY-MM-DD"),
        endDate: this.state.endDate.format("YYYY-MM-DD"),
      });
      if (response) {
        this.setState({
          dataPerformance: response.data.list,
        });
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 1000);
      } else {
        this.setState({
          isLoading: false,
        });
      }
      // console.log(response);
    } catch (error) {
      console.log("err while fetch data Performance: ", error);
      this.setState({
        isLoading: false,
      });
    }
  }
  applyTimeJob() {
    this.setState(
      {
        pageNumberJob: 1,
      },
      function () {
        this.getDataJob();
      }
    );
  }
  applyTimeTask() {
    this.setState(
      {
        pageNumberTask: 1,
      },
      function () {
        this.getDataWeeklyTask();
      }
    );
  }
  async getDataJob() {
    // su dung cho pagination
    try {
      let self = this;
      this.setState({
        isLoading: true,
        isLoadingListJob: true,
      });
      let start = this.state.pageSize * (this.state.pageNumberJob - 1) + 1;
      const response = await api.get(
        `/api/dashboard/jobs?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberJob}&status=${this.state.statusJob}&startDate=${this.state.startDateJob}&endDate=${this.state.endDateJob}`
      );
      if (response) {
        this.setState({
          dataJob: response.data.list,
          totalRowJob: response.data.total,
          startJob: start,
        });

        setTimeout(() => {
          self.setState({
            isLoading: false,
            isLoadingListJob: false,
          });
        }, 200);
      } else {
        self.setState({
          isLoading: false,
          isLoadingListJob: false,
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
        isLoadingListJob: false,
      });
      console.log("Err in list job: ", err.response);
    }
  }

  async getDataWeeklyTask() {
    // su dung cho pagination
    try {
      let self = this;
      this.setState({
        isLoading: true,
        isLoadingWeeklyTask: true,
      });
      let start = this.state.pageSize * (this.state.pageNumberTask - 1) + 1;
      const response = await api.post(
        `/api/task/team?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumberTask}`,
        {
          startDate: this.state.startDateWeeklyTask,
          endDate: this.state.endDateWeeklyTask,
        }
      );
      if (response) {
        this.setState({
          dataWeeklyTask: response.data.tasks,
          totalRowTask: response.data.total,
          startTask: start,
        });
        setTimeout(() => {
          self.setState({
            isLoading: false,
            isLoadingWeeklyTask: false,
          });
        }, 800);
      } else {
        self.setState({
          isLoading: false,
          isLoadingWeeklyTask: false,
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
        isLoadingWeeklyTask: false,
      });
      console.log("Err in list task: ", err.response);
    }
  }

  async handlePagination(page) {
    await this.setState({
      pageNumberJob: page,
    });
    this.getDataJob();
  }

  async handlePaginationWeeklyTask(page) {
    await this.setState({
      pageNumberTask: page,
    });
    this.getDataWeeklyTask();
  }
  componentDidMount() {
    if (localStorage.getItem("isRemember") != "true") {
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("tokenTimeStamp");
        localStorage.removeItem("isRemember");
      });
    }
    this.getInitData();
  }

  render() {
    const dataJob = this.state.dataJob;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />

        {this.state.isLoading ? <Fbloader /> : null}
        <div className="content d-flex flex-column flex-column-fluid">
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap container_user_cs">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-dark">
                        Dashboard
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container  container_user_cs">
              <div className="d-flex w_100 dr_col justify-content-center">
                <ListActiveJob
                  data={dataJob}
                  handlePagination={this.handlePagination.bind(this)}
                  pageSize={this.state.pageSize}
                  pageNumber={this.state.pageNumberJob}
                  totalRow={this.state.totalRowJob}
                  isLoading={this.state.isLoadingLiremoveContentTaskstJob}
                  changeStatusJob={this.changeStatusJob.bind(this)}
                  statusJob={this.state.statusJob}
                  startDate={this.state.startDateJob}
                  endDate={this.state.endDateJob}
                  applyTimeJob={this.applyTimeJob.bind(this)}
                  handleChangeDatePicker={this.handleChangeDatePicker}
                  role={this.props.role}
                />
                {this.props.role !== "Director" ? (
                  <Calendar />
                ) : (
                  <Performance
                    handleChangeDatePicker={this.handleChangeDatePicker}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    data={this.state.dataPerformance}
                    role={this.props.role}
                    applyTime={this.getDataPerformance}
                  />
                )}
              </div>

              <div className="d-flex w_100 dr_col justify-content-center">
                <WeeklyTask
                  data={this.state.dataWeeklyTask}
                  onChange={this.handleInputChangeNewTask.bind(this)}
                  startDate={this.state.startDateTask}
                  endDate={this.state.endDateTask}
                  startDateWeeklyTask={this.state.startDateWeeklyTask}
                  endDateWeeklyTask={this.state.endDateWeeklyTask}
                  member={this.state.dataListTeamMember}
                  teamMemberId={this.state.teamMemberId}
                  submitTask={this.handleCreateNewTask.bind(this)}
                  errors={this.state.errors}
                  clearValidate={this.clearValidate.bind(this)}
                  isLoading={this.state.isLoadingWeeklyTask}
                  handlePagination={this.handlePaginationWeeklyTask.bind(this)}
                  pageSize={this.state.pageSize}
                  pageNumber={this.state.pageNumberTask}
                  totalRow={this.state.totalRowTask}
                  role={this.props.role}
                  handleChangeDatePicker={this.handleChangeDatePicker}
                  applyTimeTask={this.applyTimeTask}
                  getDataWeeklyTask={this.getDataWeeklyTask}
                  handleChangeSelect={this.handleChangeSelect}
                  addContentTask={this.addContentTask}
                  contentTask={this.state.contentTask}
                  removeContentTask={this.removeContentTask}
                  handleChangePercentTask={this.handleChangePercentTask}
                  handleChangeContentTask={this.handleChangeContentTask}
                />
                {this.props.role === "Member" ? (
                  <RecruitmentProgress history={this.props.history} />
                ) : null}
                {this.props.role === "Leader" ? (
                  <Performance
                    handleChangeDatePicker={this.handleChangeDatePicker}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    data={this.state.dataPerformance}
                    role={this.props.role}
                    applyTime={this.getDataPerformance}
                  />
                ) : null}
                <Applicants />
                {this.props.role === "Director" ? (
                  <ManageMember
                    data={this.state.dataLastLogin}
                    history={this.props.history}
                    role={this.props.role}
                  />
                ) : null}
              </div>
            </div>
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
    role: state.auth.role,
    history: ownProps.history,
  };
};

export default connect(mapStateToProps)(Dashboard);
