import React, { Component } from "react";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./../style.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import moment from "moment";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import Create from "../../Modal/Interview/Create";
import _ from "lodash";
import Fbloader from "../../libs/PageLoader/fbloader";
import Network from "../../../Service/Network";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast";
import { convertDateLocal } from "../../../utils/common/convertDate";
import InterviewAssessment from "./InterviewAssessment";

const api = new Network();

class Interview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      jobs: [],
      isLoading: false,
      popoverDelete: false,
      candidates: [],
      formCreateInterview: false,
      arrayBooleanPopover: [],
      classToggleDetail: new Array(10).fill("hide_mb"),
      classArr: new Array(10).fill("fa fa-caret-right"),
      showReview: false,
      dataCandidate: {},
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataInterview = this.getDataInterview.bind(this);
    this.toggleFormCreateInterview = this.toggleFormCreateInterview.bind(this);
    this.getDataJob = this.getDataJob.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getDataCandidateById = this.getDataCandidateById.bind(this);
    this.deleteInterview = this.deleteInterview.bind(this);
    this.createInterview = this.createInterview.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.offPopoverDelete = this.offPopoverDelete.bind(this);
  }

  showDetail(index) {
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

  offPopoverDelete() {
    const arrayFalse = _.cloneDeep(this.arrayBoolean());
    this.setState({
      arrayBooleanPopover: arrayFalse,
    });
  }

  handleOnChangeJob(e) {
    this.setState({
      jobSelected: e,
    });
  }

  async getDataCandidateById(id) {
    const response = await api.get(`/api/candidate/interview/${id}`);
    if (response) {
      const candidates = _.map(response.data.candidate, (candidate) => {
        return {
          ...candidate,
          value: candidate.id,
          label: `${candidate.email} (${candidate.phone}) `,
        };
      });
      this.setState({
        candidates: candidates,
      });
    }
  }

  toggleFormCreateInterview() {
    this.setState({
      formCreateInterview: !this.state.formCreateInterview,
    });
  }

  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
      loading: true,
    });
    this.getDataInterview();
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return Promise.all([this.getDataInterview(), this.getDataJob()]);
  }

  async getDataJob() {
    try {
      const response = await api.get(`/api/jobs`);
      if (response) {
        this.setState({
          jobs: _.map(response.data.list, (job) => {
            return {
              value: job.id,
              label: job.title,
            };
          }),
        });
      }
    } catch (error) {}
  }

  async getDataInterview() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      const response = await api.get(
        `/api/admin/interview?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );

      if (response) {
        setTimeout(() => {
          self.setState({
            // isLoading: false,
            arrayBooleanPopover: new Array(response.data.list.length).fill(
              false
            ),
            data: response.data.list,
            totalRow: response.data.total,
            start: start,
            realSize: response.data.list.length,
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
  }

  async deleteInterview(id) {
    const response = await api.delete(`/api/admin/interview/${id}`);
    if (response) {
      this.getDataInterview();
      this.offPopoverDelete();
    }
  }

  async createInterview(data) {
    try {
      const response = await api.post(`/api/admin/interview`, data);
      if (response) {
        toast(<CustomToast title={"Create interview successed !"} />, {
          position: toast.POSITION.BOTTOM_RIGHT,
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
        this.toggleFormCreateInterview();
        this.getDataInterview();
      }
    } catch (error) {
      toast(
        <CustomToast title={"Interview time is overlapped !"} type={"error"} />,
        {
          position: toast.POSITION.TOP_CENTER,
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
        }
      );
    }
  }

  arrayBoolean = () => {
    return new Array(this.state.arrayBooleanPopover.length).fill(false);
  };

  togglePopover(index, boolean) {
    const arrayBooleanPopover = this.arrayBoolean();
    arrayBooleanPopover[index] = !boolean;
    this.setState({
      arrayBooleanPopover: arrayBooleanPopover,
    });
  }

  showInterviewCandidate = (candidate) => {
    // console.log("candidte", candidate);
    if (candidate.viewer === null) {
      toast.error(
        "This Candidate has not been set up interview. Please contact admin.",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else {
      this.setState({
        showReview: true,
        dataCandidate: candidate,
      });
    }
  };

  hideInterviewCandidate = () => {
    this.setState({
      showReview: false,
      dataCandidate: {},
    });
  };

  submitInterviewCandidate = async () => {
    this.fetchData();
  };

  render() {
    const data = this.state.data;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        <Create
          show={this.state.formCreateInterview}
          onHide={this.toggleFormCreateInterview}
          jobs={this.state.jobs}
          getDataCandidateById={this.getDataCandidateById}
          candidates={this.state.candidates}
          createInterview={this.createInterview}
        ></Create>

        <InterviewAssessment
          show={this.state.showReview}
          hide={this.hideInterviewCandidate}
          data={this.state.dataCandidate}
          submitInterviewCandidate={this.submitInterviewCandidate}
        />

        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}

          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-muted">
                        Fetch-Admin
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#" className="text-muted">
                        List interview
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">List interview</h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2"></div>

                    <a
                      onClick={this.toggleFormCreateInterview}
                      href="#"
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
                      New Interview
                    </a>
                  </div>
                </div>
                <div className="card-body">
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
                        <tr className="datatable-row" style={{ left: "0px" }}>
                          <th className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                            <span></span>
                          </th>
                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "137px" }}>Name</span>
                          </th>

                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "210px" }}>Email</span>
                          </th>
                          <th
                            data-field="Status"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "137px" }}>Phone</span>
                          </th>

                          <th
                            data-field="Status"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "137px" }}>
                              Time Interview
                            </span>
                          </th>

                          <th
                            data-field="Status"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "137px" }}>Time End</span>
                          </th>

                          <th
                            data-field="Actions"
                            data-autohide-disabled="false"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "137px" }}>Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="datatable-body" style={{}}>
                        {data.map((interview, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr
                                key={index}
                                data-row={1}
                                className="datatable-row datatable-row-even"
                                style={{ left: "0px" }}
                              >
                                <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                  <span
                                    className="datatable-toggle-detail"
                                    onClick={this.showDetail.bind(this, index)}
                                  >
                                    <i
                                      className={this.state.classArr[index]}
                                    ></i>
                                  </span>
                                </td>

                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                >
                                  <span style={{ width: "137px" }}>
                                    {interview.CandidateJob.Candidate.name}
                                  </span>
                                </td>

                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "210px" }}>
                                    {interview.CandidateJob.Candidate.email}
                                  </span>
                                </td>

                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "137px" }}>
                                    {interview.CandidateJob.Candidate.phone}
                                  </span>
                                </td>

                                <td
                                  data-field="ShipDate"
                                  aria-label="9/3/2017"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "137px" }}>
                                    {convertDateLocal(interview.timeInterview)}
                                  </span>
                                </td>
                                <td
                                  data-field="ShipDate"
                                  aria-label="9/3/2017"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "137px" }}>
                                    {convertDateLocal(
                                      interview.timeInterviewEnd
                                    )}
                                  </span>
                                </td>
                                <td
                                  data-field="Actions"
                                  data-autohide-disabled="false"
                                  aria-label="null"
                                  className="datatable-cell"
                                >
                                  <span
                                    style={{
                                      overflow: "visible",
                                      position: "relative",
                                      width: "125px",
                                    }}
                                  >
                                    <span
                                      className="btn btn-sm btn-clean btn-icon mr-2"
                                      title="Review Candidate"
                                    >
                                      <i
                                        onClick={() =>
                                          this.showInterviewCandidate(interview)
                                        }
                                        className="fas fa-user-edit"
                                      ></i>
                                    </span>

                                    <Link
                                      to={`/interview/${interview.id}`}
                                      className="btn btn-sm btn-clean btn-icon mr-2"
                                      title="Edit details"
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
                                            <rect
                                              x={0}
                                              y={0}
                                              width={24}
                                              height={24}
                                            />
                                            <path
                                              d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                                              fill="#000000"
                                              fillRule="nonzero"
                                              transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "
                                            />
                                            <rect
                                              fill="#000000"
                                              opacity="0.3"
                                              x={5}
                                              y={20}
                                              width={15}
                                              height={2}
                                              rx={1}
                                            />
                                          </g>
                                        </svg>
                                      </span>
                                    </Link>
                                    <a
                                      id={`Popover-${interview.id}`}
                                      onClick={() =>
                                        this.togglePopover(
                                          index,
                                          this.state.arrayBooleanPopover[index]
                                        )
                                      }
                                      className="btn btn-sm btn-clean btn-icon"
                                      title="Delete"
                                      style={
                                        this.props.role == "Member"
                                          ? { display: "none" }
                                          : null
                                      }
                                    >
                                      <Popover
                                        isOpen={
                                          this.state.arrayBooleanPopover[index]
                                        }
                                        target={`Popover-${interview.id}`}
                                        trigger="legacy"
                                        placement="bottom"
                                        toggle={this.offPopoverDelete}
                                      >
                                        <PopoverHeader>
                                          Confirm Delete Interview
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <div className="text-center">
                                            <button
                                              onClick={() =>
                                                this.deleteInterview(
                                                  interview.id
                                                )
                                              }
                                              type="button"
                                              className="btn btn-outline-danger btn-sm btn-sm-cs mr-2"
                                            >
                                              Delete
                                            </button>
                                            <button
                                              onClick={this.offPopoverDelete}
                                              type="button"
                                              className="btn btn-outline-secondary btn-sm btn-sm-cs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </PopoverBody>
                                      </Popover>
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
                                    </a>
                                  </span>
                                </td>
                              </tr>

                              <tr
                                className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                              >
                                <td
                                  className="datatable-detail cus-datatable"
                                  colSpan="9"
                                >
                                  <table>
                                    <tbody>
                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Email</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            {
                                              interview.CandidateJob.Candidate
                                                .email
                                            }
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Phone</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            {
                                              interview.CandidateJob.Candidate
                                                .phone
                                            }
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Time Interview</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          {/* <span style={{ width: 110 }}>
                                            {`${moment(interview.timeInterview).utc().format('DD/MM/YYYY')} ${moment(interview.timeInterview).add(17, 'hours').format('HH:mm')}`}
                                          </span> */}
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
  };
};

export default connect(mapStateToProps)(Interview);
