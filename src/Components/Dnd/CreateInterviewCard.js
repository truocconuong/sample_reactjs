import React, { Component } from 'react';
import { rulesCreateCardInterview } from '../../utils/rule';
import Validator from '../../utils/validator';
import Select from "react-select";
import { Button, Modal, Overlay } from "react-bootstrap";
import moment from 'moment'
import { DatetimePickerTrigger } from "../libs/rc-datetime-picker";
import { dynamicDateServer } from '../../utils/common/convertDate';
class CreateInterviewCard extends Component {
  constructor() {
    super();
    this.state = {
      scrollBehaviour: 'inside',
      timeInterview: moment(),
      timeInterviewEnd: moment(),
      password: 'fetchtech',
      typePassword: 'password',
      typeSelected: {
        key: '',
        value: ''
      },
      type: '',
      errors: {}
    }

    this.types = [
      {
        value: 'offline',
        label: 'Offline'
      },
      {
        value: 'online',
        label: 'Online'
      }
    ]
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreateInterview = this.handleCreateInterview.bind(this);
    this.removeError = this.removeError.bind(this);
    this.handleOnChangeType = this.handleOnChangeType.bind(this)
    this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this)
    this.validator = new Validator(rulesCreateCardInterview);
  }

  toggleEyes = () => {
    const { typePassword } = this.state;
    let typePasswordNew = ''
    if (typePassword === 'password') {
      typePasswordNew = 'text';
    } else {
      typePasswordNew = 'password';
    }
    this.setState({
      typePassword: typePasswordNew
    })

  }
  handleChangeDatePicker(_moment, fields) {
    this.setState({
      [fields]: moment(_moment),
    });
  }

  handleOnChangeType(e) {
    this.setState({
      typeSelected: e,
      type: e.value,
    })
    this.removeError('type')
  }


  handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
    this.removeError(name);
  }

  defaultState = () => {
    this.setState({
      scrollBehaviour: 'inside',
      timeInterview: moment(),
      timeInterviewEnd: moment(),
      typeSelected: {
        key: '',
        value: ''
      },
      type: '',
      errors: {}
    })
  }


  removeError = (key) => {
    const { errors } = this.state;
    delete errors[key];
    this.setState({
      errors: errors
    })
  }

  componentDidMount() {
    this.defaultState();
  }

  handleCreateInterview(e) {
    e.preventDefault();

    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      const content = this.props.data.content
      const data = {
        cardId: this.props.data.id,
        jobName: content.nameJob,
        location: content.location,
        timeInterview: dynamicDateServer(this.state.timeInterview).format('MM/DD/YYYY HH:mm'),
        timeInterviewEnd: `${dynamicDateServer(this.state.timeInterview).format('MM/DD/YYYY HH:mm').substring(0, 11)}${this.state.timeInterviewEnd.format('HH:mm')}`,
        type: this.state.type,
        password: this.state.password
      }
      this.props.createInterview(data);
      this.defaultState();
    }
  }


  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  render() {
    const { errors } = this.state;
    const content = this.props.data.content;
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onHide} centered>
        <Modal.Header closeButton>
          <div className="card-detail-header">
            <div className="detail-header__title">
              <h4>Create Interview</h4>
            </div>
          </div>
        </Modal.Header>

        {this.props.show ? (<form className="form" onSubmit={this.handleCreateInterview}>
          <div className="card-body">
            <div className="form-group">
              <label>Name job:</label>
              <input disabled type="text" value={content.nameJob} className="form-control mb-2 mr-sm-2" placeholder="Enter namejob" />
            </div>

            <div className="form-group">
              <label>Name:</label>
              <input disabled type="text" value={content.name} className="form-control mb-2 mr-sm-2" placeholder="Enter namejob" />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input disabled type="text" value={content.email} className="form-control mb-2 mr-sm-2" />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input disabled type="text" value={content.phone} className="form-control mb-2 mr-sm-2" />
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-md-6">
                  <label>Location:</label>
                  <input disabled type="text" name="location" value={content.location} onChange={this.handleInputChange} className={
                    errors.location
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                    placeholder="Please enter location" />
                </div>

                <div className="col-md-6">
                  <label>Type:</label>
                  <Select
                    name="option"
                    options={this.types}
                    className={errors.type ? 'invalid-selected' : ''}
                    value={this.state.typeSelected}
                    onChange={this.handleOnChangeType}
                  />
                </div>
              </div>
            </div>
            {
              this.state.type === 'online' ? (
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-12">
                      <label>Password</label>
                      <div className="input-group">
                        <input type={this.state.typePassword} name="password" onChange={this.handleInputChange} defaultValue={this.state.password} className={
                          errors.password
                            ? "form-control is-invalid"
                            : "form-control"
                        } />
                        <div className="input-group-append"><span onClick={this.toggleEyes} className="input-group-text"><i className={this.state.typePassword === 'password' ? 'far fa-eye' : 'far fa-eye-slash'} /></span></div>
                      </div>
                      <span className="form-text text-muted">Password zoom need have a maximum of 10 characters.</span>
                    </div>
                  </div>
                </div>
              ) : ''
            }
            <div className="form-group">
              <div className="row">
                <div className="col-md-6">
                  <label> Time Interview:</label>
                  <DatetimePickerTrigger
                    moment={this.state.timeInterview}
                    onChange={(_moment) =>
                      this.handleChangeDatePicker(_moment, "timeInterview")
                    }
                    showTimePicker={true}
                    className="custom-date-picker-interview"
                  >
                    <div className="custom-date-picker-interview__wrap">
                      <input readOnly name="timeInterview" value={this.state.timeInterview.format('YYYY-MM-DD HH:mm')} className={'form-control'}
                        placeholder="Enter Time Interview" />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-calendar icon-lg"></i>
                        </span>
                      </div>
                    </div>
                  </DatetimePickerTrigger>
                </div>
                <div className="col-md-6">
                  <label> Time Interview End:</label>
                  <DatetimePickerTrigger
                    moment={this.state.timeInterviewEnd}
                    onChange={(_moment) =>
                      this.handleChangeDatePicker(_moment, "timeInterviewEnd")
                    }
                    showCalendarPicker={false}
                    showTimePicker={true}
                  >
                    <div className="custom-date-picker-interview__wrap">
                      <input readOnly name="timeInterviewEnd" value={this.state.timeInterviewEnd.format('HH:mm')} className={
                        errors.timeInterviewEnd
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                        placeholder="Enter Time Interview" />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="la la-calendar icon-lg"></i>
                        </span>
                      </div>
                    </div>
                  </DatetimePickerTrigger>
                </div>
              </div>
            </div>

            <div className="modal-cus__right text-right">
              <button type="submit" className="btn btn-primary mr-2">Save</button>
              <button type="reset" className="btn btn-secondary" onClick={this.props.onHide} >Cancel</button>
            </div>
          </div>
        </form>) : ''}
      </Modal>

    );
  }
}

export default CreateInterviewCard;