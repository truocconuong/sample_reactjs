import React, { Component } from "react";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./../style.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Create from "../../Modal/Interview/Create";
import _ from 'lodash'
import Fbloader from "../../libs/PageLoader/fbloader";
import Network from "../../../Service/Network";
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast";
import { convertDateLocal } from "../../../utils/common/convertDate";
import RecruiterDetail from "./RecruiterDetail";
import BtnActionRemove from "./BtnActionRemove";
import {Form} from 'react-bootstrap'
const api = new Network();

class Recruiter extends Component {
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
      popupDetailCandidate : false,
      arrayBooleanPopover: [],
      classToggleDetail: new Array(10).fill("hide_mb"),
      classArr: new Array(10).fill("fa fa-caret-right"),
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataInterview = this.getDataInterview.bind(this);
    this.toggleFormCreateInterview = this.toggleFormCreateInterview.bind(this);
    this.getDataJob = this.getDataJob.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getDataCandidateById = this.getDataCandidateById.bind(this);
    this.deleteInterview = this.deleteInterview.bind(this);
    this.createInterview = this.createInterview.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.offPopoverDelete = this.offPopoverDelete.bind(this)
  }
  togglePopupDetailCandidate = () =>{
      this.setState({
          popupDetailCandidate : !this.state.popupDetailCandidate
      },()=>{
        if(!this.state.popupDetailCandidate){
          this.setState({
            candidates : []
        })
        }
      })
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
    })
  }

  handleOnChangeJob(e) {
    this.setState({
      jobSelected: e,
    })
  }


  async getDataCandidateById(id) {
    const response = await api.get(`/api/candidate/interview/${id}`);
    if (response) {
      const candidates = _.map(response.data.candidate, candidate => {
        return {
          ...candidate,
          value: candidate.id,
          label: `${candidate.email} (${candidate.phone}) `
        }
      });
      this.setState({
        candidates: candidates
      })
    }
  }

  toggleFormCreateInterview() {
    this.setState({
      formCreateInterview: !this.state.formCreateInterview
    })
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
    return Promise.all([this.getDataInterview()])
  }



  async getDataJob() {
    try {
      const response = await api.get(`/api/jobs`);
      if (response) {
        this.setState({
          jobs: _.map(response.data.list, job => {
            return {
              value: job.id,
              label: job.title
            }
          })
        })
      }
    } catch (error) {

    }
  }

  async getDataInterview() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      const response = await api.get(
        `/api/v1/recruiter?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );

      if (response) {
          console.log(response)
        setTimeout(() => {
          self.setState({
            // isLoading: false,
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
        toast(<CustomToast title={"Create interview successed !"}/>, {
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
      toast(<CustomToast title={"Interview time is overlapped !"} type={"error"}/>, {
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
      });
    }
  }

  arrayBoolean = () => {
    return new Array(this.state.arrayBooleanPopover.length).fill(false);
  }


  togglePopover(index, boolean) {
    const arrayBooleanPopover = this.arrayBoolean();
    arrayBooleanPopover[index] = !boolean;
    this.setState({
      arrayBooleanPopover: arrayBooleanPopover
    })

  }

  showDetailCandidateRecruiter = async(recruiterId)=> {
      const res = await api.get(`/api/v1/candidate/recruiter/${recruiterId}`,)
      if(res){
       const data = res.data.recruiterCandidates;
       this.setState({
           candidates : data
       },()=>{
         if(!_.isEmpty(this.state.candidates)){
          this.togglePopupDetailCandidate();
         }else {
          toast(<CustomToast title={"Recruiter not exists candidate !"} type={"error"} />, {
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
          });
         }
       })
      }
  }

   destroyRecruiter = async(id)=>{
   try {
    const res = await api.delete(`/api/user/${id}`);
    if(res){
      this.fetchData();
    }
   } catch (error) {
     
   }
  }
  editStatusRecruiter =async (e,id) =>{
    const statusEdit = e.target.value
    const response = await api.patch(`/api/v1/user/${id}`,{isDelete : statusEdit})
    if(response){
      toast(<CustomToast title={"Update status recruiter successed !"}/>, {
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
      this.fetchData();
    }
  }
  render() {
    const data = this.state.data;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
          <ToastContainer closeOnClick autoClose={1000} rtl={false} />
          <RecruiterDetail
          show = {this.state.popupDetailCandidate}
          onHide = {this.togglePopupDetailCandidate}
          data = {this.state.candidates}
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
                        List Recruiter
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
                    <h3 className="card-label">
                      List Recruiter
                     
                    </h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2">
                    </div>
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
                            <span style={{ width: "137px" }}>Email</span>
                          </th>

                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "137px" }}>Status</span>
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
                        {data.map((recruiter, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr
                                key={index}
                                data-row={1}
                                className="datatable-row datatable-row-even"
                                style={{ left: "0px" }}
                              >
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                >
                                 <span style={{ width: "137px" }}>
                                     {
                                         recruiter.name
                                     }
                                  </span>
                                </td>

                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell hide_mb"
                                >
                                 <span style={{ width: "137px" }}>
                                     {
                                         recruiter.email
                                     }
                                  </span>
                                </td>

                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell hide_mb"
                                >
                                 <span style={{ width: "137px" }}>
                                 <Form.Control
                                    value = {recruiter.isDelete ? 1 : 0}
                                    onChange={(e)=>{
                                      this.editStatusRecruiter(e,recruiter.id)
                                    }}
                                    name="status"
                                    as="select" custom>
                                    <option name="active"  value={0}>Active</option>
                                    <option name="anactive" value={1}>An Active</option>
                                  </Form.Control>
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
                                    <a
                                      onClick={() =>{
                                          this.showDetailCandidateRecruiter(recruiter.id)
                                      }}
                                      className="btn btn-sm btn-clean btn-icon"
                                      title="Delete"
                                      style={this.props.role == "Member" ? { display: "none" } : null}
                                    >
                                      <span className="svg-icon svg-icon-md">
                                        <i className="fas fa-eye"></i>
                                      </span>
                                    </a>
                                  </span>
                                </td>
                              </tr>

                              <tr
                                className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                              >
                                <td className="datatable-detail cus-datatable" colSpan="9">
                                  <table>
                                    <tbody>
                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span style={{width:'137px'}}>Email</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                         
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
      </div >
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

export default connect(mapStateToProps)(Recruiter);
