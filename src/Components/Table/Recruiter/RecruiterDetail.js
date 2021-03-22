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
        console.log(profile)
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
                                    <div className="card-title">
                                        <h3 className="card-label">
                                            Detail Recruiter
                                        </h3>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="card-header card-header-tabs-line">
                                        <div className="card-toolbar">
                                            <ul className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x" role="tablist">
                                                <li className="nav-item mr-3">
                                                    <a onClick={() => {
                                                        this.setFormProfile(true)
                                                    }} className={`nav-link ${this.state.isOpenFormProfile ? 'active' : ''}`} data-toggle="tab" >
                                                        <span className="nav-icon mr-2">
                                                            <span className="svg-icon mr-3">
                                                                {/*begin::Svg Icon | path:/metronic/theme/html/demo3/dist/assets/media/svg/icons/Communication/Chat-check.svg*/}
                                                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                                                        <rect x={0} y={0} width={24} height={24} />
                                                                        <path d="M4.875,20.75 C4.63541667,20.75 4.39583333,20.6541667 4.20416667,20.4625 L2.2875,18.5458333 C1.90416667,18.1625 1.90416667,17.5875 2.2875,17.2041667 C2.67083333,16.8208333 3.29375,16.8208333 3.62916667,17.2041667 L4.875,18.45 L8.0375,15.2875 C8.42083333,14.9041667 8.99583333,14.9041667 9.37916667,15.2875 C9.7625,15.6708333 9.7625,16.2458333 9.37916667,16.6291667 L5.54583333,20.4625 C5.35416667,20.6541667 5.11458333,20.75 4.875,20.75 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                                        <path d="M2,11.8650466 L2,6 C2,4.34314575 3.34314575,3 5,3 L19,3 C20.6568542,3 22,4.34314575 22,6 L22,15 C22,15.0032706 21.9999948,15.0065399 21.9999843,15.009808 L22.0249378,15 L22.0249378,19.5857864 C22.0249378,20.1380712 21.5772226,20.5857864 21.0249378,20.5857864 C20.7597213,20.5857864 20.5053674,20.4804296 20.317831,20.2928932 L18.0249378,18 L12.9835977,18 C12.7263047,14.0909841 9.47412135,11 5.5,11 C4.23590829,11 3.04485894,11.3127315 2,11.8650466 Z M6,7 C5.44771525,7 5,7.44771525 5,8 C5,8.55228475 5.44771525,9 6,9 L15,9 C15.5522847,9 16,8.55228475 16,8 C16,7.44771525 15.5522847,7 15,7 L6,7 Z" fill="#000000" />
                                                                    </g>
                                                                </svg>
                                                                {/*end::Svg Icon*/}
                                                            </span>
                                                        </span>
                                                        <span className="nav-text font-weight-bold">Profile</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item mr-3">
                                                    <a onClick={() => {
                                                        this.setFormProfile(false)
                                                    }} className={`nav-link ${!this.state.isOpenFormProfile ? 'active' : ''}`}
                                                        data-toggle="tab" >
                                                        <span className="nav-icon mr-2">
                                                            <span className="svg-icon mr-3">
                                                                {/*begin::Svg Icon | path:/metronic/theme/html/demo3/dist/assets/media/svg/icons/Communication/Chat-check.svg*/}
                                                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                                                    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                                                        <rect x={0} y={0} width={24} height={24} />
                                                                        <path d="M4.875,20.75 C4.63541667,20.75 4.39583333,20.6541667 4.20416667,20.4625 L2.2875,18.5458333 C1.90416667,18.1625 1.90416667,17.5875 2.2875,17.2041667 C2.67083333,16.8208333 3.29375,16.8208333 3.62916667,17.2041667 L4.875,18.45 L8.0375,15.2875 C8.42083333,14.9041667 8.99583333,14.9041667 9.37916667,15.2875 C9.7625,15.6708333 9.7625,16.2458333 9.37916667,16.6291667 L5.54583333,20.4625 C5.35416667,20.6541667 5.11458333,20.75 4.875,20.75 Z" fill="#000000" fillRule="nonzero" opacity="0.3" />
                                                                        <path d="M2,11.8650466 L2,6 C2,4.34314575 3.34314575,3 5,3 L19,3 C20.6568542,3 22,4.34314575 22,6 L22,15 C22,15.0032706 21.9999948,15.0065399 21.9999843,15.009808 L22.0249378,15 L22.0249378,19.5857864 C22.0249378,20.1380712 21.5772226,20.5857864 21.0249378,20.5857864 C20.7597213,20.5857864 20.5053674,20.4804296 20.317831,20.2928932 L18.0249378,18 L12.9835977,18 C12.7263047,14.0909841 9.47412135,11 5.5,11 C4.23590829,11 3.04485894,11.3127315 2,11.8650466 Z M6,7 C5.44771525,7 5,7.44771525 5,8 C5,8.55228475 5.44771525,9 6,9 L15,9 C15.5522847,9 16,8.55228475 16,8 C16,7.44771525 15.5522847,7 15,7 L6,7 Z" fill="#000000" />
                                                                    </g>
                                                                </svg>
                                                                {/*end::Svg Icon*/}
                                                            </span>
                                                        </span>
                                                        <span className="nav-text font-weight-bold">Candidates</span>
                                                    </a>
                                                </li>
                                            </ul>

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
