import React, { Component } from "react";
import { Form } from "react-bootstrap";
import ModelResultLinkedIn from "./ModelResult";

const arrayFilterOr = ['OR', 'or', 'Or'];
const arrayFilterAnd = ['AND', 'and', 'And'];
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
      similarJob: false,
      isOpenModel: false,
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
    // let url = `http://www.google.com/search?q= -intitle:"profiles" -inurl:"dir/+"+site:vn.linkedin.com/in/+OR+site:vn.linkedin.com/pub/`;
    let url = `http://www.google.com/search?q=`;
    let data = this.state;
    if(data.similarJob){
      url = `http://www.google.com/search?q=~`
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
      url += `+"${jobTitleSlug}"`;
    }
    if(data.keyword){
      let handleKeyword = data.keyword.split(' ');
      let keywordTemp = '';
      handleKeyword.forEach((item) => {
        if(arrayFilterOr.includes(item)){
          keywordTemp+=`" OR "`;
        } else if(arrayFilterAnd.includes(item)){
          keywordTemp+=`" AND "`;
        } else {
          keywordTemp+=` ${item}`;
        }
      })
      let keywordSlug = keywordTemp.trim();
      url += `+"${keywordSlug}"`;
    }
    if(data.keywordExclude){
      let handleKeywordExclude = data.keywordExclude.split(' ');
      let keywordExcludeTemp = '';
      handleKeywordExclude.forEach((item) => {
        if(arrayFilterOr.includes(item)){
          keywordExcludeTemp+=`" OR "`;
        } else {
          keywordExcludeTemp+=` ${item}`;
        }
      })
      let keywordExcludeSlug = keywordExcludeTemp.trim();
      url += `-"${keywordExcludeSlug}"`;
    }
    url += ` -intitle:"profiles" -inurl:"dir/+"+site:vn.linkedin.com/in/+OR+site:vn.linkedin.com/pub/`;

    switch(data.education){
      case 'Degree': {
        url+= `&as_oq=bachelor+degree+licence`;
        break;
      }
      case 'Masters Degree': {
        url+= `&as_oq=masters+mba+master+diplome+msc+magister+magisteres+maitrise`;
        break;
      }
      case 'Doctoral Degree': {
        url+= `&as_oq=dr+Ph.D.+PhD+D.Phil+DPhil+doctor+Doctorado+Doktor+Doctorat+Doutorado+DrSc+Tohtori+Doctorate+Doctora+Duktorah+Dottorato+Daktaras+Doutoramento+Doktorgrad`;
        break;
      }
      default: {
        break;
      }
    }
    if(data.currentEmployer){
      let currentTemp = data.currentEmployer.split(' ');
      let current = currentTemp.join('+');
      url+=`+"Current+%2A+${current}+%2A+"`;
    }
    this.setState({
      url,
      isOpenModel: true,
    })
  }

  render() {
    return (
      <div className="container kt-form-dkc">
        <ModelResultLinkedIn 
          url={this.state.url}
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
                value={this.state.jobTitle}
                placeholder="E.g. Nodejs developer OR Reactjs developer"
                onChange={this.handleChange}
                className="form-control-solid"
              />
              <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" name="similarJob" value={this.state.similarJob} onChange={this.handleChange} />
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
                value={this.state.keyword}
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
                value={this.state.keywordExclude}
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
                value={this.state.currentEmployer}
                placeholder="E.g. Paypal"
                onChange={this.handleChange}
                className="form-control-solid"
              />
            </div>
          </div>
        </div>
        <div className="cs-btn-find">
          <div className="btn-group">
            <div onClick={this.handleSubmit} className="btn btn-primary font-weight-bolder style-btn-kitin">Find the right people on LinkedIn</div>
          </div>
        </div>
      </div>
    );
  }
}
