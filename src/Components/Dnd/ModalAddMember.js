import React, { Component } from 'react';
import Select from 'react-select'
import _ from 'lodash'
class ModalAddMember extends Component {
    constructor() {
        super();
        this.state = {
            userSelected: {},
            showListBoard: true,
        }
    }

    toggleShowListBoard = () => {
        this.setState({
            showListBoard: !this.state.showListBoard,
        })
    }
    handleOnChangeUser = (e) => {
        this.setState({
            showListBoard: false,
            userSelected: e
        })
    }

    showUserAnSelected = (usersTeam, userCard) => {
        const users = _.cloneDeep(usersTeam);
        for (const data of userCard) {
            _.remove(users, user => user.value === data.id)
        }
        return users
    }

    checkUserIsSelected = (users, user_id) => {
        let isSelected = false;
        isSelected = _.some(users, { value: user_id })
        return isSelected
    }

    addMemberToCard(card_id) {
        this.toggleShowListBoard();
        const { userSelected } = this.state
        const data = {
            card_id,
            content: {
                id: userSelected.value,
                email: userSelected.label,
                name: userSelected.name
            }
        }
        this.props.addMemberToCard(data)
        // this.props.addMemberToCard(data)

    }

    render() {
        const usersTeam = this.props.usersTeam;
        const users = this.props.users

        const elmResult = (
            <div className="board">
                <div className="board-member">
                    <h4>Board members</h4>
                </div>
                <div className="result-members">
                    <ul className="pop-over-member-list checkable u-clearfix js-mem-list collapsed">
                        {
                            usersTeam.map((user, index) => {
                                return (
                                    <li key={index} className="name js-select-member" title={`${user.email}`}>
                                        <span className="member js-member">
                                            {this.checkUserIsSelected(users, user.id) ? <span className="icon-check">
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                            </span> : ''}
                                            <img className="member-avatar" src="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_960_720.png" alt="" />
                                        </span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
        const elmDetail = (
            <div className="save-member">
                <button onClick={() => this.addMemberToCard(this.props.card_id)} type="button" class="btn btn-primary">Save</button>
            </div>
        )
        return (
            <div className="fade show">
                <div className="popover show popover-modal-card bs-popover-auto" x-placement="top" style={{ position: 'absolute', willChange: 'transform', top: '420px', left: '-122px', transform: 'translate3d(134px, 265px, 0px)' }}><div className="popover-inner" role="tooltip"><h3 className="popover-header" style={{ textAlign: 'center' }}>Create member</h3>
                    <div className="popover-body">
                        <div className="add-member">
                            <Select
                                name="option"
                                options={this.showUserAnSelected(users, usersTeam)}
                                value={this.state.userSelected}
                                placeholder="Select User"
                                onChange={this.handleOnChangeUser}
                            />
                        </div>
                        {this.state.showListBoard ? elmResult : elmDetail}
                    </div>
                </div>
                </div>
                <span className="arrow" style={{ left: '39px' }} />
            </div>
        );
    }
}

export default ModalAddMember;