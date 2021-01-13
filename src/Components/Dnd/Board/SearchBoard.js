import React, { Component } from 'react';
import { Button as ButtonPop, Popover as PopoverPop, PopoverHeader, PopoverBody } from 'reactstrap';
import Network from '../../../Service/Network';
import { defaultAva, domainServer } from '../../../utils/config';
const api = new Network();

class SearchBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFormSeach: false,
            search: '',
            isLoadingMember: false,
            users: []
        }
        this.timeOut = '';
    }
    toggleFormSearch = () => {
        this.setState({
            showFormSeach: !this.state.showFormSeach
        })
    }

    handleChangeInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        }, () => {
            this.debount();
        })
    }

    searchMembers = async () => {
        if (this.state.search !== '') {
            const response = await api.get(`/api/search/board/members?search=${this.state.search}`)
            if (response) {
                this.offLoadingMember()
                const users = response.data.list;
                this.setState({
                    users: users
                })
            }
        } else {
            this.toggleFormSearch();
            this.props.initDataAgain();
        }
    }
    onLoadingMember = () => {
        this.setState({
            isLoadingMember: true
        })
    }
    offLoadingMember = () => {
        this.setState({
            isLoadingMember: false
        })
    }
    debount = () => {
        this.onLoadingMember();
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
            this.searchMembers()
        }, 2000)
    }

    elmIsLoading = () => {
        return (
            <div className="loading-search text-center">
                <div className="spinner spinner-center make-spinner"></div>
            </div>
        )
    }

    setDefaultSearch = () => {
        this.setState({
            search: ''
        })
    }

    elementFormSearchUsers = () => {
        return (
            <ul className="navi navi-hover navi-selected-ul  header-users">
                <li className="navi-header font-weight-bold py-4">
                    <span className="font-size-lg">Members</span>
                </li>
                <li className="navi-separator mb-3 opacity-70" />
                {this.state.isLoadingMember ? this.elmIsLoading() : (
                    this.state.users.map((user, index) => (
                        <div onClick={() => {
                            // this.setDefaultSearch();
                            this.toggleFormSearch();
                            this.props.searchCardByUserId(user.id)
                        }} className="search-user" key={index}>
                            <div className="d-flex align-items-center">
                                <div className="symbol symbol-50 symbol-light mr-5">
                                    <span className="symbol-label symbol-label-cs">
                                        <img
                                            src={
                                                user.linkAvatar
                                                    ? domainServer + "/" + user.linkAvatar
                                                    : defaultAva
                                            }
                                            className="h-100 align-self-end"
                                            alt=""
                                        />
                                    </span>
                                </div>
                                <div className="d-flex flex-column flex-grow-1">
                                    <div
                                        style={{ cursor: "pointer" }}
                                        className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1"
                                    >
                                        {user.name}
                                    </div>
                                    <span className="text-muted font-weight-bold">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div >
                </div>
            </ul>
        )
    }

    render() {
        return (
            <div className={this.state.showFormSeach ? 'search-board-on' : 'search-board-off'}>
                <PopoverPop className="popover-container" popperClassName="popover-modal-card pop-search-board" trigger="legacy" placement="bottom" isOpen={this.state.showFormSeach} target={`Popover-searchBoard`} toggle={this.toggleFormSearch}>
                    <PopoverBody>
                        <div className="search-board-form">
                            {this.elementFormSearchUsers()}
                        </div>
                    </PopoverBody>
                </PopoverPop>
                <div onClick={this.toggleFormSearch} className="input-icon" id="Popover-searchBoard">
                    <input
                        name="search"
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={this.state.search}
                        autoComplete="off"
                        onChange={this.handleChangeInput}
                        id="kt_datatable_search_query"
                    />
                    <span>
                        <i className="flaticon2-search-1 text-muted"></i>
                    </span>
                </div>
            </div>
        );
    }
}

export default SearchBoard;