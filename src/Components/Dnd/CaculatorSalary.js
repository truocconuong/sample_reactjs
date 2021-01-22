import React, { Component } from "react";
import _ from 'lodash';
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import './styles.css'
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
      sgd: '',
      tigia: 17423,
      salaryShow: '',
      bhxhShow: '',
      errors: {},
      data: '',
      value: '',
      copied: false,
    };
    this.validator = new Validator(rulesCaculatorSalary);
  }
  toggleSocialInsurance = () => {
    this.setState({
      isSocialInsurance: !this.state.isSocialInsurance,
      isSocialInsuranceOther: false
    })
  }
  toggleSocialInsuranceOther = () => {
    this.setState({
      isSocialInsurance: false,
      isSocialInsuranceOther: !this.state.isSocialInsuranceOther,
    })
  }

  // successCopy = () => {
  //   toast(<CustomToast title={"Copied to clipboard!"} />, {
  //     position: toast.POSITION.BOTTOM_RIGHT,
  //     autoClose: 3000,
  //     className: "toast_login",
  //     closeButton: false,
  //     hideProgressBar: true,
  //     newestOnTop: true,
  //     closeOnClick: true,
  //     rtl: false,
  //     pauseOnFocusLoss: true,
  //     draggable: true,
  //     pauseOnHover: true,
  //     // transition: Zoom,
  //   });
  // };

  onChangeInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    const checkingNow = value.replaceAll('.', '')
    if (+checkingNow || value === '') {
      if (name === 'salary') {
        value = value.replaceAll('.', '')
      }
      if (name === 'insuraneMoney') {
        value = value.replaceAll('.', '')
      }
      const data = {
        [name]: value
      }
      this.setState(data, () => {
        if (name === 'salary') {
          this.setState({
            salaryShow: this.convertVND(this.state.salary)
          })
        }
        if (name === 'insuraneMoney') {
          this.setState({
            bhxhShow: this.convertVND(this.state.insuraneMoney)
          })
        }
      })
    }
  }

  onChangeInputSGD = (e) => {
    const data = this.state;
    const name = e.target.name;
    const value = e.target.value;
    if (data.tigia) {
      const convertSGDVnd = Number(Number(value * data.tigia.toFixed(0)))
      this.setState({
        [name]: value,
        salary: convertSGDVnd.toString(),
        salaryShow: this.convertVND(convertSGDVnd)
      })
    }
  }

  onChangeInputTiGia = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: Number(value)
    })
  }

  convertVND(number) {
    const numberFormat = Number(number)
    return numberFormat.toLocaleString('it-IT');
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  caculator = async (e, type) => {
    e.preventDefault();
    const data = this.state;
    console.log(data)
    const errors = this.validator.validate(data);
    if (data.isSocialInsurance) {
      delete errors['insuraneMoney'];
    }
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      const dataSending = {
        type: type,
        salary: Number(data.salary),
        insuraneMoney: data.isSocialInsurance ? Number(data.salary) : Number(data.insuraneMoney),
        peopleDependent: Number(data.peopleDependent),
      }
      await this.caculatorSalary(dataSending);
    }
  }

  caculatorSalary = async (data) => {
    const response = await api.post('/api/v1/caculator/salary', data);
    if (response) {
      this.setState({
        data: response.data.result
      })
    }
  }

  generateTextClipboard = (table) => {
    const { data } = this.state;
    console.log(data)
    let text = ''
    if (table === 'table-description') {
      text = `
      GROSS Salary ${data.moneyGross}\n
      Social insurance (8 %) ${data.bhxh}\n
      Health Insurance (1.5 %) ${data.bhyt}\n
      UnEmployment Insurance (1 %) ${data.bhtn}\n
      Income before tax	${data.beforeTax}\n
      For the tax payer	${data.reducerYourself}\n
      Reduction based on family circumstances	${data.circumstances}\n
      Assessable Income	${data.taxPersonal}\n
      Net salary ${data.moneyNet}
      `
    }
    if (table === 'table-detail-tax') {
      text = `
      Up to 5 million VND(5%) ${data.percent5}\n
      Over 5 million VND to 10 million VND(10%) ${data.percent10}\n
      From over 10 million VND to 18 million VND(15%) ${data.percent15}\n
      From over 18 million VND to 32 million VND(20%) ${data.percent20}\n
      From over 32 million VND to 52 million VND(25%) ${data.percent25}\n
      From over 52 million VND to 80 million VND(30%)	${data.percent30}\n
      Over 80 million VND(35%)	${data.percent35}\n
      `
    }
    if (table === 'table-company') {
      text = `
      GROSS Salary ${data.companySalaryGross}\n
      Social insurance (17%) ${data.companyBhxh}\n
      Health Insurance (3%) ${data.companyBhyt}\n
      Occupational Insurance (0.5%) ${data.companyBhnn}\n
      UnEmployment Insurance (1%) ${data.companyBhtn}\n
      Total ${data.companyTotal}
      `
    }
    return text;
  }

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
    const checkDisableInputBHXH = !this.state.isSocialInsurance && this.state.isSocialInsuranceOther ? false : true
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
                  <div className="card-body">
                    <div className="form-group mb-8">
                      <div className="alert alert-custom alert-default" role="alert">
                        <div className="alert-icon"><i className="flaticon-warning text-primary" /></div>
                        <div className="alert-text">
                          Salary calculator tool Gross to Net / Net to Gross standard 2021</div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-12">
                        <div className="thunhap-caculator">
                          <div className="caculator-item">
                            <div className="row row-caculator-hi">
                              <label className="col-4 form-label-title-caculator the-first-caculator">Salary:</label>
                              <div className="col-8">
                                <div className="div-input-caculator">
                                  <input value={this.state.salaryShow} name="salary" onChange={this.onChangeInput} placeholder="VD: 10,000,000"
                                    className={
                                      errors.salary
                                        ? "form-control is-invalid" :
                                        'form-control'
                                    }
                                    type="text" /><span className="sub-input-caculator">(VND)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="caculator-item">
                            <label className="radio">SGD:</label>
                            <div>
                              <div className="div-input-caculator">
                                <input value={this.state.sgd} name="sgd" onChange={this.onChangeInputSGD}
                                  className={
                                    'form-control custom-input-usd'
                                  }
                                  type="text" />
                              </div>
                            </div>
                          </div>

                          <div className="caculator-item">
                            <label className="radio">Exchange rate :</label>
                            <div>
                              <div className="div-input-caculator">
                                <input value={this.state.tigia} name="tigia" onChange={this.onChangeInputTiGia}
                                  className={
                                    'form-control'
                                  }
                                  type="text" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-1 col-form-label form-label-title-caculator">Insurance:</label>
                      <div className="col-11 div-input-caculator">
                        <div className="div-input-caculator">
                          <div className="radio-inline salary-chinhthuc">
                            <label className="radio">
                              <input onClick={this.toggleSocialInsurance} defaultChecked={this.state.isSocialInsurance} type="radio" name="radios2" />
                              <span></span>
                              Full wage
                      </label>
                          </div>
                          <div className="radio-inline">
                            <label className="radio">
                              <input onClick={this.toggleSocialInsuranceOther} type="radio" defaultChecked={this.state.isSocialInsuranceOther} name="radios2" />
                              <span></span>
                         Other
                      </label>
                          </div>
                          <input name="insuraneMoney" value={this.state.bhxhShow} onChange={this.onChangeInput} disabled={checkDisableInputBHXH}
                            className={
                              errors.insuraneMoney
                                ? "form-control custom-input-bhxh is-invalid" :
                                'form-control custom-input-bhxh'
                            } type="text" /><span className="sub-input-caculator">(VND)</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-2 col-form-label form-label-title-caculator">Reduction based on family circumstances:</label>
                      <div className="col-2">
                        <div className="div-input-caculator">
                          <input name="peopleDependent" onChange={this.onChangeInput} className="form-control" type="number" /><span className="sub-input-caculator">(people)</span>
                        </div>
                      </div>
                    </div>
                    <div className="footer-caculator">
                      <button onClick={(e) => {
                        this.caculator(e, 0)
                      }} type="button" className="btn btn-primary btn-custom-caculator">GROSS → NET</button>
                      <button onClick={(e) => {
                        this.caculator(e, 1)
                      }} type="button" className="btn btn-warning btn-custom-caculator">NET → GROSS</button>
                    </div>
                  </div>
                </form>
                {
                  this.state.data ? (
                    <div className="result-caculator">
                      <div className="card-body">
                        <div className="detail-two-column-caculator">
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
                                  text={
                                    this.generateTextClipboard('table-description')
                                  }
                                  onCopy={this.successCopy}
                                >
                                  <div className="detail-caculator">
                                    Description (VND)
                              </div>
                                </CopyToClipboard>
                              </OverlayTrigger>
                              {/* <CopyToClipboard text={
                                this.generateTextClipboard('table-description')
                              }
                                onCopy={() => {
                                  this.successCopy()
                                }}>
                                <button type="button" className="btn btn-primary btn-copy-to-clipboard">Copy To Clipboard</button>
                              </CopyToClipboard> */}
                            </div>
                            <div>
                            </div>
                            <div className="thetwo-table">
                              <table className="table table-custom-caculator">
                                <tbody>
                                  <tr className="table-active">
                                    <th className="title-caculator">GROSS Salary</th>
                                    <td className="content-caculator">{this.state.data.moneyGross}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Social insurance (8 %)</th>
                                    <td className="content-caculator">- {this.state.data.bhxh}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Health Insurance (1.5 %)</th>
                                    <td className="content-caculator">- {this.state.data.bhyt}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">UnEmployment Insurance (1 %)</th>
                                    <td className="content-caculator">- {this.state.data.bhtn}</td>
                                  </tr>

                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Income before tax</th>
                                    <td className="content-caculator">{this.state.data.beforeTax}</td>
                                  </tr>

                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">For the tax payer</th>
                                    <td className="content-caculator">- {this.state.data.reducerYourself}</td>
                                  </tr>

                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Reduction based on family circumstances</th>
                                    <td className="content-caculator">- {this.state.data.circumstances}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Assessable Income</th>
                                    <td className="content-caculator">{this.state.data.taxesGross}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Personal income tax</th>
                                    <td className="content-caculator">- {this.state.data.taxPersonal}</td>
                                  </tr>
                                  <tr className="table-active">
                                    <th className="title-caculator">Net salary</th>
                                    <td className="content-caculator">{this.state.data.moneyNet}</td>
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
                                  text={
                                    this.generateTextClipboard('table-company')
                                  }
                                  onCopy={this.successCopy}
                                >
                                  <div className="detail-caculator">
                                    Paid by the employer gross (VND)
                              </div>
                                </CopyToClipboard>
                              </OverlayTrigger>
                            </div>
                            <div className="thetwo-table">
                              <table className="table table-custom-caculator">
                                <tbody>
                                  <tr className="table-active">
                                    <th className="title-caculator">GROSS Salary</th>
                                    <td className="content-caculator">{this.state.data.companySalaryGross}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Social insurance (17%)</th>
                                    <td className="content-caculator">{this.state.data.companyBhxh}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Health Insurance (3%)</th>
                                    <td className="content-caculator">{this.state.data.companyBhyt}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">Occupational Insurance(0.5%)</th>
                                    <td className="content-caculator">{this.state.data.companyBhnn}</td>
                                  </tr>
                                  <tr className="table table-custom-caculator">
                                    <th className="title-caculator">UnEmployment Insurance(1%)</th>
                                    <td className="content-caculator">{this.state.data.companyBhtn}</td>
                                  </tr>
                                  <tr className="table-active">
                                    <th className="title-caculator">Total</th>
                                    <td className="content-caculator">{this.state.data.companyTotal}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
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
                              text={
                                this.generateTextClipboard('table-detail-tax')
                              }
                              onCopy={this.successCopy}
                            >
                              <div className="detail-caculator">
                                Personal income tax details (VND)
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
                                <td className="setWidth45">Up to 5 million VND</td>
                                <td>5%</td>
                                <td>{this.state.data.percent5}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td>Over 5 million VND to 10 million VND</td>
                                <td>10%</td>
                                <td>{this.state.data.percent10}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td className="setWidth45">From over 10 million VND to 18 million VND</td>
                                <td>15%</td>
                                <td>{this.state.data.percent15}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td className="setWidth45">From over 18 million VND to 32 million VND</td>
                                <td>20%</td>
                                <td>{this.state.data.percent20}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td className="setWidth45">From over 32 million VND to 52 million VND</td>
                                <td>25%</td>
                                <td>{this.state.data.percent25}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td className="setWidth45">From over 52 million VND to 80 million VND</td>
                                <td>30%</td>
                                <td>{this.state.data.percent30}</td>
                              </tr>
                              <tr className="table table-custom-caculator">
                                <td className="setWidth45">Over 80 million VND</td>
                                <td>35%</td>
                                <td>{this.state.data.percent35}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : ''
                }
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
