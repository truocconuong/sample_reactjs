import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { DropdownDivider } from "react-bootstrap/Dropdown";
import ModelResultXing from "./ModelResult";

const arrayFilterOr = ['OR', 'or', 'Or'];
export default class Xing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTitle: '',
      city: '',
      keywordExclude: '',
      isOpenModel: false,
      simalarJob: false,
      url: '',
    };
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value,
    });
  };

  toggleResultModel = (isShow) => {
    this.setState({
      isOpenModel: isShow,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let url = `http://www.google.com/search?q=site:xing.com/profile/ intitle:`;
    let data = this.state;
    if(data.simalarJob){
      url = `http://www.google.com/search?q=site:xing.com/profile/ intitle:~`;
    }
    if(data.jobTitle){
      let handlejobTitle = data.jobTitle.split(' ');
      let jobTitleTemp = '';
      handlejobTitle.forEach((item) => {
        if(arrayFilterOr.includes(item)){
          jobTitleTemp+=`" OR "`;
        } else {
          jobTitleTemp+=` ${item}`;
        }
      })
      let jobTitleSlug = jobTitleTemp.trim();
      url += `"${jobTitleSlug}"`;
    }
    if(data.city){
      let handleCity = data.city.split(" ");
      let cityTemp = "";
      handleCity.forEach((item) => {
        if (arrayFilterOr.includes(item)) {
          cityTemp += `" OR "`;
        } else {
          cityTemp += ` ${item}`;
        }
      });
      let citySlug = cityTemp.trim();
      if(data.jobTitle){
        url += `+"${citySlug}"`;
      } else {
        url += `"${citySlug}"`;
      }
      
    }

    if(data.keywordExclude){
      let arrayKeywrod = data.keywordExclude.split(",");
      let keywordTemp = arrayKeywrod.join(`" AND "`);
      url += `-"${keywordTemp}"`;
    }
    this.setState({
      url,
      isOpenModel: true,
    })
  }
  render() {
    return (
      <div className="container kt-form-dkc">
        <ModelResultXing
          url={this.state.url}
          show={this.state.isOpenModel}
          onHide={this.toggleResultModel.bind(this, false)}
        />
        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>Job title</label>
            <div>
              <Form.Control
                name="jobTitle"
                type="text"
                onChange={this.handleChange}
                placeholder="E.g. accountant OR cfo"
                className="form-control-solid"
              />
							 <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" name="simalarJob" value={this.state.simalarJob} onChange={this.handleChange} />
                  <span></span>Show similar jobs?
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <label>Location or keywords to <span style={{fontWeight: 'bold'}}>include</span></label>
            <div>
              <Form.Control
                name="city"
                type="text"
                placeholder="E.g. Viet Nam OR Ho Chi Minh"
                onChange={this.handleChange}
                className="form-control-solid"
              />
            </div>
          </div>
        </div>
				<div className="form-group row pt-5">
          <div className="col-lg-6">
            <label>Keywords to <span style={{fontWeight: 'bold'}}>exclude</span></label>
            <div>
              <Form.Control
                name="keywordExclude"
                type="text"
                value={this.state.keywordExclude}
                onChange={this.handleChange}
                placeholder="E.g. Junior"
                className="form-control-solid"
              />
            </div>
          </div>
        </div>
        
				
				<div className="cs-btn-find">
          <div className="btn-group">
            <div
              onClick={this.handleSubmit}
              className="btn btn-primary font-weight-bolder style-btn-kitin"
            >
              Find the right people on Xing
            </div>
          </div>
        </div>
      </div>
    );
  }
}
