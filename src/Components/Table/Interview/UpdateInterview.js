import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, Redirect } from 'react-router-dom';
import Network from '../../../Service/Network';
import Fbloader from '../../libs/PageLoader/fbloader';
import Select from "react-select";
import _ from 'lodash'
import Validator from '../../../utils/validator';
import { rulesUpdateInterview } from '../../../utils/rule';
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker";
import moment from 'moment'
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast";
const api = new Network();

class UpdateInterview extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
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
            linkZoom: '',
            type: '',
            typePassword: 'password',
            password : 'fetchtech',
            scrollBehaviour: "inside",
            jobs: [],
            candidates: [],
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
        this.getInterviewDetail = this.getInterviewDetail.bind(this);
        // this.initData = this.initData.bind(this);
        this.getDataJob = this.getDataJob.bind(this)
        this.handleOnChangeJob = this.handleOnChangeJob.bind(this)
        this.getDataCandidateById = this.getDataCandidateById.bind(this)
        this.handleOnChangeCandidate = this.handleOnChangeCandidate.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleUpdateInterview = this.handleUpdateInterview.bind(this)
        this.handleOnChangeType = this.handleOnChangeType.bind(this)
        this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this)
        this.validator = new Validator(rulesUpdateInterview);
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


    isEmpty(obj) {
        // check obj empty
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }


    async getInterviewDetail() {
        const { id } = this.props;
        let self = this;
        self.setState({
            isLoading: true,
        });

        const response = await api.get(`/api/admin/interview/${id}`);
        if (response) {
            const interview = response.data.interview;
            const data = {
                isLoading: false,
                location: interview.CandidateJob.Job.Location.name,
                timeInterview: moment(interview.timeInterview).subtract('7','hours'),
                timeInterviewEnd: moment(interview.timeInterviewEnd).subtract('7','hours'),
                linkZoom: interview.linkZoom,
                jobName: interview.CandidateJob.Job.title,
                candidateId: interview.CandidateJob.Candidate.id,
                type: interview.type,
                typeSelected: { value: interview.type, label: interview.type }
            }
            data.jobSelected = {
                value : interview.CandidateJob.Job.id,
                label : interview.CandidateJob.Job.title
            }
            if (data.jobSelected) {
                await this.getDataCandidateById(data.jobSelected.value);
                const fillDataSelectedCandidate = _.find(this.state.candidates, candidate => candidate.value === interview.CandidateJob.Candidate.id);
                if (fillDataSelectedCandidate) {
                    data.candidateSelected = fillDataSelectedCandidate;
                }
            }
            self.setState(data);
        }

    }

    handleOnChangeCandidate(e) {
        this.setState({
            candidateSelected: e,
            candidateId: e.id,
            location: e.location
        })
    }

    handleOnChangeType(e) {
        this.setState({
            typeSelected: e,
            type: e.value
        })
    }


    handleInputChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value,
        });
        this.removeError(name);
    }

    handleOnChangeJob(e) {
        const { value, label } = e
        this.getDataCandidateById(value)
        this.setState({
            jobName: label,
            jobSelected: e,
            candidateSelected: {
                key: '',
                value: ''
            },
            candidateId: ''
        });
        this.removeError('jobName')
    }

    removeError = (key) => {
        const { errors } = this.state;
        delete errors[key];
        this.setState({
            errors: errors
        })
    }



    componentDidMount() {
        this.getDataJob();
        this.getInterviewDetail();
    }


    async handleUpdateInterview(e) {
        e.preventDefault();
        const data = this.state;
        console.log(data)
        const errors = this.validator.validate(this.state);
        this.setState({
            errors: errors,
        });

        if (this.isEmpty(errors)) {
            const item = {
                jobName: data.jobName,
                location: data.location,
                timeInterview: data.timeInterview.format('MM/DD/YYYY HH:mm'),
                timeInterviewEnd: `${data.timeInterview.format('MM/DD/YYYY HH:mm').substring(0, 11)}${data.timeInterviewEnd.format('HH:mm')}`,
                candidateId: data.candidateId,
                linkZoom: data.linkZoom,
                type: data.type,
                password : data.password
            }
            try {
                const response = await api.patch(`/api/admin/interview/${this.props.id}`, item)
                if (response) {
                    toast(<CustomToast title={"Update Success!"}/>, {
                        position: toast.POSITION.TOP_CENTER,
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
                        transition: Zoom,
                      });
                    this.getInterviewDetail();
                }
            } catch (error) {
                toast(<CustomToast title={"Update error some times!"} type={"error"}/>, {
                    position: toast.POSITION.TOP_CENTER,
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
                    transition: Zoom,
                  });
            }
        }
    }

    async getDataCandidateById(id) {
        const response = await api.get(`/api/candidate/interview/${id}`);
        if (response) {
            const candidates = _.map(response.data.candidate, candidate => {
                return {
                    ...candidate,
                    value: candidate.id,
                    label: `${candidate.email} (${candidate.phone}) `
                }
            });
            this.setState({
                candidates: candidates
            })
        }
    }

    async getDataJob() {
        try {
            const response = await api.get(`/api/jobs`);
            if (response) {
                this.setState({
                    jobs: _.map(response.data.list, job => {
                        return {
                            value: job.id,
                            label: job.title
                        }
                    })
                })
            }
        } catch (error) {

        }
    }



    render() {
        const { errors } = this.state;
        return (
            <div
                className={`d-flex flex-column flex-row-fluid wrapper  ${this.props.className_wrap_broad}`}
            >
                   <ToastContainer closeOnClick autoClose={1000} rtl={false} />
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
                                            <NavLink to="/" className="text-muted">
                                                Fetch admin
                      </NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <NavLink to="/interview" className="text-muted">
                                                Interview
                      </NavLink>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <span
                                                className="text-muted"
                                                style={{ cursor: "pointer" }}
                                            >
                                                Interview update
                      </span>
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
                                        <h3 className="card-label">
                                            Update Interview
                          
                                        </h3>
                                    </div>
                                    <div className="card-toolbar">
                                       
                                        <div className="dropdown dropdown-inline mr-2">
                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form className="form" onSubmit={this.handleUpdateInterview}>
                                        <div className="card-body">
                                            <div className="form-group">
                                                <label>Name job:</label>
                                                <Select
                                                    name="option"
                                                    className={errors.jobName ? 'invalid-selected' : ''}
                                                    options={this.state.jobs}
                                                    value={this.state.jobSelected}
                                                    onChange={this.handleOnChangeJob}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Candidate:</label>
                                                <Select
                                                    name="option"
                                                    options={this.state.candidates}
                                                    className={errors.candidateId ? 'invalid-selected' : ''}
                                                    value={this.state.candidateSelected}
                                                    onChange={this.handleOnChangeCandidate}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label>Location:</label>
                                                        <input disabled type="text" value={this.state.location} name="location" onChange={this.handleInputChange} className={
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
                                                                <input readOnly name="timeInterview" value={this.state.timeInterview.format('DD/MM/YYYY HH:mm')} className={'form-control'}
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
                                            <div className="form-group">
                                            <label>Link Zoom:</label>
                                            <input disabled type="text" onChange={this.handleInputChange} value={this.state.linkZoom ? this.state.linkZoom : ''} name="linkZoom" className="form-control"
                                                placeholder="Enter link zoom" />
                                        </div>
                                        </div>
                                        <div className="modal-cus__right text-right">
                                            <button type="submit" className="btn btn-primary mr-2">Save</button>
                                            <Link
                                                to={`/interview`}
                                            >
                                                <button type="reset" className="btn btn-secondary" >Cancel</button>
                                            </Link>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        className_wrap_broad: state.ui.className_wrap_broad,
        id: ownProps.match.params.id
    };
};

export default connect(mapStateToProps)(UpdateInterview);
