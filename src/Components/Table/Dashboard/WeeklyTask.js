import React, { Component } from "react";
import Pagination from "rc-pagination";
import Skeleton from "react-loading-skeleton";
import NewTask from "../../Modal/Dashboard/NewTask.js";
import DetailTask from "../../Modal/Dashboard/DetailTask.js";
import EditTask from "../../Modal/Dashboard/EditTask.js";
import moment from "moment";
import { defaultAva, domainServer } from "../../../utils/config.js";
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import Network from "../../../Service/Network";
import toastr from "toastr";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast.js";
import { rulesEditTask } from "../../../utils/rule.js";
import Validator from "../../../utils/validator.js";

const api = new Network();
toastr.options = {
  positionClass: "toast-top-right",
};

class WeeklyTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNewTask: false,
      currentTask: null,
      isShowDetailTask: false,
      isShowEditTask: false,
      // edit task state
      id: "",
      userId: {
        value: "",
        label: "",
      },
      contentTask: [],
      startDate: "",
      endDate: "",
      errors: {},
    };
    this.toggleNewTask = this.toggleNewTask.bind(this);
    this.openDetailTask = this.openDetailTask.bind(this);
    this.openEditTask = this.openEditTask.bind(this);
    this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.submitTask = this.submitTask.bind(this);
    this.validator = new Validator(rulesEditTask);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.addContentTask = this.addContentTask.bind(this);
    this.removeContentTask = this.removeContentTask.bind(this);
    this.handleChangePercentTask = this.handleChangePercentTask.bind(this);
    this.handleChangeContentTask = this.handleChangeContentTask.bind(this);
    this.handleChangeTargetTask = this.handleChangeTargetTask.bind(this);
  }
  handleChangePercentTask(i, event) {
    let contentTask = this.state.contentTask;
    contentTask[i].percent = event.target.value;
    this.setState({ contentTask });
  }
  handleChangeTargetTask(i, event) {
    let contentTask = this.state.contentTask;
    contentTask[i].target = event.target.value;
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
      contentTask: [
        ...prevState.contentTask,
        { content: "", percent: "", target: "" },
      ],
    }));
  }
  handleChangeSelect(e, type) {
    let { value, label } = e;
    console.log(label, value);
    if (type == "userId") {
      this.setState({
        userId: {
          value: value,
          label: label,
        },
      });
    }
  }
  handleChangeDatePicker(_moment, name, type) {
    this.setState({
      [name]: moment(_moment).format("DD/MM/YYYY"),
    });
  }
  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  async submitTask() {
    const errors = this.validator.validate(this.state);
    const contentTask = await this.state.contentTask.map((task, index) => {
      if (task.content == "" || task.percent == "" || task.target == "") {
        return {
          content: task.content == "" ? "content not null" : null,
          percent: task.percent == "" ? "percent not null" : null,
          target: task.target == "" ? "target not null" : null,
        };
      } else {
        return {};
      }
    });
    if (contentTask.find((e) => !this.isEmpty(e))) {
      errors["contentTask"] = contentTask;
    }
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      try {
        const data = {
          userId: this.state.userId.value,
          content: this.state.contentTask,
          startDate: moment(this.state.startDate, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
          endDate: moment(this.state.endDate, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          ),
        };
        console.log(data);
        const response = await api.patch(`/api/task/${this.state.id}`, data);
        if (response) {
          toast(<CustomToast title={"Update Success!"} />, {
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
          this.props.getDataWeeklyTask();
          this.openEditTask(false);
        }
      } catch (error) {
        console.log("err submit edit task: ", error);
      }
    }
  }
  handleOnChange(e) {
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
  openEditTask(isShow, task) {
    // console.log(task, isShow);
    let self = this;
    // console.log(self.props.member);
    if (isShow) {
      this.setState(
        {
          id: task.id,
          userId: {
            label: self.props.member.find((member) => member.id == task.userId)
              .name,
            value: task.userId,
          },
          startDate: task.startDate,
          endDate: task.endDate,
          contentTask: task.content,
          isShowDetailTask: false,
        },
        function () {
          this.setState({
            isShowEditTask: isShow,
          });
          // console.log(this.state.userId);
        }
      );
    } else {
      this.setState({
        isShowEditTask: isShow,
        userId: "",
        content: "",
        startDate: "",
        endDate: "",
        id: "",
      });
    }
  }
  openDetailTask(isShow, task) {
    if (isShow) {
      const newTaskContent = task.content.map((e, i) => {
        return {
          ...e,
          target: e.target ? e.target : "",
        };
      });
      task.content = newTaskContent;
      this.setState({
        isShowDetailTask: isShow,
        currentTask: task,
      });
    } else {
      this.setState({
        isShowDetailTask: isShow,
        currentTask: null,
      });
    }
  }
  toggleNewTask(isShow) {
    this.setState({
      isShowNewTask: isShow,
    });
    if (!isShow) {
      this.props.clearValidate();
    }
  }
  renderHeader(role) {
    if (role === "Member") {
      return (
        <thead>
          <tr>
            <th
              className="p-0"
              style={{
                minWidth: "140px",
                maxWidth: "400px",
                overFlow: "hidden",
              }}
            />
          </tr>
        </thead>
      );
    } else {
      return (
        <thead>
          <tr>
            <th className="p-0" style={{ width: "50px" }} />
            <th className="p-0" style={{ minWidth: "150px" }} />
            <th
              className="p-0"
              style={{
                minWidth: "140px",
                maxWidth: "200px",
                overFlow: "hidden",
              }}
            />
          </tr>
        </thead>
      );
    }
  }
  renderRow(index, task, role) {
    // console.log(role);
    if (role === "Member") {
      return (
        <tr key={index} className="row_weektask" style={{ border: "none" }}>
          <td className="text-left pl-0" style={{ maxWidth: "446px" }}>
            <div>
              <div className="text-dark font-weight-bold font-size-lg ">{`${task.startDate} - ${task.endDate}`}</div>
              {task.content.map((e, index) => {
                if (e) {
                  return (
                    <p
                      key={index}
                      className="text-muted font-weight-bold m-0 pt-1 "
                      style={{ fontSize: "12px" }}
                    >
                      {`${e.content} (achievement: ${e.percent}%), (target: ${e.target}%)`}
                    </p>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={index}>
          <td className="pl-0 py-5">
            <div className="symbol symbol-50 symbol-light mr-2">
              <span className="symbol-label symbol-label-cs">
                <img
                  src={
                    task.user.linkAvatar
                      ? domainServer + "/" + task.user.linkAvatar
                      : defaultAva
                  }
                  className="h-100 align-self-center"
                  alt=""
                />
              </span>
            </div>
          </td>
          <td className="pl-0">
            <div
              onClick={this.openDetailTask.bind(this, true, task)}
              style={{
                cursor: "pointer",
              }}
              className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg"
            >
              {task.user.name}
            </div>
            <span className="text-muted font-weight-bold d-block">
              {task.user.nameTeam}
            </span>
          </td>
          <td className="text-right pr-0" style={{ maxWidth: "446px" }}>
            <div
              className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg"
              style={{ fontSize: "12px" }}
            >
              {task.startDate} - {task.endDate}
            </div>
            <input
              className="form-control form-control-solid input_cs_dashboard text-muted font-weight-bold"
              type="text"
              readOnly
              value={task.content
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.content + ", ",
                  ""
                )
                .slice(0, -2)}
            ></input>
          </td>
        </tr>
      );
    }
  }
  render() {
    const data = this.props.data;
    const { classes } = this.props;
    return (
      <div className="col-lg-4 pl-0 plm_0 prm_0">
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        {this.props.role === "Leader" ? (
          <NewTask
            show={this.state.isShowNewTask}
            onHide={this.toggleNewTask.bind(this, false)}
            onChange={this.props.onChange}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            member={this.props.role === "Leader" ? this.props.member : []}
            teamMemberId={this.props.teamMemberId}
            submitTask={this.props.submitTask}
            errors={this.props.errors}
            handleChangeDatePicker={this.props.handleChangeDatePicker}
            handleChangeSelect={this.props.handleChangeSelect}
            addContentTask={this.props.addContentTask}
            contentTask={this.props.contentTask}
            removeContentTask={this.props.removeContentTask}
            handleChangePercentTask={this.props.handleChangePercentTask}
            handleChangeContentTask={this.props.handleChangeContentTask}
            handleChangeTargetTask={this.props.handleChangeTargetTask}
          />
        ) : null}
        <EditTask
          show={this.state.isShowEditTask}
          member={this.props.role === "Leader" ? this.props.member : []}
          onHide={this.openEditTask.bind(this, false)}
          userId={this.state.userId}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          content={this.state.content}
          handleChangeDatePicker={this.handleChangeDatePicker}
          onChange={this.handleOnChange}
          submitTask={this.submitTask}
          errors={this.state.errors}
          handleChangeSelect={this.handleChangeSelect}
          addContentTask={this.addContentTask}
          contentTask={this.state.contentTask}
          removeContentTask={this.removeContentTask}
          handleChangePercentTask={this.handleChangePercentTask}
          handleChangeContentTask={this.handleChangeContentTask}
          handleChangeTargetTask={this.handleChangeTargetTask}
        />
        <DetailTask
          show={this.state.isShowDetailTask}
          onHide={this.openDetailTask.bind(this, false)}
          data={this.state.currentTask}
          openEditTask={this.openEditTask}
        />
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-header card-header-mobile border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                Weekly Task
              </span>
            </h3>
            {/* {this.props.role === "Member" ? (
              <div className="card-title align-items-start flex-column">
                <div className="week_day">
                  {data[0] ? `${data[0].startDate} - ${data[0].endDate}` : null}
                </div>
              </div>
            ) : null} */}
            {this.props.role === "Leader" ? (
              <div className="card-toolbar">
                <div
                  className="btn btn-primary font-weight-bolder font-size-sm "
                  onClick={this.toggleNewTask.bind(this, true)}
                >
                  New Task
                </div>
              </div>
            ) : null}
          </div>
          <div className="card-body pt-0 pb-0 body_card_dashboard_task">
            <div className="mb-5 ml--10 mr--10">
              <div className=" align-items-flex-end">
                <div className="">
                  <div className=" align-items-center sp_bw">
                    <div className="">
                      <div className="d-flex align-items-center">
                        <div className="wrap_date_picker">
                          <DatetimePickerTrigger
                            moment={this.props.startDateWeeklyTask}
                            onChange={(_moment) =>
                              this.props.handleChangeDatePicker(
                                _moment,
                                "startDateWeeklyTask"
                              )
                            }
                            maxDate={this.props.endDateWeeklyTask}
                            className="custom_date_pickeer "
                            showTimePicker={false}
                          >
                            <div className="label_date_pick">From</div>
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="From"
                                value={this.props.startDateWeeklyTask.format(
                                  "DD/MM/YYYY"
                                )}
                                readOnly
                              />
                              <div className="input-group-append">
                                <span className="input-group-text">
                                  <i className="la la-calendar icon-lg"></i>
                                </span>
                              </div>
                            </div>
                          </DatetimePickerTrigger>
                          <DatetimePickerTrigger
                            moment={this.props.endDateWeeklyTask}
                            onChange={(_moment) =>
                              this.props.handleChangeDatePicker(
                                _moment,
                                "endDateWeeklyTask"
                              )
                            }
                            minDate={this.props.startDateWeeklyTask}
                            className="custom_date_pickeer  right"
                            showTimePicker={false}
                          >
                            <div className="label_date_pick">To</div>
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="To"
                                value={this.props.endDateWeeklyTask.format(
                                  "DD/MM/YYYY"
                                )}
                                readOnly
                              />
                              <div className="input-group-append">
                                <span className="input-group-text">
                                  <i className="la la-calendar icon-lg"></i>
                                </span>
                              </div>
                            </div>
                          </DatetimePickerTrigger>
                          <div
                            onClick={this.props.applyTimeTask.bind(this)}
                            className="btn btn-primary font-weight-bold btn-sm"
                          >
                            Apply
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-content mt-0" id="myTabTables2">
              <div
                className="tab-pane fade show active"
                id="kt_tab_pane_2_3"
                role="tabpanel"
                aria-labelledby="kt_tab_pane_2_3"
              >
                {data.length == 0 ? (
                  <div className="wrapp_no_result">
                    <img
                      className="no_result_per"
                      src="/img/no_result_per.png"
                    />
                    <div>No result in this time!</div>
                  </div>
                ) : (
                  <div className="table-responsive table_weekly_task">
                    <table className="table table-borderless table-vertical-center ">
                      {this.renderHeader(this.props.role)}
                      <tbody>
                        {!this.props.isLoading ? (
                          data.map((task, index) => {
                            return this.renderRow(index, task, this.props.role);
                          })
                        ) : (
                          <>
                            <tr className="cs_tr" style={{ height: "60px" }}>
                              <td className="pl-0">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                            <tr className="cs_tr" style={{ height: "60px" }}>
                              <td className="pl-0">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                            <tr className="cs_tr" style={{ height: "60px" }}>
                              <td className="pl-0">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                            <tr className="cs_tr" style={{ height: "60px" }}>
                              <td className="pl-0">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                            <tr className="cs_tr" style={{ height: "60px" }}>
                              <td className="pl-0">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                    {/* {this.props.role == "Member" ? null : (
                      <div className="datatable-pager datatable-paging-loaded fl_end">
                        <Pagination
                          defaultPageSize={this.props.pageSize}
                          current={this.props.pageNumber}
                          hideOnSinglePage={true}
                          showTitle={false}
                          onChange={this.props.handlePagination}
                          total={this.props.totalRow}
                          showLessItems={true}
                        />
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default WeeklyTask;
