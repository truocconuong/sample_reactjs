import React, { Component, useRef } from "react";
import { Button, Modal, Overlay } from "react-bootstrap";
import { connect } from "react-redux";
import _ from "lodash";
import './../style.css'
class HistoryBonusCandidate extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    convertMoneyVND = (dataBonus) => {
        const plusMoney = _.reduce(
            dataBonus,
            (bonus, current) => {
                return (bonus += current.bonus);
            },
            0
        );
        return plusMoney.toLocaleString("it-IT");
    };

    showTextLevel = (level) => {
        let text = ''
        if (level === 1) {
            text = 'Candidate has met the first goal'
        } else if (level === 2) {
            text = 'Candidate has met the second goal'
        } else {
            text = 'Candidate has met the last goal'

        }
        return text
    }
    render() {
        return (
            <Modal size="lg" show={this.props.show} onHide={this.props.onHide} centered>
                <div className="card card-custom card-stretch">
                    {/*begin::Header*/}
                    <div className="card-header border-0">
                        <h3 className="card-title font-weight-bolder text-dark">History Bonus</h3>
                    </div>
                    {/*end::Header*/}
                    {/*begin::Body*/}
                    <div className="card-body pt-0">
                        {
                            _.map(this.props.data, bonusDetail => (
                                <>
                                    {/*begin::Item*/}
                                    <div className="d-flex align-items-center mb-9 bg-light-success rounded p-5">
                                        {/*begin::Icon*/}
                                        <span className="svg-icon svg-icon-warning mr-5">
                                            <span className="svg-icon svg-icon-lg">

                                            </span>
                                        </span>
                                        {/*end::Icon*/}
                                        {/*begin::Title*/}
                                        <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">Level {bonusDetail.level}</a>
                                            <span class="text-muted font-weight-bold">{this.showTextLevel(bonusDetail.level)}</span>
                                        </div>
                                        {/*end::Title*/}
                                        {/*begin::Lable*/}
                                        <span className="font-weight-bolder text-primary py-1 font-size-lg">+{bonusDetail.bonus}</span>
                                        {/*end::Lable*/}
                                    </div>
                                    {/*end::Item*/}
                                </>
                            ))
                        }
                        <div className="footer-history-bonus">
                            <div className="bonus-total">
                                <div className="bonus-total__title">Total:</div>
                                <h5 className="font-weight-bolder text-primary">{this.convertMoneyVND(this.props.data)}</h5>
                            </div>
                        </div>
                    </div>
                    {/*end::Body*/}
                </div>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {};
};
const mapStateToProps = (state, ownProps) => {
    return {
        role: state.auth.role,
        userId: state.auth.userId,
        linkAvatar: state.auth.linkAvatar,
        // update: (e) => ownProps.update(e),
    };
};

export default connect(mapStateToProps)(HistoryBonusCandidate);
