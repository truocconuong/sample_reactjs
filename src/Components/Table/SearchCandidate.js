import React, { Component } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./style.css";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import CandidateDetail from "../Modal/Candidate/DetailCandidateTable.js";
import Select from "react-select";
import _ from "lodash";
import PreviewPdf from "../Modal/PreviewPdf/PreviewPdf";
import { ToastContainer, toast ,Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
const api = new Network();

class SearchCandidate extends Component {
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
      skills: [],
      skillsSelected: [],
      candidateInfor: {},
      jobSelected: {},
      isLoading: false,
      isOpenCandidateDetail: false,
      email: "",
      phone: "",
      skill: "",
      name : "",
      text: "",
      base64:"",
      isOpenPreviewPdf : false,
      classToggleDetail: new Array(10).fill("hide_mb"),
      classArr: new Array(10).fill("fa fa-caret-right"),
    };
    this.refList = React.createRef();
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataCandidate = this.getDataCandidate.bind(this);
    this.toggleCandidateDetail = this.toggleCandidateDetail.bind(this);
    this.getCandidateDetail = this.getCandidateDetail.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.searchForm = this.searchForm.bind(this);
    this.initJobAndSkill = this.initJobAndSkill.bind(this);
    this.handleChangeJob = this.handleChangeJob.bind(this);
  }

  defaultState = () => {
    this.setState({
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      candidateInfor: {},
      isLoading: false,
      isOpenCandidateDetail: false,
      email: "",
      phone: "",
      skill: "",
      text: "",
      name : "",
      classToggleDetail: new Array(10).fill("hide_mb"),
      classArr: new Array(10).fill("fa fa-caret-right"),
      jobId: "",
    });
  };

  removeSkill = (skillRemove) => {
    const { skillsSelected, skills } = this.state;
    _.find(skills, (skill) =>
      skill.value === skillRemove.value
        ? _.assign(skill, { selected: false })
        : false
    );
    const skillSelectedNew = _.filter(
      skillsSelected,
      (skill) => skill.value !== skillRemove.value
    );

    this.setState(
      {
        skillsSelected: skillSelectedNew,
        skills,
      },
      function () {
        this.convertSkill();
      }
    );
  };

  convertSkill = () => {
    const nameSkill = _.map(this.state.skillsSelected, (skill) => skill.label);
    this.setState({
      skill: nameSkill.toString(),
    });
  };
  handleChangeSkill = (e) => {
    const { skills, skillsSelected } = this.state;
    skillsSelected.push(e);
    _.find(skills, (skill) =>
      skill.value === e.value ? _.assign(skill, { selected: true }) : false
    );
    this.setState({
      skills: skills,
      skillsSelected,
    });
    this.convertSkill();
  };

  handleChangeJob = (e) => {
    const {label, value} = e;
    console.log(label, value);
    this.setState({
      jobId: value,
    });
  };

  async searchForm() {
    // this.defaultState();
    this.getDataCandidate();
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

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
  toggleCandidateDetail(isShow) {
    this.setState({
      isOpenCandidateDetail: isShow,
    });
  }
  async getCandidateDetail(id) {
    try {
      let self = this;
      const response = await api.get(`/api/admin/candidate/detail/${id}`);
      if (response) {
        this.previewPdf(response.data.data.jobs[0].candidateJobId)
        this.setState(
          {
            candidateInfor: response.data.data,
          },
          () => {
            self.toggleCandidateDetail(true);
          }
        );
        // console.log(response.data.data);
      }
    } catch (error) {
      console.log("err while get candidate detail: ", error);
    }
  }
  async getDataCandidate() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      const response = await api.get(
        `/api/admin/search/candidate?pageSize=${
          this.state.pageSize
        }&pageNumber=${this.state.pageNumber}${
          this.state.email ? `&email=${this.state.email}` : ""
        }${this.state.phone ? `&phone=${this.state.phone}` : ""}${
          this.state.skill ? `&skills=${this.state.skill}` : ""
        }${this.state.text ? `&text=${this.state.text}` : ""}
        ${this.state.name ? `&name=${this.state.name}` : ""}
        ${this.state.jobId ? `&jobId=${this.state.jobId}`: ""}`
      );

      if (response) {
        console.log(response.data.list);
        self.setState({
          data: response.data.list,
          totalRow: response.data.total,
          start: start,
          realSize: response.data.list.length,
          classToggleDetail: new Array(10).fill("hide_mb"),
          classArr: new Array(10).fill("fa fa-caret-right"),
        });

        setTimeout(() => {
          // this.refList.current.scrollIntoView();
          self.setState({
            isLoading: false,
          });
        }, 800);
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
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
      loading: true,
    });
    this.getDataCandidate();
  }

  async initJobAndSkill() {
    const [jobs, skill] = await Promise.all([
      api.get(`/api/admin/search/jobs`),
      api.get(`/api/all/skill`),
    ]);

    if (jobs && skill) {
      const skillSelect = _.map(skill.data.skills, (skill) => {
        return {
          value: skill.id,
          label: skill.name,
          selected: false,
        };
      });
      this.setState({
        skills: skillSelect,
      });
      // console.log('is skill',skill.list.skills)
      // const skillSelect = _.map(skill.list.skills)

      const arrayJob = _.map(jobs.data.listJob, (job) => {
        return {
          value: job.id,
          label: job.title,
        };
      });
      this.setState({
        jobs: arrayJob,
      });
 
    }
  }

  togglePreviewPdf() {
    this.setState(
      {
        isOpenCandidateDetail : false, 
        isOpenPreviewPdf: !this.state.isOpenPreviewPdf,
      }
    );
  }

  async previewPdf(candidateJobId) {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.get(
        `/api/v1/admin/preview/pdf/candidateJob/${candidateJobId}`
      );
      if (response) {
        this.setState({
          base64: response.data.base64,
          isLoading: false,
        });
      }
    } catch (error) {
      // toast(<CustomToast title={"You do not have permission to access files ! "} type="error" />, {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      //   autoClose: 3000,
      //   className: "toast_login",
      //   closeButton: false,
      //   hideProgressBar: true,
      //   newestOnTop: true,
      //   closeOnClick: true,
      //   rtl: false,
      //   pauseOnFocusLoss: true,
      //   draggable: true,
      //   pauseOnHover: true,
      //   transition: Zoom,
      // });
      this.setState({
        isLoading: false,
        isOpenPreviewPdf :false
      });
    }
  }

  componentDidMount() {
    this.initJobAndSkill();
    this.getDataCandidate();
  }

  render() {
    const { data, skills, skillsSelected, jobs } = this.state;
    const skillNotSelected = _.filter(skills, (skill) => !skill.selected);
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
         <ToastContainer />
        <CandidateDetail
          data={this.state.candidateInfor}
          show={this.state.isOpenCandidateDetail}
          onHide={this.toggleCandidateDetail.bind(this, false)}
          togglePreviewPdf={this.togglePreviewPdf.bind(this)}
          // previewPdf={this.previewPdf.bind(this)}
        />
        <PreviewPdf
          show={this.state.isOpenPreviewPdf}
          base64={this.state.base64}
          onHide={this.togglePreviewPdf.bind(this)}
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
                      <Link to="/" className="text-dark">
                        Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <div className="text-dark">List candidate</div>
                    </li>

                    
                  </ul>
                 
                </div>
               
              </div>
             
              <div className="d-flex align-items-center flex-wrap"></div>
              
            </div>
          </div>
          <div className="form-search">
            <div className="d-flex flex-column-fluid">
              <div className="container">
               
                <div className="card card-custom">
                  <div className="card-header flex-wrap border-0 pt-6 pb-0">
                    <div className="card-title">
                      <h3 className="card-label">
                        Search
                      </h3>
                    </div>
                  </div>
                  <div className="card-body card-body-search">
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Email address</label>
                          <input
                            name="email"
                            onChange={this.handleChange}
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            name="phone"
                            onChange={this.handleChange}
                            type="text"
                            className="form-control"
                            placeholder="Enter phone"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            onChange={this.handleChange}
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Enter name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Text</label>
                          <input
                            onChange={this.handleChange}
                            name="text"
                            type="text"
                            className="form-control"
                            placeholder="Enter text"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Job</label>
                         
                          <Select
                            name="option"
                            options={jobs}
                            onChange={this.handleChangeJob}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Skill</label>
                          <div className="kynang kynang-search">
                            {_.map(skillsSelected, (skill, index) => {
                              return (
                                <span className="tag-item" index={index}>
                                  <span className="tag badge-ivtx">
                                    <span>{skill.label}</span>
                                    <span
                                      className="rm-tag"
                                      onClick={this.removeSkill.bind(
                                        this,
                                        skill
                                      )}
                                    >
                                      <i className="la la-remove icon-nm" />
                                    </span>
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                          <Select
                            name="option"
                            options={skillNotSelected}
                            onChange={this.handleChangeSkill}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="search-candidate">
                      <button
                        onClick={this.searchForm}
                        type="submit"
                        className="btn btn-primary mr-2"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column-fluid" ref={this.refList}>
          <div className="container">
            <div className="card card-custom">
              <div className="card-header flex-wrap border-0 pt-6 pb-0">
                <div className="card-title">
                  <h3 className="card-label">
                    List candidate
                   
                  </h3>
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
                          <span style={{ width: "150px" }}>Name</span>
                        </th>

                        <th
                          data-field="ShipDate"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "130px" }}>Time apply</span>
                        </th>
                        <th
                          data-field="CompanyName"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "200px" }}>Job apply</span>
                        </th>
                        <th
                          data-field="Status"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "100px" }}>Phone</span>
                        </th>

                        <th
                          data-field="Actions"
                          data-autohide-disabled="false"
                          className="datatable-cell datatable-cell-sort"
                        >
                          <span style={{ width: "70px" }}>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="datatable-body">
                      { data.map((can, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr
                              data-row={1}
                              className="datatable-row datatable-row-even"
                              style={{ left: "0px" }}
                            >
                              <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                <span
                                  className="datatable-toggle-detail"
                                  onClick={this.showDetail.bind(this, index)}
                                >
                                  <i className={this.state.classArr[index]}></i>
                                </span>
                              </td>
                              <td
                                data-field="OrderID"
                                aria-label="63868-257"
                                className="datatable-cell"
                              >
                                <span
                                  onClick={this.getCandidateDetail.bind(
                                    this,
                                    can.id
                                  )}
                                  className="text-hover-primary"
                                  style={{
                                    width: "150px",
                                    cursor: "pointer",
                                  }}
                                >
                                  {can.name}
                                </span>
                              </td>

                              <td
                                data-field="ShipDate"
                                aria-label="9/3/2017"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "130px" }}>
                                  {can.date}
                                </span>
                              </td>
                              <td
                                data-field="CompanyName"
                                aria-label="Stanton, Friesen and Grant"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "200px" }}>
                                  {can.titleJob}
                                </span>
                              </td>

                              <td
                                data-field="Type"
                                data-autohide-disabled="false"
                                aria-label={2}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "100px" }}>
                                  <span className="label font-weight-bold label-lg  label-light-success label-inline">
                                    {can.phone}
                                  </span>
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
                                    width: "70px",
                                  }}
                                >
                                  <div
                                    //   href="#"
                                    className="btn btn-sm btn-clean btn-icon mr-2"
                                    data-toggle="dropdown"
                                    onClick={this.getCandidateDetail.bind(
                                      this,
                                      can.id
                                    )}
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
                                            d="M10.9,2 C11.4522847,2 11.9,2.44771525 11.9,3 C11.9,3.55228475 11.4522847,4 10.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,16 C20,15.4477153 20.4477153,15 21,15 C21.5522847,15 22,15.4477153 22,16 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L10.9,2 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            opacity="0.3"
                                          />
                                          <path
                                            d="M24.0690576,13.8973499 C24.0690576,13.1346331 24.2324969,10.1246259 21.8580869,7.73659596 C20.2600137,6.12944276 17.8683518,5.85068794 15.0081639,5.72356847 L15.0081639,1.83791555 C15.0081639,1.42370199 14.6723775,1.08791555 14.2581639,1.08791555 C14.0718537,1.08791555 13.892213,1.15726043 13.7542266,1.28244533 L7.24606818,7.18681951 C6.93929045,7.46513642 6.9162184,7.93944934 7.1945353,8.24622707 C7.20914339,8.26232899 7.22444472,8.27778811 7.24039592,8.29256062 L13.7485543,14.3198102 C14.0524605,14.6012598 14.5269852,14.5830551 14.8084348,14.2791489 C14.9368329,14.140506 15.0081639,13.9585047 15.0081639,13.7695393 L15.0081639,9.90761477 C16.8241562,9.95755456 18.1177196,10.0730665 19.2929978,10.4469645 C20.9778605,10.9829796 22.2816185,12.4994368 23.2042718,14.996336 L23.2043032,14.9963244 C23.313119,15.2908036 23.5938372,15.4863432 23.9077781,15.4863432 L24.0735976,15.4863432 C24.0735976,15.0278051 24.0690576,14.3014082 24.0690576,13.8973499 Z"
                                            fill="#000000"
                                            fillRule="nonzero"
                                            transform="translate(15.536799, 8.287129) scale(-1, 1) translate(-15.536799, -8.287129) "
                                          />
                                        </g>
                                      </svg>
                                    </span>
                                  </div>
                                </span>
                              </td>
                            </tr>
                            <tr
                              className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                            >
                              <td className="datatable-detail" colSpan="9">
                                <table>
                                  <tbody>
                                    <tr className="datatable-row">
                                      <td className="datatable-cell">
                                        <span>Job apply</span>
                                      </td>
                                      <td
                                        data-field="OrderID"
                                        aria-label="63868-257"
                                        className="datatable-cell"
                                        style={{}}
                                      >
                                        <span style={{ width: 110 }}>
                                          {can.titleJob}
                                        </span>
                                      </td>
                                    </tr>
                                    <tr className="datatable-row">
                                      <td className="datatable-cell">
                                        <span>Time apply</span>
                                      </td>
                                      <td
                                        data-field="Country"
                                        aria-label="Philippines"
                                        className="datatable-cell"
                                        style={{}}
                                      >
                                        <span style={{ width: 110 }}>
                                          {can.date}
                                        </span>
                                      </td>
                                    </tr>

                                    <tr className="datatable-row">
                                      <td className="datatable-cell">
                                        <span>Phone</span>
                                      </td>
                                      <td
                                        className="datatable-cell-sorted datatable-cell"
                                        data-field="Status"
                                        aria-label={1}
                                        style={{}}
                                      >
                                        <span style={{ width: 110 }}>
                                          <span className="label font-weight-bold label-lg  label-light-success label-inline">
                                            {can.phone}
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
                        Showing {this.state.start} - {" "}
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
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
  };
};

export default connect(mapStateToProps)(SearchCandidate);
