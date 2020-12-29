import React, { Component } from "react";

import "rc-pagination/assets/index.css";
import "./style.css";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Network from "../../Service/Network";
import draftToHtml from "draftjs-to-html";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import FormEditorPdf from "./FormEditorPdf";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../common/CustomToast";
import { convertDriveToBase64 } from "../../utils/common/convertDriveToBase64";
const api = new Network();

class RefinedPdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      candidateJob: {},
      isOpen: false,
      styleHeader: "card-header",
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
      editorWrite: "",
      showEditPdf: false,
      setIsOpen: false,
      isOpenPreviewPdf: false,
      numPages: 1,
      pageNumber: 1,
      //   objectiveEditor: EditorState.createEmpty(),
    };
    this.makePdf = this.makePdf.bind(this);
    this.getCandidateJob = this.getCandidateJob.bind(this);
    this.handleInputDataChange = this.handleInputDataChange.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  setNameEditorWrite = (name) => {
    this.setState({
      editorWrite: name,
    });
  };

  handleScroll = () => {
    let lengthScroll = window.pageYOffset;
    if (lengthScroll > 220) {
      this.setState({
        styleHeader: "card-header style-header-job",
      });
    } else {
      this.setState({
        styleHeader: "card-header",
      });
    }
  };
  handleInputDataChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    const dataNow = this.state.data;
    dataNow[name] = value;
    this.setState({
      data: dataNow,
    });
  }

  async getCandidateJob() {

    this.setState({
      isLoading: true
    })
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

        if (data.isRefinePdf) {
          const base64 = await convertDriveToBase64(data.parserPdf);
          this.setState({
            base64Drive: base64
          })
        }

        this.setState(dataUpdateState, () => {
          const data = this.state.data;

          for (const key in data) {
            const blocksFromHTML = convertFromHTML(data[key]);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            this.setState({
              [`${this.generateNameEditor(key)}`]: EditorState.createWithContent(
                contentState
              ),
            });
          }
        });
      }
      this.setState({
        isLoading: false
      })
    } catch (error) {
      this.setState({
        isLoading: false
      })
    }
  }

  generateNameEditor(key) {
    return `${key}Editor`;
  }

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
        toast(<CustomToast title={"Refine cv successed !"} />, {
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
          pauseOnHover: true
        });
        this.props.history.push(`/preview/candidate/${this.props.candidateId}/job/${this.props.jobId}`)
        // this.defaultState();
        // this.getCandidateJob();
      }
      this.setState({
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
  }

  onEditorStateChange = (editorState) => {
    const editorWrite = this.state.editorWrite;
    const data = this.state.data;
    data[editorWrite] = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    this.setState({
      [`${this.generateNameEditor(editorWrite)}`]: editorState,
      data: data,
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.getCandidateJob();
  }

  render() {
    const { data } = this.state;
    const errors = {};
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <div className="content d-flex flex-column flex-column-fluid">
          <ToastContainer></ToastContainer>
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
                      <div className="text-dark">Refine Pdf</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div
                className="card card-custom card-sticky"
                id="kt_page_sticky_card"
              >
                <div className={this.state.styleHeader}>
                  <div className="card-title">
                    <h3 className="card-label">
                      Form Refine CV
                      <i className="mr-2" />
                    </h3>
                  </div>
                  <div className="card-toolbar">
                    <span
                      onClick={() => this.props.history.push(`/preview/candidate/${this.props.candidateId}/job/${this.props.jobId}`)}
                      className="btn btn-light-primary font-weight-bolder mr-3"
                    >
                      Back
                    </span>

                    {
                      this.state.base64Drive ? (
                        <a href={`data:application/pdf;base64,${this.state.base64Drive}`} download={`${this.state.base64Drive ? data.name : ''}.pdf`} className="btn btn-primary font-weight-bolder style-btn-kitin mr-3">Download As PDF</a>
                      ) : ''
                    }
                    <div className="btn-group">
                      <button
                        onClick={this.makePdf}
                        type="submit"
                        className="btn btn-primary font-weight-bolder style-btn-kitin"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body card-body-refine-pdf">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Name </label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => this.handleInputDataChange(e)}
                          name="name"
                          className={
                            errors.name
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Address </label>
                        <input
                          value={data.address}
                          type="text"
                          onChange={(e) => this.handleInputDataChange(e)}
                          name="address"
                          className={
                            errors.name
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                  </div>

                  <FormEditorPdf
                    title="objective"
                    nameEditor={this.state.objectiveEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="summary"
                    nameEditor={this.state.summaryEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="technology"
                    nameEditor={this.state.technologyEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="experience"
                    nameEditor={this.state.experienceEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="education"
                    nameEditor={this.state.educationEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="skills"
                    nameEditor={this.state.skillsEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="language"
                    nameEditor={this.state.languageEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="courses"
                    nameEditor={this.state.coursesEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="projects"
                    nameEditor={this.state.projectsEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="contacts"
                    nameEditor={this.state.contactsEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
                  <FormEditorPdf
                    title="positions"
                    nameEditor={this.state.positionsEditor}
                    onEditorStateChange={this.onEditorStateChange}
                    setNameEditorWrite={this.setNameEditorWrite}
                    editorWrite={this.state.editorWrite}
                  />
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

export default connect(mapStateToProps)(RefinedPdf);
