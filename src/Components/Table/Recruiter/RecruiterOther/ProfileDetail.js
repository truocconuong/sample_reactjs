import React, { Component } from 'react';
import _ from 'lodash'
import { defaultCmnd, domainServer } from "../../../../utils/config.js";
class ProfileDetail extends Component {
    render() {
        const { profile } = this.props;
        return (
            <>
                {
                    !_.isEmpty(profile) ? (
                        < div className="tab-pane active" id="kt_apps_projects_view_tab_2" role="tabpanel">
                            <form className="form">
                                <div className="row">
                                    <div className="col-lg-9 col-xl-6 offset-xl-3">
                                        <h3 className="font-size-h6 mb-5">Profile Info:</h3>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">Name</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input value={profile.name || ''} disabled className="form-control form-control-lg form-control-solid" type="text" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">Email</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <input value={profile.email || ''} disabled className="form-control form-control-lg form-control-solid" type="text" />
                                    </div>
                                </div>
                                <div className="separator separator-dashed my-10" />
                                {/*begin::Heading*/}
                                <div className="row">
                                    <div className="col-lg-9 col-xl-6 offset-xl-3">
                                        <h3 className="font-size-h6 mb-5">Bank account:</h3>
                                    </div>
                                </div>
                                {/*end::Heading*/}
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">Full Name</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <div className="input-group input-group-lg input-group-solid">
                                            <input value={profile.bank.name || ''} disabled type="text" className="form-control form-control-lg form-control-solid" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">Bank Number</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <div className="input-group input-group-lg input-group-solid">
                                            <input value={profile.bank.bankNumber || ''} disabled type="text" className="form-control form-control-lg form-control-solid" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">Bank Name</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <div className="input-group input-group-lg input-group-solid">
                                            <input value={profile.bank.bankName || ''} disabled type="text" className="form-control form-control-lg form-control-solid" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-xl-3 col-lg-3 col-form-label text-right">People ID</label>
                                    <div className="col-lg-9 col-xl-6">
                                        <div className="cmnd">
                                            <div className="image-cmnd">
                                                <img src={profile.bank.urlFrontImageIdCard ?`${domainServer}/${profile.bank.urlFrontImageIdCard}` : defaultCmnd}></img>
                                            </div>
                                            <div className="image-cmnd">
                                                <img src={profile.bank.urlBehindImageIdCard ? `${domainServer}/${profile.bank.urlBehindImageIdCard}` : defaultCmnd}></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : ''
                }
            </>
        );
    }
}

export default ProfileDetail;