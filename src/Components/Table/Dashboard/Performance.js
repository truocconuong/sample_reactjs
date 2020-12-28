import React, { Component } from "react";
import { Tabbordion, TabPanel, TabLabel, TabContent } from "react-tabbordion";
import { defaultAva, domainServer } from "../../../utils/config.js";

import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";

const blockElements = {
  animator: "accordion-animator",
  content: "accordion-content",
  panel: "accordion-panel",
  label: "accordion-title",
};

class Performance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "1990-06-05",
      format: "YYYY-MM-DD",
      inputFormat: "DD/MM/YYYY",
      mode: "date",
    };
  }
  onChange({ index, mode }) {
    // let currenPanels = this.state.panels;
    // currenPanels[index].checked = !currenPanels[index].checked;
    // this.setState({
    //   panels: [...currenPanels],
    // });
  }
  onPanels(panels) {
    this.setState({ panels });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this.setState({
        panels: nextProps.data.map((e, i) => {
          return {
            checked: true,
            disabled: false,
            index: i,
            visible: true,
          };
        }),
      });
    }
  }

  render() {
    const data = this.props.data;
    return (
      <div className="col-xl-4 plm_0 prm_0">
        <div className="card card-custom card-stretch gutter-b">
         
          <div className="card-header card-header-mobile border-0 pt-5">
           
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                Performance
              </span>
             
            </h3>
          </div>
         
          <div className="card-body pt-0">
            {this.props.role == "Member" ? (
              <div className="block_point">
                <img className="lock_role" src="/img/lock.jpg" />
              </div>
            ) : (
              <div>
                <div className="mb-5 ml--10 mr--10">
                  <div className="wrap_date_picker">
                    <DatetimePickerTrigger
                      moment={this.props.startDate}
                      onChange={(_moment) =>
                        this.props.handleChangeDatePicker(
                          _moment,
                          "startDate",
                          "performance"
                        )
                      }
                      maxDate={this.props.endDate}
                      className="custom_date_pickeer"
                      showTimePicker={false}
                    >
                      <div className="label_date_pick">From</div>
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control"
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
                          "endDate",
                          "performance"
                        )
                      }
                      minDate={this.props.startDate}
                      className="custom_date_pickeer right"
                      showTimePicker={false}
                    >
                      <div className="label_date_pick">To</div>
                      <div className="input-group input-group-sm">
                        <input
                          type="text"
                          className="form-control"
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
                    <div className=" mt-5 mt-lg-0">
                      <div
                        onClick={this.props.applyTime.bind(this)}
                        className="btn btn-primary font-weight-bold btn-sm"
                      >
                        Apply
                      </div>
                    </div>
                  </div>
                </div>

                {data.length == 0 ? (
                  <div className="wrapp_no_result">
                    <img
                      className="no_result_per"
                      src="/img/no_result_per.png"
                    />
                    <div>No result in this time!</div>
                  </div>
                ) : (
                  <Tabbordion
                    blockElements={blockElements}
                    className="accordion"
                    name="tabs"
                    animateContent="height"
                    mode="multiple"
                    panels={this.state.panels}
                    onPanels={this.onPanels.bind(this)}
                    onChange={this.onChange.bind(this)}
                  >
                    {data.map((team, index) => {
                      return (
                        <TabPanel key={index}>
                          <TabLabel>
                            <div className="d-flex align-items-center">
                              <div className="d-flex flex-column flex-grow-1">
                                <div className="font-weight-bolder text-dark-75 text-hover-primary font-size-lg mb-1 title_ac">
                                  {team.name}
                                </div>
                                <span className="text-muted font-weight-bold">
                                  {team.total} CV
                                </span>
                              </div>
                            </div>
                          </TabLabel>
                          <TabContent>
                            <div>
                              <table className="table table-borderless table-vertical-center">
                                <thead>
                                  <tr>
                                    <th className="p-0 w-50px" />
                                    <th className="p-0 min-w-140px" />
                                    <th className="p-0 min-w-70px" />
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(team.memberTeam)
                                    ? team.memberTeam.map((member, i) => {
                                        return (
                                          <tr key={i}>
                                            <td className="pl-0 pd_cs">
                                              <div className="symbol symbol-50 symbol-light mr-2 mt-2">
                                                <span className="symbol-label symbol-label-cs">
                                                  <img
                                                    src={
                                                      member.linkAvatar
                                                        ? domainServer +
                                                          "/" +
                                                          member.linkAvatar
                                                        : defaultAva
                                                    }
                                                    className="h-100 align-self-end"
                                                    alt=""
                                                  />
                                                </span>
                                              </div>
                                            </td>
                                            <td className="pl-0 pd_cs">
                                              <div className="text-dark font-weight-normal text-hover-primary mb-1 font-size-lg">
                                                {member.name}
                                              </div>
                                              <span className="text-muted font-weight-bold d-block">
                                                Member
                                              </span>
                                            </td>

                                            <td className="text-right pd_cs">
                                              <span className="text-muted font-weight-bold d-block font-size-sm">
                                                CV
                                              </span>
                                              <span className="text-dark-75 font-weight-bold d-block font-size-lg">
                                                {member.totalCv}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    : null}
                                </tbody>
                              </table>
                            </div>
                          </TabContent>
                        </TabPanel>
                      );
                    })}
                  </Tabbordion>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}

export default Performance;
