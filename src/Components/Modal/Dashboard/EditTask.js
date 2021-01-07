import React, { Component } from "react";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";
import "../style.css";
import "./style.css";
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import moment from "moment";
import Select from "react-select";

const customStyles = {
  menuList: (styles) => ({ ...styles, maxHeight: "130px" }),
};
class EditTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      errors: {},
      isLoading: false,
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.submitTask = this.submitTask.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }
  async submitTask() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      const response = await this.props.submitTask();
      if (response) {
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
          self.props.onHide();
        }, 500);
      } else {
        self.setState({
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("submit task err: ", error);
      this.setState({
        isLoading: false,
      });
    }
  }
  renderHeaderCustom(data) {
    return (
      <div className="header_modal_cs">
        <h4 style={{ marginBottom: "0" }}>{data.titleJob}</h4>
      </div>
    );
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div>
          {/* <div>
            {`Total target: ${this.calcTotal(this.props.contentTask, "target")}%`}
          </div>
          <div>
            {`Total achievement: ${this.calcTotal(this.props.contentTask, "percent")}%`}
          </div> */}
        </div>
        <div className="modal-cus__right text-right">
          <button onClick={self.submitTask} className="btn btn-primary mr-2">
            Update
          </button>
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  render() {
    let self = this;
    const errors = this.state.errors;
    const props = this.props;
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                titleJob: "Edit Task",
              }),
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            height={502}
            width={560}
          >
            <div>
              <div className="form">
                <div className="card-body card-body-newtask pb-0">
                  <div className="form-group row ">
                    <label className="col-form-label col-lg-3">
                      Deadline
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-9 pr-0 pl-0">
                      <div className="wrap_date_picker">
                        <DatetimePickerTrigger
                          moment={moment(this.props.startDate, "DD/MM/YYYY")}
                          onChange={(_moment) =>
                            this.props.handleChangeDatePicker(
                              _moment,
                              "startDate"
                            )
                          }
                          maxDate={moment(this.props.endDate, "DD/MM/YYYY")}
                          className="custom_date_pickeer new_task_cs date_newtask"
                          showTimePicker={false}
                        >
                          <div className="label_date_pick">From</div>
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="From"
                              value={this.props.startDate}
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
                          moment={moment(this.props.endDate, "DD/MM/YYYY")}
                          onChange={(_moment) =>
                            this.props.handleChangeDatePicker(
                              _moment,
                              "endDate"
                            )
                          }
                          minDate={moment(this.props.startDate, "DD/MM/YYYY")}
                          className="custom_date_pickeer new_task_cs right date_newtask"
                          showTimePicker={false}
                        >
                          <div className="label_date_pick">To</div>
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="To"
                              value={this.props.endDate}
                              readOnly
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">
                                <i className="la la-calendar icon-lg"></i>
                              </span>
                            </div>
                          </div>
                        </DatetimePickerTrigger>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label  col-lg-3 ">
                      Name
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-9 pr-0 pl-0 col-md-9 col-sm-12">
                      <Select
                        name="userId"
                        className={
                          props.errors.teamMemberId ? "invalid-selected" : ""
                        }
                        options={props.member.map((member, index) => {
                          return {
                            value: member.id,
                            label: member.name,
                          };
                        })}
                        value={props.userId}
                        onChange={(e) =>
                          this.props.handleChangeSelect(e, "userId")
                        }
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="form-group row ">
                    <label className="col-form-label col-lg-3">
                      Task
                      <span className="text-danger">*</span>
                      <span
                        className="btn btn-icon btn-xs btn-outline-primary btn-circle ml-3"
                        onClick={this.props.addContentTask}
                      >
                        <i className="flaticon2-plus"></i>
                      </span>
                    </label>
                    <div className="col-lg-9 pr-0 pl-0">
                      <div className="row row_input_task_cs">
                        <div className="col-lg-7 pr-0 cs_task_title">
                          Task content
                        </div>
                        <div className="col-lg-2 pr-0 cs_task_title">
                          Achievement
                        </div>
                        <div className="col-lg-2 pr-0 cs_task_title">
                          Target
                        </div>
                      </div>
                      {props.contentTask.map((task, index) => {
                        return (
                          <div className="row row_input_task" key={index}>
                            <div className="col-lg-7 pr-0">
                              <input
                                className={
                                  props.errors.contentTask
                                    ? props.errors.contentTask[index]
                                      ? props.errors.contentTask[index].content
                                        ? "form-control is-invalid"
                                        : "form-control "
                                      : "form-control "
                                    : "form-control "
                                }
                                type="text"
                                value={task.content}
                                onChange={this.props.handleChangeContentTask.bind(
                                  this,
                                  index
                                )}
                              ></input>
                            </div>
                            <div className="col-lg-2 pr-0 ">
                              <input
                                className={
                                  props.errors.contentTask
                                    ? props.errors.contentTask[index]
                                      ? props.errors.contentTask[index].percent
                                        ? "form-control is-invalid"
                                        : "form-control "
                                      : "form-control "
                                    : "form-control "
                                }
                                type="number"
                                min="0"
                                max="100"
                                value={task.percent}
                                onChange={this.props.handleChangePercentTask.bind(
                                  this,
                                  index
                                )}
                              ></input>
                            </div>
                            <div className="col-lg-2 pr-0">
                              <input
                                className={
                                  props.errors.contentTask
                                    ? props.errors.contentTask[index]
                                      ? props.errors.contentTask[index].target
                                        ? "form-control is-invalid"
                                        : "form-control "
                                      : "form-control "
                                    : "form-control "
                                }
                                name="target"
                                type="number"
                                min="0"
                                max="100"
                                value={task.target}
                                onChange={this.props.handleChangeTargetTask.bind(
                                  this,
                                  index
                                )}
                              ></input>
                            </div>
                            <div className="col-lg-1 pr-0 pl-0">
                              <div
                                className="wrap_delete_task"
                                onClick={this.props.removeContentTask.bind(
                                  this,
                                  index
                                )}
                              >
                                <i className="flaticon2-trash icon_trash"></i>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

export default EditTask;
