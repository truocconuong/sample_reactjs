import React, { Component } from "react";
import { Form } from "react-bootstrap";
import ModelResultDribbble from "./ModelResult";

export default class SearchDribbble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skill: '',
      skillExclude: '',
      isExclude: false,
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
    let url = `http://www.google.com/search?q=site:dribbble.com -inurl:(followers|type|members|following|jobs|designers|players|buckets|places|skills|projects|tags|search|stories|users|draftees|likes|lists) -intitle:(following|likes) -"Hire Us"`;
    let data = this.state;
    if(data.skill){
      let arraySkill = data.skill.split(',');
      let skillTemp = arraySkill.join(`" AND "`);
      url += `+"${skillTemp}"`;
    }
    if(data.isExclude){
      console.log('da vao day');
      url += `+("Hire Me" OR "Elsewhere")`;
    }
    if(data.skillExclude){
      let arraySkillExclude = data.skill.split(',');
      let skillExcludeTemp = arraySkillExclude.join(`" AND "`);
      url += `-"${skillExcludeTemp}"`;
    }
    this.setState({
      url,
      isOpenModel: true,
    })
  }

  render() {
    return (
      <div className="container kt-form-dkc">
         <ModelResultDribbble
          url={this.state.url}
          show={this.state.isOpenModel}
          onHide={this.toggleResultModel.bind(this, false)}
        />
        <div className="form-group row custom-pd-social">
          <div className="col-lg-6">
            <label>Skills (keywords) to <span style={{ fontWeight: "bold" }}>include</span></label>
            <div>
              <Form.Control
                name="skill"
                type="text"
                value={this.state.skill}
                onChange={this.handleChange}
                placeholder="E.g. logo design, vector, brand"
                className="form-control-solid"
              />
              <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" name="isExclude" value={this.state.isExclude} onChange={this.handleChange} />
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
                value={this.state.skillExclude}
                placeholder="E.g. animation"
                onChange={this.handleChange}
                className="form-control-solid"
              />
              
            </div>
          </div>
        </div>
        <div className="cs-btn-find">
          <div className="btn-group">
            <div
              onClick={this.handleSubmit}
              type="submit"
              className="btn btn-primary font-weight-bolder style-btn-kitin"
            >
              Find the right people on Dribbble
            </div>
          </div>
        </div>
      </div>
    );
  }
}
