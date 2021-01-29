import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import React, { Component } from 'react';
import Select from "react-select";
import { rulesCreateInterview } from "../../../utils/rule";
import Validator from "../../../utils/validator";
import moment from 'moment'
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import { dynamicDateServer } from "../../../utils/common/convertDate";
class Create extends Component {
    constructor() {
        super();
        this.state = {
            jobSelected: {
                key: '',
                value: ''
            },
            candidateSelected: {
                key: '',
                value: ''
            },
            typeSelected: {
                key: '',
                value: ''
            },
            jobName: '',
            jobId: '',
            location: '',
            typePassword: 'password',
            timeInterview: moment(),
            timeInterviewEnd: moment(),
            type: '',
            candidateId: '',
            password: 'fetchtech',
            scrollBehaviour: "inside",
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
        this.handleOnChangeJob = this.handleOnChangeJob.bind(this);
        this.handleCreateInterview = this.handleCreateInterview.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleOnChangeCandidate = this.handleOnChangeCandidate.bind(this)
        this.defaultState = this.defaultState.bind(this)
        this.handleOnChangeType = this.handleOnChangeType.bind(this)
        this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this)
        this.validator = new Validator(rulesCreateInterview);
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
        console.log({ [fields]: moment(_moment) })
        this.setState({
            [fields]: moment(_moment),
        });
    }

    defaultState() {
        this.setState({
            jobSelected: {
                key: '',
                value: ''
            },
            candidateSelected: {
                key: '',
                value: ''
            },
            typeSelected: {
                key: '',
                value: ''
            },
            jobName: '',
            location: '',
            timeInterview: moment(),
            timeInterviewEnd: moment(),
            candidateId: '',
            scrollBehaviour: "inside",
            errors: {}
        })
    }


    handleOnChangeJob(e) {
        const { value, label } = e
        this.props.getDataCandidateById(value)
        this.setState({
            jobName: label,
            jobId: value,
            jobSelected: e,
            candidateSelected: {
                key: '',
                value: ''
            },
            candidateId: ''
        });
        this.removeError('jobName')
    }

    handleOnChangeCandidate(e) {
        this.setState({
            candidateSelected: e,
            candidateId: e.id,
            location: e.location
        })
        this.removeError('candidateId')
    }

    handleOnChangeType(e) {
        this.setState({
            typeSelected: e,
            type: e.value,
        })
        this.removeError('type')
    }

    handleInputChange(e) {
        console.log(e)
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value,
        });
        this.removeError(name);
    }

    removeError = (key) => {
        const { errors } = this.state;
        delete errors[key];
        this.setState({
            errors: errors
        })
    }

    isEmpty(obj) {
        // check obj empty
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    handleCreateInterview(e) {
        e.preventDefault();
        const data = this.state;
        const errors = this.validator.validate(this.state);
        this.setState({
            errors: errors,
        });
        if (this.isEmpty(errors)) {
            const item = {
                jobName: data.jobName,
                location: data.location,
                jobId: data.jobId,
                timeInterview: dynamicDateServer(data.timeInterview).format('MM/DD/YYYY HH:mm'),
                timeInterviewEnd: `${dynamicDateServer(data.timeInterview).format('MM/DD/YYYY HH:mm').substring(0, 11)}${data.timeInterviewEnd.format('HH:mm')}`,
                candidateId: data.candidateId,
                type: data.type,
                password: data.password
            }
            this.props.createInterview(item);
        }
    }
    componentWillReceiveProps (){
        if(!this.props.show){
            this.defaultState();
        }
    }

    render() {
        const self = this;
        const { jobs, candidates } = this.props;
        const { errors } = this.state;
        return (
            <ModalTransition>
                {this.props.show && (
                    <Modal
                        onClose={self.props.onHide}
                        scrollBehavior={this.state.scrollBehaviour}
                        height={"auto"}
                        width={800}
                    >
                        <form className="form" onSubmit={this.handleCreateInterview}>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Name job:</label>
                                    <Select
                                        name="option"
                                        className={errors.jobName ? 'invalid-selected' : ''}
                                        options={jobs}
                                        value={this.state.jobSelected}
                                        onChange={this.handleOnChangeJob}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Candidate:</label>
                                    <Select
                                        name="option"
                                        options={candidates}
                                        className={errors.candidateId ? 'invalid-selected' : ''}
                                        value={this.state.candidateSelected}
                                        onChange={this.handleOnChangeCandidate}
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>Location:</label>
                                            <input disabled type="text" name="location" value={this.state.location} onChange={this.handleInputChange} className={
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
                                    <button type="reset" className="btn btn-secondary" onClick={this.props.onHide}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </Modal>
                )
                }
            </ModalTransition>
        );
    }
}


export default Create;