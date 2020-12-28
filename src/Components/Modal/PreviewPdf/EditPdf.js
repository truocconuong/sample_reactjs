import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast, Zoom } from "react-toastify";
import _ from 'lodash'

export default class EditPdf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
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


    render() {
        const { errors } = this.state;
        const { data } = this.props;
        return (
            <Modal size="lg" show={this.props.show} onHide={this.props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit pdf </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ToastContainer closeOnClick autoClose={1000} rtl={false} />
                    <form className="form">
                        <div className="card-body card-body-update">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Name </label>
                                        <input type="text" value={data.name} onChange={(e) => this.props.handleInputDataChange(e)} name="name" className={
                                            errors.name
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter name" />
                                    </div>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Address </label>
                                        <input value={data.address} type="text" onChange={(e) => this.props.handleInputDataChange(e)} name="address" className={
                                            errors.name
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter address" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Objective </label>
                                        <textarea value={data.objective} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="objective" className={
                                            errors.objective
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Objective">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Summary </label>
                                        <textarea value={data.summary} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="summary" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Summary">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Technology </label>
                                        <textarea value={data.technology} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="technology" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Technology">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Experience </label>
                                        <textarea value={data.experience} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="experience" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Experience">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Education </label>
                                        <textarea value={data.education} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="education" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Education">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Skills </label>
                                        <textarea value={data.skills} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="skills" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Skills">
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Language </label>
                                        <textarea value={data.language} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="language" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Language">
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Courses </label>
                                        <textarea value={data.courses} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="courses" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Courses">
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Projects </label>
                                        <textarea value={data.projects} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="projects" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Projects">
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Contacts </label>
                                        <textarea value={data.contacts} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="contacts" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Contacts">
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label>Positions </label>
                                        <textarea value={data.positions} type="text" rows="5" onChange={(e) => this.props.handleInputDataChange(e)} name="positions" className={
                                            errors.summary
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                            placeholder="Enter Positions">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer add-card">
                            <button type="reset" className="btn btn-primary mr-2" onClick={this.props.makePdf}>Save</button>
                            <button type="reset" className="btn btn-secondary" onClick={this.props.onHide}>Cancel</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}
