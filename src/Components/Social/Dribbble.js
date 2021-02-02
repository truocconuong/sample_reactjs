import React, { Component } from "react";
import { Form } from "react-bootstrap";

export default class SearchDribbble extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  };
  render() {
    return (
      <div className="container kt-form-dkc">
        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>Skills (keywords) to <span style={{ fontWeight: "bold" }}>include</span></label>
            <div>
              <Form.Control
                name="skill"
                type="text"
                onChange={this.handleChange}
                placeholder="E.g. logo design, vector, brand"
                className="form-control-solid"
              />
              <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span></span>Exclude profiles with no contact info
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <label>Skills (keywords) to <span style={{ fontWeight: "bold" }}>exclude</span></label>
            <div>
              <Form.Control
                name="skillExclude"
                type="text"
                placeholder="E.g. animation"
                onChange={this.handleChange}
                className="form-control-solid"
              />
              
            </div>
          </div>
        </div>
        <div className="cs-btn-find">
          <div className="btn-group">
            <button
              type="submit"
              className="btn btn-primary font-weight-bolder style-btn-kitin"
            >
              Find the right people on Github
            </button>
          </div>
        </div>
      </div>
    );
  }
}
