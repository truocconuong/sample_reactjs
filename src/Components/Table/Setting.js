import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./style.css";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import Validator from "../../utils/validator.js";
import { rulesUpdateConfig } from "../../utils/rule.js";

import toastr from "toastr";

const api = new Network();

toastr.options = {
  positionClass: "toast-top-right",
};

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        isLoading: false,
      },
      errors: {},
    };
    this.getInitSetting = this.getInitSetting.bind(this);
    this.handleOnchange = this.handleOnchange.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.validatorUpdateConfig = new Validator(rulesUpdateConfig);
  }
  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  async updateConfig(e) {
    e.preventDefault();
    try {
      const errors = this.validatorUpdateConfig.validate(this.state.settings);
      this.setState({
        errors: errors,
      });
      if (this.isEmpty(errors)) {
        this.setState({
          isLoading: true,
        });
        const result = this.state.settings;
        const response = await api.patch(`/api/update/systems`, result);
        if (response) {
          console.log(response);
          toastr.success("Updated!");
          this.setState({
            isLoading: false,
          });
        }
      } else {
        // co loi
        console.log(errors);
        return;
      }
    } catch (error) {
      console.log("cannot update config: ", error);
    }
  }
  async getInitSetting() {
    try {
      const response = await api.get(`/api/all/systems`);
      if (response) {
        this.setState({
          settings: response.data.result,
        });
        console.log(this.state.settings);
      }
    } catch (error) {
      console.log("err while fetch data setting: ", error);
    }
  }
  handleOnchange(e) {
    let name = e.target.name;
    let value = e.target.value;
    let self = this;
    console.log(name, value);
    let currentSettings = { ...self.state.settings, [name]: value };
    this.setState({
      settings: currentSettings,
    });
  }
  componentDidMount() {
    this.getInitSetting();
  }

  render() {
    let data = this.state.settings;
    const errors = this.state.errors;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <div className="content d-flex flex-column flex-column-fluid">
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
                      <div className="text-dark">Setting</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-body p-0">
                  <div
                    className="wizard wizard-2"
                    id="kt_wizard"
                    data-wizard-state="first"
                    data-wizard-clickable="false"
                  >
                    <div className="wizard-nav border-right py-8 px-8 py-lg-20 px-lg-10">
                      <div className="wizard-steps">
                        <div
                          className="wizard-step"
                          data-wizard-type="step"
                          data-wizard-state="current"
                        >
                          <div className="wizard-wrapper">
                            <div className="wizard-icon">
                              <span className="svg-icon svg-icon-2x">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  width="24px"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  version="1.1"
                                >
                                  <g
                                    stroke="none"
                                    strokeWidth={1}
                                    fill="none"
                                    fillRule="evenodd"
                                  >
                                    <rect x={0} y={0} width={24} height={24} />
                                    <path
                                      d="M19,11 L21,11 C21.5522847,11 22,11.4477153 22,12 C22,12.5522847 21.5522847,13 21,13 L19,13 C18.4477153,13 18,12.5522847 18,12 C18,11.4477153 18.4477153,11 19,11 Z M3,11 L5,11 C5.55228475,11 6,11.4477153 6,12 C6,12.5522847 5.55228475,13 5,13 L3,13 C2.44771525,13 2,12.5522847 2,12 C2,11.4477153 2.44771525,11 3,11 Z M12,2 C12.5522847,2 13,2.44771525 13,3 L13,5 C13,5.55228475 12.5522847,6 12,6 C11.4477153,6 11,5.55228475 11,5 L11,3 C11,2.44771525 11.4477153,2 12,2 Z M12,18 C12.5522847,18 13,18.4477153 13,19 L13,21 C13,21.5522847 12.5522847,22 12,22 C11.4477153,22 11,21.5522847 11,21 L11,19 C11,18.4477153 11.4477153,18 12,18 Z"
                                      fill="#000000"
                                      fillRule="nonzero"
                                      opacity="0.3"
                                    />
                                    <circle
                                      fill="#000000"
                                      opacity="0.3"
                                      cx={12}
                                      cy={12}
                                      r={2}
                                    />
                                    <path
                                      d="M12,17 C14.7614237,17 17,14.7614237 17,12 C17,9.23857625 14.7614237,7 12,7 C9.23857625,7 7,9.23857625 7,12 C7,14.7614237 9.23857625,17 12,17 Z M12,19 C8.13400675,19 5,15.8659932 5,12 C5,8.13400675 8.13400675,5 12,5 C15.8659932,5 19,8.13400675 19,12 C19,15.8659932 15.8659932,19 12,19 Z"
                                      fill="#000000"
                                      fillRule="nonzero"
                                    />
                                  </g>
                                </svg>
                              </span>
                            </div>
                            <div className="wizard-label">
                              <h3 className="wizard-title">Config Settings</h3>
                              <div className="wizard-desc">
                                Setup Your Config Admin
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form
                      onSubmit={this.updateConfig}
                      style={{ width: "100%" }}
                    >
                      <div className="wizard-body py-8 px-8 py-lg-20 px-lg-10">
                        <div className="text-dark font-size-lg font-weight-bold mb-3">
                          Bitly Config :
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> Secret Key:</label>
                            <input
                              name="APP_SECRET_KEY_BITLY"
                              value={
                                data.APP_SECRET_KEY_BITLY
                                  ? data.APP_SECRET_KEY_BITLY
                                  : ""
                              }
                              type="text"
                              onChange={this.handleOnchange.bind(this)}
                              className={
                                errors.APP_SECRET_KEY_BITLY
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                            />
                          </div>
                        </div>
                        <div className="text-dark font-size-lg font-weight-bold mb-3">
                          Driver Config :
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> Account:</label>
                            <input
                              name="DRIVER_ACCOUNT"
                              value={
                                data.DRIVER_ACCOUNT ? data.DRIVER_ACCOUNT : ""
                              }
                              type="text"
                              className={
                                errors.DRIVER_ACCOUNT
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label> Folder Cv:</label>
                            <input
                              name="DRIVER_FOLDER_CV"
                              value={
                                data.DRIVER_FOLDER_CV
                                  ? data.DRIVER_FOLDER_CV
                                  : ""
                              }
                              type="text"
                              className={
                                errors.DRIVER_FOLDER_CV
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> Token:</label>
                            <input
                              name="DRIVER_TOKEN"
                              value={data.DRIVER_TOKEN ? data.DRIVER_TOKEN : ""}
                              type="text"
                              onChange={this.handleOnchange.bind(this)}
                              className={
                                errors.DRIVER_TOKEN
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                            />
                          </div>
                        </div>
                        <div className="text-dark font-size-lg font-weight-bold mb-3">
                          Zoom Config :
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> Token:</label>
                            <input
                              name="ZOOM_TOKEN"
                              value={data.ZOOM_TOKEN ? data.ZOOM_TOKEN : ""}
                              type="text"
                              className={
                                errors.ZOOM_TOKEN
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label> ID:</label>
                            <input
                              name="ZOOM_ID"
                              value={data.ZOOM_ID ? data.ZOOM_ID : ""}
                              type="text"
                              className={
                                errors.ZOOM_ID
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                        </div>
                        {/* <div className="text-dark font-size-lg font-weight-bold mb-3">
                          Pusher Config :
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> App ID:</label>
                            <input
                              name="APPID"
                              value={data.APPID ? data.APPID : ""}
                              type="text"
                              className={
                                errors.APPID
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label> Key:</label>
                            <input
                              name="KEY"
                              value={data.KEY ? data.KEY : ""}
                              type="text"
                              className={
                                errors.KEY
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label> Secret Key:</label>
                            <input
                              name="SECRET"
                              value={data.SECRET ? data.SECRET : ""}
                              type="text"
                              className={
                                errors.SECRET
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label> Cluster:</label>
                            <input
                              name="CLUSTER"
                              value={data.CLUSTER ? data.CLUSTER : ""}
                              type="text"
                              className={
                                errors.CLUSTER
                                  ? "form-control form-control-solid is-invalid"
                                  : "form-control form-control-solid"
                              }
                              onChange={this.handleOnchange.bind(this)}
                            />
                          </div>
                        </div> */}
                        <div className="d-flex justify-content-between border-top mt-5 pt-10">
                          <div className="mr-2"></div>
                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary font-weight-bolder text-uppercase px-9 py-4"
                              data-wizard-type="action-next"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
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
  };
};

export default connect(mapStateToProps)(Setting);
