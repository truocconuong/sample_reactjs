import React, { Component } from "react";
import {Form} from "react-bootstrap";
export default class Twitter extends Component {
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
        <h3 style={{color: 'red', textAlign: 'center', padding: '10px 20px'}}>Sorry! we are developing.</h3>
        <h3 style={{color: 'red', textAlign: 'center'}}>Coming soon.</h3>
        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>City and Country</label>
            <div>
              <Form.Control
                name="city"
                type="text"
                onChange={this.handleChange}
                placeholder="E.g. Ha Noi OR Viet Nam"
                className="form-control-solid"
              />
              
            </div>
          </div>
          <div className="col-lg-6">
            <label>
              Skills (keywords) to include
            </label>
            <div>
              <Form.Control
                name="jobTitle"
                type="text"
                placeholder="E.g. PHP, Ruby, Linux"
                onChange={this.handleChange}
                className="form-control-solid"
              />
            </div>
          </div>
        </div>
        <div className="form-group row pt-5">
          <div className="col-lg-6">
            <label>
              Skills (keywords) to exclude
            </label>
            <div>
              <Form.Control
                name="jobTitle"
                type="text"
                onChange={this.handleChange}
                placeholder="E.g. IIIustrator"
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
              Find the right people on Twitter
            </button>
          </div>
        </div>
      </div>
    );
  }
}
