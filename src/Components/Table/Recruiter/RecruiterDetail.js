import React, { Component } from "react";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import Network from "../../../Service/Network";
import { rulesAddAndUpdateClient } from "../../../utils/rule";
import Validator from "../../../utils/validator";
import { Table } from 'react-bootstrap'
import './style.css'
import _ from 'lodash'

const api = new Network();



export default class RecruiterDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollBehaviour: "inside",
            isOpen: true,
        };
        this.validator = new Validator(rulesAddAndUpdateClient);
    }

    render() {
        console.log(this.props.data);
        return (
            <ModalTransition>
                {this.props.show && (
                    <Modal
                        onClose={this.props.onHide}
                        scrollBehavior={this.state.scrollBehaviour}
                        width={"x-large"}
                    >
                        {!_.isEmpty(this.props.data) ? (
                            <div className="recruiter-detail">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Job</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            _.map(this.props.data, canJob => (
                                                <tr>
                                                    <td>
                                                        {
                                                            canJob.Candidate.name
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            canJob.Candidate.email
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            canJob.Job.title
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            canJob.Lane ? canJob.Lane.nameColumn : ''
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        ) : ''}

                    </Modal>
                )}
            </ModalTransition>
        );
    }
}
