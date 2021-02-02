import React, { Component } from "react";
import { Form } from "react-bootstrap";
import ModelResultLinkedIn from "./ModelResult";

export default class LinkedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      jobTitle: '',
      keyword: '',
      keywordExclude: '',
      education: '',
      currentEmployer: '',
      isOpenModel: false,
    };
  }
  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  toggleResultModel = (isShow) => {
    this.setState({
      isOpenModel: isShow,
    });
  }

  render() {
    return (
      <div className="container kt-form-dkc">
        <ModelResultLinkedIn 
          show={this.state.isOpenModel}
          onHide={this.toggleResultModel.bind(this, false)}
        />
        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>Country</label>
            <div>
              <Form.Control
                name="country"
                type="text"
                value="Viet Nam"
                onChange={this.handleChange}
                disabled
                className="form-control-solid"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label>Job title</label>
            <div>
              <Form.Control
                name="jobTitle"
                type="text"
                placeholder="E.g. Nodejs developer OR Reactjs developer"
                onChange={this.handleChange}
                className="form-control-solid"
              />
              <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span></span>Show similar jobs?
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>
              Location or keywords to{" "}
              <span style={{ fontWeight: "bold" }}>include</span>
            </label>
            <div>
              <Form.Control
                name="keyword"
                type="text"
                onChange={this.handleChange}
                placeholder="E.g. Ha Noi OR Da Nang AND html"
                className="form-control-solid"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label>
              Keywords to <span style={{ fontWeight: "bold" }}>exclude</span>
            </label>
            <div>
              <Form.Control
                name="keywordExclude"
                type="text"
                placeholder="E.g. Assistant OR seceretary"
                onChange={this.handleChange}
                className="form-control-solid"
              />
            </div>
          </div>
        </div>

        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>Education</label>
            <div>
              <Form.Control
                as="select"
                name="education"
                className="form-control"
                onChange={this.handleChange}
                className="form-control-solid"
              >
                <option value="All Candidate">All Candidate</option>
                <option value="Degree">Degree</option>
                <option value="Masters Degree">Masters Degree</option>
                <option value="Doctoral Degree">Doctoral Degree</option>
              </Form.Control>
            </div>
          </div>
          <div className="col-lg-6">
            <label>Current Employer</label>
            <div>
              <Form.Control
                name="currentEmployer"
                type="text"
                placeholder="E.g. Paypal"
                onChange={this.handleChange}
                className="form-control-solid"
              />
            </div>
          </div>
        </div>
        <div className="cs-btn-find">
          <div className="btn-group">
            <div onClick={() => this.toggleResultModel(true)} className="btn btn-primary font-weight-bolder style-btn-kitin">Find the right people on LinkedIn</div>
          </div>
        </div>
      </div>
    );
  }
}
