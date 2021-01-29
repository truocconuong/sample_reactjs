import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./style.css";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import CandidateDetailTable from "../Modal/Candidate/DetailCandidateTable";
import moment from "moment";
import PreviewPdf from "../Modal/PreviewPdf/PreviewPdf";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast.js";

const api = new Network();

class Candidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      data: [],
      candidateInfor: {},
      isLoading: false,
      isOpenCandidateDetail: false,

      classToggleDetail: new Array(10).fill("show_mb"),
      classArr: new Array(10).fill("fa fa-caret-down"),
      isOpenPreviewPdf: false,
      isLoadingPdf : true,
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataCandidate = this.getDataCandidate.bind(this);
    this.toggleCandidateDetail = this.toggleCandidateDetail.bind(this);
    this.getCandidateDetail = this.getCandidateDetail.bind(this);
    this.showDetail = this.showDetail.bind(this);
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
        this.previewPdf(response.data.data.jobs[0].candidateJobId);

        this.setState(
          {
            candidateInfor: response.data.data,
          },
          () => {
            self.toggleCandidateDetail(true);
          }
        );
        console.log(this.state.candidateInfor);
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
        `/api/admin/search/candidate?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );

      if (response) {
        self.setState({
          data: response.data.list,
          totalRow: response.data.total,
          start: start,
          realSize: response.data.list.length,
          classToggleDetail: new Array(10).fill("show_mb"),
          classArr: new Array(10).fill("fa fa-caret-down"),
        });
        console.log(this.state.data)
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 100);
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
  togglePreviewPdf() {
    if (this.state.base64 !== "") {
      this.setState(
        {
          isOpenPreviewPdf: !this.state.isOpenPreviewPdf,
          isOpenCandidateDetail: false,
        },
        () => {
          if (!this.state.isOpenPreviewPdf) {
            this.setState({
              base64: "",
            });
          }
        }
      );
    } else {
      toast(
        <CustomToast
          title={"Cannot read file pdf please check again!"}
          type="error"
        />,
        {
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
        }
      );
    }
  }

  async previewPdf(candidateJobId) {
    try {
      this.setState({
        isLoadingPdf : true
      })
      const response = await api.get(
        `/api/v1/admin/preview/pdf/candidateJob/${candidateJobId}`
      );
      if (response) {
        this.setState({
          base64: response.data.base64,
          isLoadingPdf : false
        });
      }
    } catch (error) {
      this.setState({
        isLoadingPdf : false,
        base64: "",
        isOpenPreviewPdf: false,
      });
    }
  }

  componentDidMount() {
    this.getDataCandidate();
  }

  render() {
    const data = this.state.data;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <CandidateDetailTable
          data={this.state.candidateInfor}
          show={this.state.isOpenCandidateDetail}
          onHide={this.toggleCandidateDetail.bind(this, false)}
          togglePreviewPdf={this.togglePreviewPdf.bind(this)}
          // previewPdf={this.previewPdf.bind(this)}
          base64={this.state.base64}
          isLoadingPdf = {this.state.isLoadingPdf}
        />
        <PreviewPdf
          show={this.state.isOpenPreviewPdf}
          base64={this.state.base64}
          onHide={this.togglePreviewPdf.bind(this)}
        />
        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}
          <ToastContainer />
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
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">List candidate</h3>
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
                          data-field="Status"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "100px" }}>Phone</span>
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
                          <span style={{ width: "100px" }}>Source</span>
                        </th>
                        <th
                          data-field="Status"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "100px" }}>Column</span>
                        </th>
                        <th
                          data-field="CompanyName"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "200px" }}>Follower</span>
                        </th>
                        {/* <th
                          data-field="Actions"
                          data-autohide-disabled="false"
                          className="datatable-cell datatable-cell-sort"
                        >
                          <span style={{ width: "70px" }}>Actions</span>
                        </th> */}
                      </tr>
                    </thead>
                      <tbody className="datatable-body" style={{}}>
                      {data.map((can, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr
                              data-row={1}
                              className="datatable-row datatable-row-even"
                              style={{ left: "0px" }}
                            >
                              {/* <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                <span
                                  className="datatable-toggle-detail"
                                  onClick={this.showDetail.bind(this, index)}
                                >
                                  <i className={this.state.classArr[index]}></i>
                                </span>
                              </td> */}
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
                                data-field="ShipDate"
                                aria-label="9/3/2017"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "130px" }}>
                                    {
                                      can.date.map((date, i) => {
                                        return (<p key={i}>{date}</p>);
                                      }) 
                                    }
                                </span>
                              </td>
                              <td
                                data-field="CompanyName"
                                aria-label="Stanton, Friesen and Grant"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "200px" }}>
                                    {
                                      can.titleJob.map((title, i) => {
                                        return (<p key={i}>{title}</p>);
                                      }) 
                                    }
                                </span>
                              </td>
                              <td
                                data-field="Type"
                                data-autohide-disabled="false"
                                aria-label={2}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "100px" }}>
                                    {
                                      can.source.map((source, i) => {
                                        return (<p key={i}>{source}</p>);
                                      }) 
                                    }
                                </span>
                              </td>

                              <td
                                data-field="Type"
                                data-autohide-disabled="false"
                                aria-label={2}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "100px" }}>
                                    {
                                      can.lane.map((column, i) => {
                                        return (<button
                                            key={i}
                                            className="btn btn-style-kitin search-kitin-candidate hiden-kitin-column mb-2"
                                            style={{
                                              width: '100%',
                                              textAlign: 'center',
                                              background: column.background,
                                              border: "none",
                                            }}
                                            title={column.nameColumn}
                                          >
                                            {column.nameColumn}
                                          </button>);
                                      }) 
                                    }
                                  {/* <span className="label font-weight-bold label-lg  label-light-success label-inline">
                                    {can.phone}
                                  </span> */}
                                </span>
                              </td>
                              <td
                                data-field="Type"
                                data-autohide-disabled="false"
                                aria-label={2}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "200px" }}>
                                    {
                                      can.follower.map((follower, i) => {
                                        return (<p key={i}>{follower}</p>);
                                      }) 
                                    }
                                </span>
                              </td>
                              
                            </tr>
                            <tr
                              className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                            >
                              <td className="datatable-detail p-0" colSpan="9">
                                <table style={{width: '100%'}}>
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
                                        {
                                          can.titleJob.map((title, i) => {
                                            return (<p key={i}>{title}</p>);
                                          }) 
                                        }
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
                                        {
                                          can.date.map((date, i) => {
                                            return (<p key={i}>{date}</p>);
                                          }) 
                                        }
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
  };
};

export default connect(mapStateToProps)(Candidate);
