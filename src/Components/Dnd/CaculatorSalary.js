import React, { Component } from "react";
import _ from "lodash";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./styles.css";
import { rulesCaculatorSalary } from "../../utils/rule";
import Validator from "../../utils/validator";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CustomToast from "../common/CustomToast";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const api = new Network();
class CaculatorSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isOpen: false,
      setIsOpen: false,
      isSocialInsurance: true,
      isSocialInsuranceOther: false,
      salary: 0,
      insuraneMoney: 0,
      type: 0,
      peopleDependent: 0,
      sgd: "",
      tigia: 17300,
      pvi: 250000,
      salaryShow: "",
      bhxhShow: "",
      errors: {},
      data: "",
      value: "",
      copied: false,
    };
    this.validator = new Validator(rulesCaculatorSalary);
  }
  toggleSocialInsurance = () => {
    this.setState({
      isSocialInsurance: !this.state.isSocialInsurance,
      isSocialInsuranceOther: false,
    });
  };
  toggleSocialInsuranceOther = () => {
    this.setState({
      isSocialInsurance: false,
      isSocialInsuranceOther: !this.state.isSocialInsuranceOther,
    });
  };

  convertVNDToSGD = (money) => {
    const { tigia } = this.state;
    const convert = money.replace(/\,/g, "") / tigia;
    return convert.toFixed(0);
  };

  onChangeInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    const checkingNow = value.replaceAll(".", "");
    if (+checkingNow || value === "") {
      if (name === "salary") {
        value = value.replaceAll(".", "");
      }
      if (name === "insuraneMoney") {
        value = value.replaceAll(".", "");
      }
      const data = {
        [name]: value,
      };
      this.setState(data, () => {
        if (name === "salary") {
          this.setState({
            salaryShow: this.convertVND(this.state.salary),
          });
        }
        if (name === "insuraneMoney") {
          this.setState({
            bhxhShow: this.convertVND(this.state.insuraneMoney),
          });
        }
      });
    }
  };

  onChangeInputSGD = (e) => {
    const data = this.state;
    const name = e.target.name;
    const value = e.target.value;
    if (data.tigia) {
      const convertSGDVnd = Number(Number(value * data.tigia.toFixed(0)));
      this.setState({
        [name]: value,
        salary: convertSGDVnd.toString(),
        salaryShow: this.convertVND(convertSGDVnd),
      });
    }
  };

  onChangeInputTiGia = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: Number(value),
    });
  };

  convertVND(number) {
    const numberFormat = Number(number);
    return numberFormat.toLocaleString("it-IT");
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  caculator = async (e, type) => {
    e.preventDefault();
    const data = this.state;
    console.log(data);
    const errors = this.validator.validate(data);
    if (data.isSocialInsurance) {
      delete errors["insuraneMoney"];
    }
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      const dataSending = {
        pvi: data.pvi === "" ? 0 : data.pvi,
        type: type,
        salary: Number(data.salary),
        insuraneMoney: data.isSocialInsurance
          ? Number(data.salary)
          : Number(data.insuraneMoney),
        peopleDependent: Number(data.peopleDependent),
      };
      await this.caculatorSalary(dataSending);
    }
  };

  caculatorSalary = async (data) => {
    const response = await api.post("/api/v1/caculator/salary", data);
    if (response) {
      this.setState({
        data: response.data.result,
      });
    }
  };

  generateTextClipboard = (table) => {
    const { data } = this.state;
    console.log(data);
    let text = "";
    if (table === "table-description") {
      text = `
      GROSS Salary  Vnd:${data.gross} (SGD: ${this.convertVNDToSGD(
        data.gross
      )})\n
      Social insurance (8 %) Vnd:${data.bhxh} (SGD: ${this.convertVNDToSGD(
        data.bhxh
      )})\n
      Health Insurance (1.5 %) Vnd:${data.bhyt} (SGD: ${this.convertVNDToSGD(
        data.bhyt
      )})\n
      UnEmployment Insurance (1 %) Vnd:${
        data.bhtn
      } (SGD: ${this.convertVNDToSGD(data.bhtn)})\n
      Taxable Income Vnd:${data.tnct} (SGD: ${this.convertVNDToSGD(
        data.tnct
      )})\n
      Personal income tax Vnd:${data.tncn} (SGD: ${this.convertVNDToSGD(
        data.tncn
      )})\n
      Net salary Vnd:${data.net} (SGD: ${this.convertVNDToSGD(data.net)})
      `;
    }
    if (table === "table-detail-tax") {
      text = `
      Up to 5 million VND(5%) ${data.percent5}\n
      Over 5 million VND to 10 million VND(10%) ${data.percent10}\n
      From over 10 million VND to 18 million VND(15%) ${data.percent15}\n
      From over 18 million VND to 32 million VND(20%) ${data.percent20}\n
      From over 32 million VND to 52 million VND(25%) ${data.percent25}\n
      From over 52 million VND to 80 million VND(30%)	${data.percent30}\n
      Over 80 million VND(35%)	${data.percent35}\n
      `;
    }
    if (table === "table-company") {
      text = `
      GROSS Salary Vnd:${data.gross} (SGD: ${this.convertVNDToSGD(
        data.gross
      )})\n
      Social insurance (17.5%) Vnd:${
        data.companyBhxh
      } (SGD: ${this.convertVNDToSGD(data.companyBhxh)})\n
      Health Insurance (3%) Vnd:${
        data.companyBhyt
      } (SGD: ${this.convertVNDToSGD(data.companyBhyt)})\n
      UnEmployment Insurance (1%) Vnd:${
        data.companyBhtn
      } (SGD: ${this.convertVNDToSGD(data.companyBhtn)})\n
      Pvi care Vnd:${data.pvi} (SGD: ${this.convertVNDToSGD(data.pvi)})\n
      Union tax Vnd:${data.unionTax} (SGD: ${this.convertVNDToSGD(
        data.unionTax
      )})\n
      Total expense Vnd:${data.total} (SGD: ${this.convertVNDToSGD(
        data.total
      )})\n
      `;
    }
    return text;
  };

  successCopy = () => {
    toast(<CustomToast title={"Copied to clipboard!"} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 3000,
      className: "toast_login",
      closeButton: false,
      hideProgressBar: true,
      newestOnTop: true,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      // transition: Zoom,
    });
  };

  render() {
    const { errors } = this.state;
    const checkDisableInputBHXH =
      !this.state.isSocialInsurance && this.state.isSocialInsuranceOther
        ? false
        : true;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}
          <ToastContainer />
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
                      <div className="text-dark">Caculary Salary</div>
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
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">Caculator Salary</h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2"></div>
                  </div>
                </div>
                <form>
                  <div className="card-body card-body-caculator">
                    <div className="form-group mb-8">
                      <div
                        className="alert alert-custom alert-default"
                        role="alert"
                      >
                        <div className="alert-icon">
                          <i className="flaticon-warning text-primary" />
                        </div>
                        <div className="alert-text">
                          Salary calculator tool Gross to Net / Net to Gross
                          standard 2021
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 input-salary">
                        <div className="input-salary__label">
                          <span>Salary:</span>
                        </div>
                        <div>
                          <input
                            value={this.state.salaryShow}
                            name="salary"
                            onChange={this.onChangeInput}
                            placeholder="VD: 10,000,000"
                            className={
                              errors.salary
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            type="text"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-3 input-salary">
                        <div className="input-salary__label">
                          <span>SGD:</span>
                        </div>
                        <div>
                          <input
                            value={this.state.sgd}
                            name="sgd"
                            onChange={this.onChangeInputSGD}
                            className={"form-control custom-input-usd"}
                            type="text"
                          ></input>
                        </div>
                      </div>
                      <div className="col-md-4 input-salary">
                        <div className="input-salary__label">
                          <span>Exchange rate:</span>
                        </div>
                        <div>
                          <input
                            value={this.state.tigia}
                            name="tigia"
                            onChange={this.onChangeInputTiGia}
                            className={"form-control"}
                            type="text"
                          ></input>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-8 input-salary">
                        <div className="input-salary__label">Insurance:</div>
                        <div className="div-input-caculator">
                          <div className="radio-inline salary-chinhthuc">
                            <label className="radio">
                              <input
                                onClick={this.toggleSocialInsurance}
                                defaultChecked={this.state.isSocialInsurance}
                                type="radio"
                                name="radios2"
                              />
                              <span></span>
                              Full wage
                            </label>
                          </div>
                          <div className="insurance-group">
                            <div className="radio-inline">
                              <label className="radio">
                                <input
                                  onClick={this.toggleSocialInsuranceOther}
                                  type="radio"
                                  defaultChecked={
                                    this.state.isSocialInsuranceOther
                                  }
                                  name="radios2"
                                />
                                <span></span>
                                Other
                              </label>
                            </div>
                            <input
                              name="insuraneMoney"
                              value={this.state.bhxhShow}
                              onChange={this.onChangeInput}
                              disabled={checkDisableInputBHXH}
                              className={
                                errors.insuraneMoney
                                  ? "form-control custom-input-bhxh is-invalid"
                                  : "form-control custom-input-bhxh"
                              }
                              type="text"
                            />
                            <span className="sub-input-caculator">(VND)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* maintain */}

                    <div className="form-group row">
                      <div className="col-md-3 input-salary">
                        <div className="input-salary__label">PVI:</div>
                        <div>
                          <input
                            name="pvi"
                            value={this.state.pvi}
                            onChange={this.onChangeInput}
                            className="form-control"
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 input-salary">
                        <div className="input-salary__label">
                          Circumstances:
                        </div>
                        <div>
                          <input
                            name="peopleDependent"
                            onChange={this.onChangeInput}
                            className="form-control"
                            type="number"
                          />
                        </div>
                        <span> (people)</span>
                      </div>
                    </div>

                    <div className="footer-caculator">
                      <button
                        onClick={(e) => {
                          this.caculator(e, 0);
                        }}
                        type="button"
                        className="btn btn-primary btn-custom-caculator"
                      >
                        GROSS → NET
                      </button>
                      <button
                        onClick={(e) => {
                          this.caculator(e, 1);
                        }}
                        type="button"
                        className="btn btn-warning btn-custom-caculator"
                      >
                        NET → GROSS
                      </button>
                    </div>
                  </div>
                </form>
                {this.state.data ? (
                  <div className="result-caculator">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="title-detail-caculator">
                            <OverlayTrigger
                              key={`bottom-member`}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Click to copy
                                </Tooltip>
                              }
                              popperConfig={{
                                modifiers: {
                                  preventOverflow: {
                                    enabled: false,
                                  },
                                },
                              }}
                            >
                              <CopyToClipboard
                                text={this.generateTextClipboard(
                                  "table-description"
                                )}
                                onCopy={this.successCopy}
                              >
                                <div className="detail-caculator">
                                  Description (VND)
                                  <button
                                    type="button"
                                    class="btn btn-primary copy-to-clip-board"
                                  >
                                    Copy to clipboard
                                  </button>
                                </div>
                              </CopyToClipboard>
                            </OverlayTrigger>
                          </div>
                          <div className="thetwo-table">
                            <table className="table table-custom-caculator">
                              <tbody>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    GROSS Salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.gross}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.gross
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Social insurance (8 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhxh}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhxh
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Health Insurance (1.5 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhyt}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhyt
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    UnEmployment Insurance (1 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhtn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhtn
                                    )}`}
                                    )
                                  </td>
                                </tr>

                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Taxable Income
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.tnct}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.tnct
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Personal income tax
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.tncn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.tncn
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    Net salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.net}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.net
                                    )}`}
                                    )
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="title-detail-caculator">
                            <OverlayTrigger
                              key={`bottom-member`}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Click to copy
                                </Tooltip>
                              }
                              popperConfig={{
                                modifiers: {
                                  preventOverflow: {
                                    enabled: false,
                                  },
                                },
                              }}
                            >
                              <CopyToClipboard
                                text={this.generateTextClipboard(
                                  "table-company"
                                )}
                                onCopy={this.successCopy}
                              >
                                <div className="detail-caculator">
                                  Paid by the employer gross (VND)
                                  <button
                                    type="button"
                                    class="btn btn-primary copy-to-clip-board"
                                  >
                                    Copy to clipboard
                                  </button>
                                </div>
                              </CopyToClipboard>
                            </OverlayTrigger>
                          </div>
                          <div className="thetwo-table">
                            <table className="table table-custom-caculator">
                              <tbody>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    GROSS Salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.gross}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.gross
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Social insurance (17.5%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhxh}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhxh
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Health Insurance (3%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhyt}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhyt
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    UnEmployment Insurance(1%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhtn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhtn
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">Pvi care</th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.pvi}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.pvi
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">Union tax</th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.unionTax}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.unionTax
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table-active table-custom-caculator">
                                  <th className="title-caculator">
                                    Total expense
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.total}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.total
                                    )}`}
                                    )
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {/* <div className="detail-two-column-caculator">
                        <div className="wrap-caculator-detail">
                          <div className="title-detail-caculator">
                            <OverlayTrigger
                              key={`bottom-member`}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Click to copy
                                </Tooltip>
                              }
                              popperConfig={{
                                modifiers: {
                                  preventOverflow: {
                                    enabled: false,
                                  },
                                },
                              }}
                            >
                              <CopyToClipboard
                                text={this.generateTextClipboard(
                                  "table-description"
                                )}
                                onCopy={this.successCopy}
                              >
                                <div className="detail-caculator">
                                  Description (VND)
                                  <button
                                    type="button"
                                    class="btn btn-primary copy-to-clip-board"
                                  >
                                    Copy to clipboard
                                  </button>
                                </div>
                              </CopyToClipboard>
                            </OverlayTrigger>
                          </div>
                          <div className="thetwo-table">
                            <table className="table table-custom-caculator">
                              <tbody>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    GROSS Salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.gross}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.gross
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Social insurance (8 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhxh}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhxh
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Health Insurance (1.5 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhyt}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhyt
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    UnEmployment Insurance (1 %)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.bhtn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.bhtn
                                    )}`}
                                    )
                                  </td>
                                </tr>

                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Taxable Income
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.tnct}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.tnct
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Personal income tax
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.tncn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.tncn
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    Net salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.net}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.net
                                    )}`}
                                    )
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="wrap-caculator-detail">
                          <div className="title-detail-caculator">
                            <OverlayTrigger
                              key={`bottom-member`}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Click to copy
                                </Tooltip>
                              }
                              popperConfig={{
                                modifiers: {
                                  preventOverflow: {
                                    enabled: false,
                                  },
                                },
                              }}
                            >
                              <CopyToClipboard
                                text={this.generateTextClipboard(
                                  "table-company"
                                )}
                                onCopy={this.successCopy}
                              >
                                <div className="detail-caculator">
                                  Paid by the employer gross (VND)
                                  <button
                                    type="button"
                                    class="btn btn-primary copy-to-clip-board"
                                  >
                                    Copy to clipboard
                                  </button>
                                </div>
                              </CopyToClipboard>
                            </OverlayTrigger>
                          </div>
                          <div className="thetwo-table">
                            <table className="table table-custom-caculator">
                              <tbody>
                                <tr className="table-active">
                                  <th className="title-caculator">
                                    GROSS Salary
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.gross}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.gross
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Social insurance (17.5%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhxh}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhxh
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    Health Insurance (3%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhyt}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhyt
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">
                                    UnEmployment Insurance(1%)
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.companyBhtn}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.companyBhtn
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">Pvi care</th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.pvi}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.pvi
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <th className="title-caculator">Union tax</th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.unionTax}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.unionTax
                                    )}`}
                                    )
                                  </td>
                                </tr>
                                <tr className="table-active table-custom-caculator">
                                  <th className="title-caculator">
                                    Total expense
                                  </th>
                                  <td className="content-caculator">
                                    <strong classsName="convert-tien">
                                      VND
                                    </strong>
                                    : {this.state.data.total}(
                                    <strong classsName="convert-tien">
                                      SGD
                                    </strong>
                                    :{" "}
                                    {`${this.convertVNDToSGD(
                                      this.state.data.total
                                    )}`}
                                    )
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div> */}
                      <div className="row">
                        <div className="col-md-12">
                          <div className="title-detail-caculator">
                            <OverlayTrigger
                              key={`bottom-member`}
                              placement={"top"}
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Click to copy
                                </Tooltip>
                              }
                              popperConfig={{
                                modifiers: {
                                  preventOverflow: {
                                    enabled: false,
                                  },
                                },
                              }}
                            >
                              <CopyToClipboard
                                text={this.generateTextClipboard(
                                  "table-detail-tax"
                                )}
                                onCopy={this.successCopy}
                              >
                                <div className="detail-caculator">
                                  Personal income tax details (VND)
                                  <button
                                    type="button"
                                    class="btn btn-primary copy-to-clip-board"
                                  >
                                    Copy to clipboard
                                  </button>
                                </div>
                              </CopyToClipboard>
                            </OverlayTrigger>
                            {/* <CopyToClipboard text={
                            this.generateTextClipboard('table-detail-tax')
                          }
                            onCopy={() => {
                              this.successCopy()
                            }}>
                            <button type="button" className="btn btn-primary btn-copy-to-clipboard">Copy To Clipboard</button>
                          </CopyToClipboard> */}
                          </div>
                          <div className="firstone-table">
                            <table className="table table-custom-caculator">
                              <thead>
                                <tr className="table-active">
                                  <th scope="col">Taxable rate</th>
                                  <th scope="col">Tax</th>
                                  <th scope="col">Money</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="setWidth45">
                                    Up to 5 million VND
                                  </td>
                                  <td>5%</td>
                                  <td>{this.state.data.percent5}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td>Over 5 million VND to 10 million VND</td>
                                  <td>10%</td>
                                  <td>{this.state.data.percent10}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td className="setWidth45">
                                    From over 10 million VND to 18 million VND
                                  </td>
                                  <td>15%</td>
                                  <td>{this.state.data.percent15}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td className="setWidth45">
                                    From over 18 million VND to 32 million VND
                                  </td>
                                  <td>20%</td>
                                  <td>{this.state.data.percent20}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td className="setWidth45">
                                    From over 32 million VND to 52 million VND
                                  </td>
                                  <td>25%</td>
                                  <td>{this.state.data.percent25}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td className="setWidth45">
                                    From over 52 million VND to 80 million VND
                                  </td>
                                  <td>30%</td>
                                  <td>{this.state.data.percent30}</td>
                                </tr>
                                <tr className="table table-custom-caculator">
                                  <td className="setWidth45">
                                    Over 80 million VND
                                  </td>
                                  <td>35%</td>
                                  <td>{this.state.data.percent35}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {/* <div className="title-detail-caculator">
                        <OverlayTrigger
                          key={`bottom-member`}
                          placement={"top"}
                          overlay={
                            <Tooltip id={`tooltip-top`}>Click to copy</Tooltip>
                          }
                          popperConfig={{
                            modifiers: {
                              preventOverflow: {
                                enabled: false,
                              },
                            },
                          }}
                        >
                          <CopyToClipboard
                            text={this.generateTextClipboard(
                              "table-detail-tax"
                            )}
                            onCopy={this.successCopy}
                          >
                            <div className="detail-caculator">
                              Personal income tax details (VND)
                              <button
                                type="button"
                                class="btn btn-primary copy-to-clip-board"
                              >
                                Copy to clipboard
                              </button>
                            </div>
                          </CopyToClipboard>
                        </OverlayTrigger>
                        
                      </div> */}

                      {/* <div className="firstone-table">
                        <table className="table table-custom-caculator">
                          <thead>
                            <tr className="table-active">
                              <th scope="col">Taxable rate</th>
                              <th scope="col">Tax</th>
                              <th scope="col">Money</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="setWidth45">
                                Up to 5 million VND
                              </td>
                              <td>5%</td>
                              <td>{this.state.data.percent5}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td>Over 5 million VND to 10 million VND</td>
                              <td>10%</td>
                              <td>{this.state.data.percent10}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td className="setWidth45">
                                From over 10 million VND to 18 million VND
                              </td>
                              <td>15%</td>
                              <td>{this.state.data.percent15}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td className="setWidth45">
                                From over 18 million VND to 32 million VND
                              </td>
                              <td>20%</td>
                              <td>{this.state.data.percent20}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td className="setWidth45">
                                From over 32 million VND to 52 million VND
                              </td>
                              <td>25%</td>
                              <td>{this.state.data.percent25}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td className="setWidth45">
                                From over 52 million VND to 80 million VND
                              </td>
                              <td>30%</td>
                              <td>{this.state.data.percent30}</td>
                            </tr>
                            <tr className="table table-custom-caculator">
                              <td className="setWidth45">
                                Over 80 million VND
                              </td>
                              <td>35%</td>
                              <td>{this.state.data.percent35}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div> */}
                    </div>
                  </div>
                ) : (
                  ""
                )}
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

export default connect(mapStateToProps)(CaculatorSalary);
