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
            isLoadingMember: true,
            cards: []
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

    searchCards = async () => {
        if (this.state.search !== '') {
            const response = await api.get(`/api/v1/search/card?search=${this.state.search}`)
            if (response) {
                this.offLoadingMember()
                const cards = response.data.list;
                this.setState({
                    cards: cards
                })
            }
        } else {
            this.toggleFormSearch();
            // this.props.initDataAgain();
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
            this.searchCards()
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
                    <span className="font-size-lg">Cards</span>
                </li>
                <li className="navi-separator mb-3 opacity-70" />
                {this.state.isLoadingMember ? this.elmIsLoading() : (
                    this.state.cards.map((card, index) => (
                        <div onClick={() => {
                            // this.setDefaultSearch();
                            this.toggleFormSearch();
                            this.props.searchCardDetail(card)
                        }} className="search-user" key={index}>
                            <div className="chay-ra-an-dam">
                                <div className="card card-custom gutter-b bg-diagonal bg-diagonal-light-primary">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between p-4 flex-lg-wrap flex-xl-nowrap">
                                            <div className="d-flex flex-column mr-5">
                                                <h4 style={{ fontWeight: 'bold' }}>
                                                    {card.Candidate.name} {card.Job.title}
                                                </h4>
                                            </div>
                                            <div className="ml-6 ml-lg-0 ml-xxl-6 flex-shrink-0">
                                                <a style={{ background: card.Lane.background }} target="_blank" className="btn font-weight-bolder text-uppercase btn-primary py-4 px-6">
                                                    {card.Lane.nameColumn}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
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
            <div className="search-board-on">
                <PopoverPop className="popover-container" popperClassName="popover-modal-card pop-search-board" trigger="legacy" placement="bottom" isOpen={this.state.showFormSeach} target={`Popover-searchBoard`} toggle={this.toggleFormSearch}>
                    <PopoverBody>
                        <div className="search-board-form">
                            {this.elementFormSearchUsers()}
                        </div>
                    </PopoverBody>
                </PopoverPop>
                <div className="filter-board-item board-item-search">
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
            </div>
        );
    }
}

export default SearchBoard;