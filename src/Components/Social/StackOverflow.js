import React, { Component } from 'react'
import {Form} from "react-bootstrap";
import ModelResultStackOverflow from "./ModelResult";
const arrayFilterOr = ["OR", "or", "Or"];
export default class StackOverflow extends Component {
    constructor(props) {
        super(props);
        this.state = {
          skill: "",
          city: "",
          url: "",
          hasAnwser: true,
          isOpenModel: false,
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
      };

      toggleResultModel = (isShow) => {
        this.setState({
          isOpenModel: isShow,
        });
      };

      handleSubmit = (e) => {
        e.preventDefault();
        let url = `http://www.google.com/search?q=site:stackoverflow.com/users -"Keeping a low profile."`;
        let data = this.state;

        if (data.skill) {
          let arraySkill = data.skill.split(",");
          let skillTemp = arraySkill.join(`" AND "`);
          url += `+"${skillTemp}"`;
        }
        if (data.city) {
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
          url += `+"${citySlug}"`;
        }
        if(data.hasAnwser){
          url+=`-"0 * reputation"`;
        } 
        this.setState({
          url,
          isOpenModel: true,
        });
      };

      render() {
        return (
          <div className="container kt-form-dkc">
            <ModelResultStackOverflow 
              url={this.state.url}
              show={this.state.isOpenModel}
              onHide={this.toggleResultModel.bind(this, false)}
            />
            <div className="form-group row custom-pd-social">
              <div className="col-lg-6">
                <label>Skills to include</label>
                <div>
                  <Form.Control
                    name="skill"
                    type="text"
                    value={this.state.skill}
                    onChange={this.handleChange}
                    placeholder="E.g. PHP, Linux, Ruby"
                    className="form-control-solid"
                  />
                  <div className="checkbox-inline mt-4">
                <label className="checkbox">
                  <input type="checkbox" name="hasAnwser" checked={this.state.hasAnwser} onChange={this.handleChange} />
                  <span></span>Exclude profiles with no answers?
                </label>
              </div>
                </div>
              </div>
              <div className="col-lg-6">
                <label>City or Country</label>
                <div>
                  <Form.Control
                    name="city"
                    type="text"
                    value={this.state.city}
                    placeholder="E.g. Viet Nam OR Ho Chi Minh"
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
                  className="btn btn-primary font-weight-bolder style-btn-kitin"
                >
                  Find the right people on Stack Overflow
                </div>
              </div>
            </div>
          </div>
        );
      }
}
