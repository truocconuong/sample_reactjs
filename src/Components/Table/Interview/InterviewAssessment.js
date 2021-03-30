import React, { Component } from "react";
import "./style.css";
import { Modal, Form, Button, Table } from "react-bootstrap";
import { convertDateLocal } from "../../../utils/common/convertDate";
import Network from "../../../Service/Network";
import { toast, ToastContainer } from "react-toastify";

const api = new Network();

class InterviewAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      professionalKnowledge: "",
      workExperience: "",
      languageAbility: "",
      personalAttitude: "",
      recommendNextRound: "",
      suggestmentApplied: "N/A",
    };
  }

  defaultState = () => {
    this.setState({
      professionalKnowledge: "",
      workExperience: "",
      languageAbility: "",
      personalAttitude: "",
      recommendNextRound: "",
      suggestmentApplied: "N/A",
    });
  };

  handleClose = () => {
    this.defaultState();
    this.props.hide();
  };

  handleSubmit = async () => {
    const dataSubmit = {
      review: this.state,
    };
    try {
      const response = await api.patch(
        `/api/v1/review/interview/${this.props.data.id}`,
        dataSubmit
      );
      toast.success("Update interview successful!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      this.props.submitInterviewCandidate();
    } catch (error) {
      console.log("ERROR review ==========>", error.message);
    }

    this.props.hide();
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      if (nextProps.data.review === "") {
        this.defaultState();
      } else {
        this.setState({
          ...nextProps.data.review,
        });
      }
    }
  }

  render() {
    const {
      professionalKnowledge,
      workExperience,
      languageAbility,
      personalAttitude,
      recommendNextRound,
      suggestmentApplied,
    } = this.state;

    // console.log("change", this.state);

    const { data, show, hide } = this.props;
    return (
      <Modal
        size="lg"
        centered
        show={show}
        onHide={() => (hide, this.handleClose())}
        // onHide={hide}
      >
        <Modal.Header closeButton>
          <Modal.Title>INTERVIEW ASSESSMENT FORM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table class="table table-bordered table-interview">
            <tbody>
              <tr>
                <td className="information-title">Name of candidate</td>
                <td className="information-title">Interviewer</td>
              </tr>
              <tr>
                <td>{data.CandidateJob && data.CandidateJob.Candidate.name}</td>
                <td>{data && data.viewer}</td>
              </tr>
              <tr>
                <td className="information-title">Interview Date</td>
                <td>{data && convertDateLocal(data.timeInterview)}</td>
              </tr>
              <tr>
                <td className="information-title">Position applied</td>
                <td className="information-title">Suggestion position</td>
              </tr>
              <tr>
                <td>
                  {/* {data.CandidateJob && data.CandidateJob.job.title} */}
                </td>
                <td>
                  <textarea
                    value={suggestmentApplied}
                    name="suggestmentApplied"
                    style={{ resize: "none" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <h4 style={{ textAlign: "center" }}>ABILITY FACTORS</h4>
                </td>
              </tr>
              <tr>
                <td>1. PROFESSIONAL KNOWLEDGE</td>
                <td>
                  <textarea
                    value={professionalKnowledge}
                    name="professionalKnowledge"
                    style={{ resize: "none", height: "110px" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
              <tr>
                <td>2. WORK EXPERIENCE</td>
                <td>
                  <textarea
                    value={workExperience}
                    name="workExperience"
                    style={{ resize: "none" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
              <tr>
                <td>3. LANGUAGE ABILITY</td>
                <td>
                  <textarea
                    value={languageAbility}
                    name="languageAbility"
                    style={{ resize: "none" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "grid" }}>
                    <span>4. PERSONAL ATTITUDE</span>
                    <span style={{ paddingLeft: "15px" }}>
                      - Motivation to work
                    </span>
                    <span style={{ paddingLeft: "15px" }}>- Team work...</span>
                  </div>
                </td>
                <td>
                  <textarea
                    value={personalAttitude}
                    name="personalAttitude"
                    style={{ resize: "none" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
              <tr>
                <td>5. RECOMMENDED FOR NEXT ROUND</td>
                <td>
                  <textarea
                    value={recommendNextRound}
                    name="recommendNextRound"
                    style={{ resize: "none" }}
                    className="input-interview"
                    placeholder="Enter here..."
                    onChange={this.handleChangeInput}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InterviewAssessment;
