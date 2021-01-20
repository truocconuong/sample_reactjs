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
      salaryShow: '',
      bhxhShow: '',
      errors: {},
      data: '',
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

  onChangeInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    const checkingNow = value.replaceAll('.', '')
    if (+checkingNow || value ==='') {
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
  render() {
    const { errors } = this.state;
    const checkDisableInputBHXH = !this.state.isSocialInsurance && this.state.isSocialInsuranceOther ? false : true
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
                          Công cụ tính lương Gross sang Net / Net sang Gross chuẩn 2021</div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-1 col-form-label form-label-title-caculator">Thu nhập:</label>
                      <div className="col-2">
                        <div className="div-input-caculator">
                          <input value={this.state.salaryShow} name="salary" onChange={this.onChangeInput} placeholder="VD: 10,000,000"
                            className={
                              errors.salary
                                ? "form-control is-invalid" :
                                'form-control'
                            }
                            type="text" /><span className="sub-input-caculator">(VNĐ)</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-1 col-form-label form-label-title-caculator">Bảo hiểm:</label>
                      <div className="col-11 div-input-caculator">
                        <div className="div-input-caculator">
                          <div className="radio-inline salary-chinhthuc">
                            <label className="radio">
                              <input onClick={this.toggleSocialInsurance} defaultChecked={this.state.isSocialInsurance} type="radio" name="radios2" />
                              <span></span>
                          Trên lương chính thức
                      </label>
                          </div>
                          <div className="radio-inline">
                            <label className="radio">
                              <input onClick={this.toggleSocialInsuranceOther} type="radio" defaultChecked={this.state.isSocialInsuranceOther} name="radios2" />
                              <span></span>
                         Khác
                      </label>
                          </div>
                          <input name="insuraneMoney" value={this.state.bhxhShow} onChange={this.onChangeInput} disabled={checkDisableInputBHXH}
                            className={
                              errors.insuraneMoney
                                ? "form-control custom-input-bhxh is-invalid" :
                                'form-control custom-input-bhxh'
                            } type="text" /><span className="sub-input-caculator">(VNĐ)</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-1 col-form-label form-label-title-caculator">Phụ thuộc:</label>
                      <div className="col-2">
                        <div className="div-input-caculator">
                          <input name="peopleDependent" onChange={this.onChangeInput} className="form-control" type="number" /><span className="sub-input-caculator">(người)</span>
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
                        <div className="firstone-table">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Lương Gross</th>
                                <th scope="col">Bảo Hiểm</th>
                                <th scope="col">Thuế TNCN</th>
                                <th scope="col">Lương Net</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="table-active">
                                <td>{this.state.data.moneyGross}</td>
                                <td>- {this.state.data.insuranceMoney}</td>
                                <td>- {this.state.data.taxPersonal}</td>
                                <td>{this.state.data.moneyNet}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="detail-caculator">
                          Diễn giải chi tiết (VNĐ)
                        </div>
                        <div className="thetwo-table">
                          <table className="table">
                            <tbody>
                              <tr className="table-active">
                                <th className="title-caculator">Lương Gross</th>
                                <td className="content-caculator">{this.state.data.moneyGross}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm xã hội (8%)</th>
                                <td className="content-caculator">- {this.state.data.bhxh}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm y tế (1.5%)</th>
                                <td className="content-caculator">- {this.state.data.bhyt}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm thất nghiệp (1%)</th>
                                <td className="content-caculator">- {this.state.data.bhtn}</td>
                              </tr>

                              <tr className="table">
                                <th className="title-caculator">Thu nhập trước thuế</th>
                                <td className="content-caculator">{this.state.data.beforeTax}</td>
                              </tr>

                              <tr className="table">
                                <th className="title-caculator">Giảm trừ gia cảnh</th>
                                <td className="content-caculator">- {this.state.data.reducerYourself}</td>
                              </tr>

                              <tr className="table">
                                <th className="title-caculator">Giảm trừ gia cảnh người phụ thuộc</th>
                                <td className="content-caculator">- {this.state.data.circumstances}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Thu nhập chịu thuế</th>
                                <td className="content-caculator">{this.state.data.taxesGross}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Thuế thu nhập cá nhân(*)</th>
                                <td className="content-caculator">- {this.state.data.taxPersonal}</td>
                              </tr>
                              <tr className="table-active">
                                <th className="title-caculator">Lương NET</th>
                                <td className="content-caculator">{this.state.data.moneyNet}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="detail-caculator">
                        Người sử dụng lao động trả (VNĐ)
                        </div>
                        <div className="thetwo-table">
                          <table className="table">
                            <tbody>
                              <tr className="table-active">
                                <th className="title-caculator">Lương Gross</th>
                                <td className="content-caculator">{this.state.data.companySalaryGross}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm xã hội (17%)</th>
                                <td className="content-caculator">{this.state.data.companyBhxh}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm y tế (3%)</th>
                                <td className="content-caculator">{this.state.data.companyBhyt}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm nghề nghiệp (0.5%)</th>
                                <td className="content-caculator">{this.state.data.companyBhnn}</td>
                              </tr>
                              <tr className="table">
                                <th className="title-caculator">Bảo hiểm thất nhiệp (1%)</th>
                                <td className="content-caculator">{this.state.data.companyBhtn}</td>
                              </tr>
                              <tr className="table-active">
                                <th className="title-caculator">Tổng</th>
                                <td className="content-caculator">{this.state.data.companyTotal}</td>
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
