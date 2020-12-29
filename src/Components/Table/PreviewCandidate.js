import React, { Component } from "react";

import "rc-pagination/assets/index.css";
import "./style.css";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Document, Page, pdfjs } from "react-pdf";
import EditPdf from "../Modal/PreviewPdf/EditPdf";
import Network from "../../Service/Network";
import { domainServer } from "../../utils/config";
import PreviewPdf from "../Modal/PreviewPdf/PreviewPdf";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import { convertDriveToBase64 } from "../../utils/common/convertDriveToBase64";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const api = new Network();

class PreviewCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      candidateJob: {},
      isOpen: false,
      data: {
        name: "",
        address: "",
        objective: "",
        summary: "",
        technology: "",
        experience: "",
        education: "",
        skills: "",
        language: "",
        courses: "",
        projects: "",
        contacts: "",
        positions: "",
      },
      base64: "",
      showEditPdf: false,
      setIsOpen: false,
      isOpenPreviewPdf: false,
      numPages: 1,
      pageNumber: 1,
    };
    this.getCandidateJob = this.getCandidateJob.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.toggleShowFormPdf = this.toggleShowFormPdf.bind(this);
    this.handleInputDataChange = this.handleInputDataChange.bind(this);
    this.makePdf = this.makePdf.bind(this);
  }

  togglePreviewPdf = () => {
    this.setState({
      isOpenPreviewPdf: !this.state.isOpenPreviewPdf,
    });
  };

  defaultState = () => {
    this.setState({
      isLoading: false,
      candidateJob: {},
      isOpen: false,
      data: {
        address: "",
        objective: "",
        summary: "",
        technology: "",
        experience: "",
        education: "",
        skills: "",
        language: "",
        courses: "",
        projects: "",
        contacts: "",
        positions: "",
      },
      showEditPdf: false,
      setIsOpen: false,
      numPages: 1,
      pageNumber: 1,
    });
  };

  async makePdf() {
    this.toggleShowFormPdf();
    this.setState({
      isLoading: true,
    });
    try {
      const data = {
        candidateId: this.props.candidateId,
        jobId: this.props.jobId,
        ...this.state.data,
      };
      const response = await api.post(`/api/v1/candidate/make/pdf`, data);
      if (response) {
        this.defaultState();
        this.getCandidateJob();
      }
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
  }

  onDocumentLoadSuccess({ numPages }) {
    console.log(numPages);
    this.setState({
      numPages: numPages,
    });
  }

  handleInputDataChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    const dataNow = this.state.data;
    dataNow[name] = value;
    this.setState({
      data: dataNow,
    });
  }
  toggleShowFormPdf() {
    this.setState({
      showEditPdf: !this.state.showEditPdf,
    });
  }

  async previewPdf(candidateJobId) {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.get(
        `/api/v1/admin/preview/pdf/refine/candidateJob/${candidateJobId}`
      );
      if (response) {
        this.setState({
          base64: response.data.base64,
          isLoading: false,
        });
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        isOpenPreviewPdf: false,
      });
    }
  }

  async getCandidateJob() {
    try {
      const response = await api.get(
        `/preview/candidate/${this.props.candidateId}/job/${this.props.jobId}`
      );
      if (response) {
        const data = response.data.candidateJob;
        const dataUpdateState = {
          candidateJob: data,
        };

        if (data.dataParserPdf) {
          const dataState = { ...this.state.data, ...data.dataParserPdf };
          dataUpdateState.data = dataState;
        }
        this.setState(dataUpdateState);
        if (data.isRefinePdf && data.parserPdf) {
          await this.previewPdf(data.id);
        }
      }
    } catch (error) {
      toast(<CustomToast title={"Does not have permission to read the file !"} type="error" />, {
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
      });
    }
  }

  componentDidMount() {
    this.getCandidateJob();
  }

  render() {
    const { candidateJob } = this.state;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <ToastContainer></ToastContainer>
            <EditPdf
              show={this.state.showEditPdf}
              onHide={this.toggleShowFormPdf}
              data={this.state.data}
              handleInputDataChange={this.handleInputDataChange}
              makePdf={this.makePdf}
            />
            <PreviewPdf
              show={this.state.isOpenPreviewPdf}
              base64={this.state.base64}
              onHide={this.togglePreviewPdf.bind(this)}
            />
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
                      <div className="text-dark">Preview candidate</div>
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
                    {/* <h3 className="card-label">
                      List client
                      
                    </h3> */}
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2"></div>
                    <span
                      onClick={() => this.props.history.push(`/job-detail/${this.props.jobId}`)}
                      className="btn btn-light-primary font-weight-bolder mr-2"
                    >
                      Back
                    </span>
                    <Link
                      to={`/refine/candidate/${this.props.candidateId}/job/${this.props.jobId}`}
                      className="btn btn-primary font-weight-bolder style-btn-kitin mr-3"
                    >
                      Edit Pdf
                      </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="preview">
                    {this.state.candidateJob.isRefinePdf &&
                      this.state.candidateJob.parserPdf ? (
                        <div
                          className="d-flex flex-column align-items-center cursor-open"
                          onClick={() => {
                            this.togglePreviewPdf();
                          }}
                        >
                          <img alt="" className="max-h-65px" src="/img/pdf.svg" />
                          <a className="text-dark-75 font-weight-bold mt-5 font-size-lg">{`refine-${this.state.candidateJob.Candidate.name}.pdf`}</a>
                        </div>
                      ) : (
                        <embed
                          className="preview-pdf"
                          src={`${domainServer}${this.state.candidateJob.parserPdf}`}
                          type="application/pdf"
                          width={500}
                          height={375}
                        />
                      )}
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
    candidateId: ownProps.match.params.candidateId,
    jobId: ownProps.match.params.jobId,
  };
};

export default connect(mapStateToProps)(PreviewCandidate);
