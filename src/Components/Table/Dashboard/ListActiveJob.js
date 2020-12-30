import React, { Component } from "react";
import Pagination from "rc-pagination";
import { NavLink } from "react-router-dom";
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import Skeleton from "react-loading-skeleton";

const styles = (theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(2),
    width: 165,
    fontFamily: "Poppins ,sans-serif",
  },
});
class ListActiveJob extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderClassJobStatus = this.renderClassJobStatus.bind(this);
  }
  renderClassJobStatus(jobStatus) {
    switch (jobStatus) {
      case "Active":
        return "text-primary";
      case "Pending":
        return "text-warning";
      default:
        return "text-danger";
    }
  }
  componentDidMount() {}
  render() {
    const data = this.props.data;
    const status = this.props.statusJob;
    const { classes } = this.props;
    return (
      <div className="col-xl-8 pl-0 prm_0">
        <div className="card card-custom gutter-b">
          <div className="card-header card-header-mobile border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                {this.props.statusJob} Jobs
              </span>
            </h3>
            <div className="card-toolbar">
              {this.props.role != "Member" ? (
                <ul className="nav nav-pills nav-pills-sm nav-dark-75">
                  <li className="nav-item">
                    <div
                      onClick={this.props.changeStatusJob.bind(this, "Active")}
                      className={`nav-link py-2 px-4 ${
                        status == "Active" ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      Active
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      onClick={this.props.changeStatusJob.bind(this, "Pending")}
                      className={`nav-link py-2 px-4 ${
                        status == "Pending" ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      Pending
                    </div>
                  </li>
                  <li className="nav-item">
                    <div
                      onClick={this.props.changeStatusJob.bind(this, "Close")}
                      className={`nav-link py-2 px-4 ${
                        status == "Close" ? "active" : null
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      Close
                    </div>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
          <div className="card-body pt-2 pb-0 body_card_dashboard">
            <div className="mb-4" style={{display: 'none'}}>
              {this.props.role == "Member" ? null : (
                <div className="row align-items-flex-end cs_filter_time d-flex" >
                  <DatetimePickerTrigger
                    moment={this.props.startDate}
                    onChange={(_moment) =>
                      this.props.handleChangeDatePicker(_moment, "startDateJob")
                    }
                    maxDate={this.props.endDate}
                    className="custom_date_pickeer_job"
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
                      this.props.handleChangeDatePicker(_moment, "endDateJob")
                    }
                    minDate={this.props.startDate}
                    className="custom_date_pickeer_job right"
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

                  <div
                    onClick={this.props.applyTimeJob.bind(this)}
                    className="btn btn-primary font-weight-bold btn-sm"
                  >
                    Apply
                  </div>
                </div>
              )}
            </div>
            <div className="tab-content mt-5" id="myTabTables6">
              <div
                className="tab-pane fade show active"
                id="kt_tab_pane_6_3"
                role="tabpanel"
                aria-labelledby="kt_tab_pane_6_3"
              >
                {data.length == 0 ? (
                  <div className="wrapp_no_result">
                    <img
                      className="no_result_job"
                      src="/img/no_result_per.png"
                    />
                    <div>No result in this time!</div>
                  </div>
                ) : (
                  <div style={{display:'flex', justifyContent:'space-between',  flexDirection: 'column', height:'368px'}} className="table-responsive">
                    <table className="table table-borderless table-vertical-center">
                      <thead>
                        <tr>
                          <th className="p-0 min-w-140px" />
                          <th className="p-0 min-w-120px" />
                          <th className="p-0 min-w-70px" />
                          <th className="p-0 min-w-70px" />
                          <th className="p-0 min-w-50px" />
                        </tr>
                      </thead>
                      <tbody>
                        {!this.props.isLoading ? (
                          data.map((job, index) => {
                            return (
                              <tr key={index} className="cs_tr">
                                <td className="pl-0">
                                  <NavLink
                                    title={job.title}
                                    to={`/job-detail/${job.id}`}
                                    className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg d-block cs_title_job_dashboard"
                                  >
                                    {job.title}
                                  </NavLink>
                                  <span className="text-muted font-weight-bold d-block">
                                    {job.type}{" "}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="text-muted font-weight-bold d-block font-size-sm">
                                    Team
                                  </span>
                                  <span className="text-dark-75 font-weight-bold d-block font-size-lg">
                                    {job.nameTeam}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="text-muted font-weight-bold d-block font-size-sm">
                                    Candidates
                                  </span>
                                  <span className="text-dark-75 font-weight-bold d-block font-size-lg">
                                    {job.numberCandidate}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span
                                    className={`font-weight-bolder ${this.renderClassJobStatus(
                                      job.jobStatus
                                    )}`}
                                  >
                                    {job.jobStatus}
                                  </span>
                                  <span className="text-dark-75 font-weight-bold d-block font-size-lg">
                                    {job.follower} follower
                                  </span>
                                </td>
                                <td className="text-right pr-0">
                                  <NavLink
                                    to={`/job-detail/${job.id}`}
                                    className="btn btn-icon btn-light btn-sm"
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
                                          <polygon points="0 0 24 0 24 24 0 24" />
                                          <rect
                                            fill="#000000"
                                            opacity="0.3"
                                            transform="translate(12.000000, 12.000000) rotate(-90.000000) translate(-12.000000, -12.000000)"
                                            x={11}
                                            y={5}
                                            width={2}
                                            height={14}
                                            rx={1}
                                          />
                                          <path
                                            d="M9.70710318,15.7071045 C9.31657888,16.0976288 8.68341391,16.0976288 8.29288961,15.7071045 C7.90236532,15.3165802 7.90236532,14.6834152 8.29288961,14.2928909 L14.2928896,8.29289093 C14.6714686,7.914312 15.281055,7.90106637 15.675721,8.26284357 L21.675721,13.7628436 C22.08284,14.136036 22.1103429,14.7686034 21.7371505,15.1757223 C21.3639581,15.5828413 20.7313908,15.6103443 20.3242718,15.2371519 L15.0300721,10.3841355 L9.70710318,15.7071045 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            transform="translate(14.999999, 11.999997) scale(1, -1) rotate(90.000000) translate(-14.999999, -11.999997)"
                                          />
                                        </g>
                                      </svg>
                                    </span>
                                  </NavLink>
                                </td>
                              </tr>
                            );
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
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right pr-0">
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
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right pr-0">
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
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right pr-0">
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
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right pr-0">
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
                              <td className="text-right">
                                <Skeleton height={24} />
                              </td>
                              <td className="text-right pr-0">
                                <Skeleton height={24} />
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
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
export default ListActiveJob;
