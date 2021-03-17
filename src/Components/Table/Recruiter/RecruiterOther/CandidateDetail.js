import React, { Component } from 'react';
import HistoryBonusCandidate from './HistoryBonusCandidate';
import _ from 'lodash'
import moment from 'moment'
class CandidateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFormHistoryMoney: false,
            historyBonus: []
        }
    }

    toggleFormHistoryMoney = () => {
        this.setState({
            showFormHistoryMoney: !this.state.showFormHistoryMoney
        }, () => {
            if (!this.state.showFormHistoryMoney) {
                this.setState({
                    historyBonus: []
                })
            }
        })
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

    showFormHistoryMoney = (historyBonus) => {
        this.setState({
            historyBonus: historyBonus,
            showFormHistoryMoney: true
        })
    }
    render() {
        const { profile } = this.props;
        const { candidateJobs } = profile;
        return (
            <>
                {!_.isEmpty(profile) ? (
                    <>
                        <HistoryBonusCandidate
                            show={this.state.showFormHistoryMoney}
                            onHide={this.toggleFormHistoryMoney}
                            data={this.state.historyBonus}
                        />
                        <div className="table-responsive">
                            <table className="table table-head-custom table-vertical-center" id="kt_advance_table_widget_4">
                                <thead>
                                    <tr className="text-left">
                                        <th style={{ minWidth: '110px' }}>Name</th>
                                        <th style={{ minWidth: '120px' }}>Status</th>
                                        <th style={{ minWidth: '120px' }}>Bonus</th>
                                        <th style={{ minWidth: '120px' }}>Refer Date</th>
                                        <th className="pr-0 text-right" style={{ minWidth: '160px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        _.map(candidateJobs, canJob => (
                                            <>
                                                <tr>
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{canJob.Candidate.name}</span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-light btn-show-status text-white" style={{ background: canJob.Lane ? canJob.Lane.background : null }}>{canJob.Lane ? canJob.Lane.nameColumn : ""}</button>
                                                    </td>
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{this.convertMoneyVND(canJob.CandidateJobBonus)}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{moment(canJob.createdAt).format('DD/MM/YYYY')}</span>
                                                    </td>
                                                    <td className="pr-0 text-right">
                                                        <a onClick={() => {
                                                            this.showFormHistoryMoney(canJob.CandidateJobBonus);
                                                        }} href="#" className="btn btn-icon btn-light btn-hover-primary btn-sm">
                                                            <span className="svg-icon svg-icon-md svg-icon-primary">
                                                                {/*begin::Svg Icon | path:/metronic/theme/html/demo3/dist/assets/media/svg/icons/General/Settings-1.svg*/}
                                                                <i className="far fa-money-bill-alt"></i>
                                                                {/*end::Svg Icon*/}
                                                            </span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : ''}
            </>
        );
    }
}

export default CandidateDetail;