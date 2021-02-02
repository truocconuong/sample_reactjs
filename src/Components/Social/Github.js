import React, { Component } from 'react'
import { Form } from "react-bootstrap";

export default class Github extends Component {
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
                <label>Skills to include</label>
                <div>
                  <Form.Control
                    name="skill"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="E.g. PHP, Linux, Ruby"
                    className="form-control-solid"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <label>City or Country</label>
                <div>
                  <Form.Control
                    name="jobTitle"
                    type="text"
                    placeholder="E.g. Viet Nam OR Ho Chi Minh"
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
