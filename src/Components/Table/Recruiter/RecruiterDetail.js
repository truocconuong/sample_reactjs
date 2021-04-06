import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Network from '../../../Service/Network';
import _ from 'lodash'
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast, Zoom } from "react-toastify";
import { SketchPicker, ChromePicker } from 'react-color'
import reactCSS from 'reactcss';
import { CopyToClipboard } from "react-copy-to-clipboard";
import ProfileDetail from './RecruiterOther/ProfileDetail';
import CandidateDetail from './RecruiterOther/CandidateDetail';

const api = new Network();

class RecruiterDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollBehaviour: "inside",
            isOpen: true,
            profile: {},
            isOpenFormProfile: true,
            errors: {}
        };
    }
    setFormProfile = (status) => {
        this.setState({
            isOpenFormProfile: status
        })
    }
    componentDidMount() {
        this.getDataDetailRecruiter();
    }

    getDataDetailRecruiter = async () => {
        const { id } = this.props;
        const calcBonus = await api.get(`/api/v1/calc/bonus?recruiterId=${id}`)
        const response = await api.get(`/api/v1/candidate/recruiter/${id}`);
        if (response) {
            const profile = response.data.profile;
            this.setState({
                profile: profile
            })

        }

    }
    render() {
        const { profile } = this.state;
        return (
            <div
                className={`d-flex flex-column flex-row-fluid wrapper  ${this.props.className_wrap_broad}`}
            >
                <ToastContainer closeOnClick autoClose={1000} rtl={false} />
                {this.state.redirectToClient ? <Redirect to="/client" /> : ''}
                <div className="content d-flex flex-column flex-column-fluid">

                    <div
                        className="subheader py-3 py-lg-8 subheader-transparent"
                        id="kt_subheader"
                    >
                        <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                            <div className="d-flex align-items-center mr-1">
                                <div className="d-flex align-items-baseline flex-wrap mr-5">
                                </div>
                            </div>

                            <div className="d-flex align-items-center flex-wrap"></div>

                        </div>
                    </div>
                    <div className="d-flex flex-column-fluid">
                        <div className="container">
                            <div className="card card-custom">
                                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                                    <div className="card-title header-recruiter-detail">
                                        <h3 className="card-label">
                                            Detail Recruiter
                                        </h3>
                                        <ul className="nav nav-pills nav-pills-sm nav-dark-75">
                                            <li onClick={() => {
                                                this.setFormProfile(true)
                                            }} className="nav-item ">
                                                <div
                                                    className={`nav-link py-2 px-4 ${this.state.isOpenFormProfile ? 'active' : ''}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Profile
                                                    </div>

                                            </li>

                                            <li onClick={() => {
                                                this.setFormProfile(false)
                                            }} className="nav-item ">
                                                <div
                                                    className={`nav-link py-2 px-4 ${!this.state.isOpenFormProfile ? 'active' : ''}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Candidates
                                                    </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-header card-header-tabs-line">
                                        <div className="card-toolbar">
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="tab-content pt-5">
                                            {
                                                this.state.isOpenFormProfile ? (
                                                    <ProfileDetail
                                                        profile={profile}
                                                    />
                                                ) : (
                                                    <CandidateDetail
                                                        profile={profile}
                                                    />
                                                )
                                            }
                                        </div>
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



const mapStateToProps = (state, ownProps) => {
    return {
        className_wrap_broad: state.ui.className_wrap_broad,
        id: ownProps.match.params.id
    };
};

export default connect(mapStateToProps)(RecruiterDetail);
