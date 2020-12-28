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
class NewTask extends Component {
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
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
          <button onClick={self.submitTask} className="btn btn-primary mr-2">
            Save
          </button>
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  async submitTask() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      const response = await this.props.submitTask();
      if (response) {
        self.setState({
          isLoading: false,
        });
        self.props.onHide();
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

  render() {
    let self = this;
    const props = this.props;
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                titleJob: "Create New Task",
              }),
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            height={525}
            width={520}
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
                          moment={moment(this.props.startDate)}
                          onChange={(_moment) =>
                            this.props.handleChangeDatePicker(
                              _moment,
                              "startDateTask"
                            )
                          }
                          maxDate={this.props.endDate}
                          className="custom_date_pickeer new_task_cs date_newtask"
                          showTimePicker={false}
                        >
                          <div className="label_date_pick">From</div>
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="From"
                              value={this.props.startDate.format("DD/MM/YYYY")}
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
                          moment={this.props.endDate}
                          onChange={(_moment) =>
                            this.props.handleChangeDatePicker(
                              _moment,
                              "endDateTask"
                            )
                          }
                          minDate={this.props.startDate}
                          className="custom_date_pickeer new_task_cs right date_newtask"
                          showTimePicker={false}
                        >
                          <div className="label_date_pick">To</div>
                          <div className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control "
                              placeholder="To"
                              value={this.props.endDate.format("DD/MM/YYYY")}
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
                      Team Member
                      <span className="text-danger">*</span>
                    </label>
                    <div className="col-lg-9 pr-0 pl-0 col-md-9 col-sm-12">
                      <Select
                        name="teamMemberId"
                        className={
                          props.errors.teamMemberId ? "invalid-selected" : ""
                        }
                        options={props.member.map((member, index) => {
                          return {
                            value: member.id,
                            label: member.name,
                          };
                        })}
                        value={props.teamMemberId}
                        onChange={(e) =>
                          this.props.handleChangeSelect(e, "teamMemberId")
                        }
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-0">
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
                    <div className="col-lg-9 pr-0 pl-0 wrap_all_content">
                    
                      {this.props.contentTask.map((task, index) => {
                        return (
                          <div className="row row_input_task" key={index}>
                            <div className="col-lg-8 pr-0">
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
                            <div className="col-lg-3 ">
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
                            <div className="col-lg-1 pl-0">
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

export default NewTask;
