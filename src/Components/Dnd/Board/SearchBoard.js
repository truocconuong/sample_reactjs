import React, { Component } from 'react';
import { Button as ButtonPop, Popover as PopoverPop, PopoverHeader, PopoverBody } from 'reactstrap';
class SearchBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFormSeach: false
        }
    }
    toggleFormSearch = () => {
        this.setState({
            showFormSeach: !this.state.showFormSeach
        })
    }
    render() {
        return (
            <div className="search-board">
                <PopoverPop popperClassName="popover-modal-card pop-search-board" trigger="legacy" placement="bottom" isOpen={this.state.showFormSeach} target={`Popover-searchBoard`} toggle={this.toggleFormSearch}>
                    <PopoverBody>
                        <ul className="navi navi-hover navi-selected-ul">
                            <li className="navi-header font-weight-bold py-4">
                                <span className="font-size-lg">Search</span>
                                <i className="flaticon2-information icon-md text-muted" data-toggle="tooltip" data-placement="right" title="Click to learn more..." />
                            </li>
                            <li className="navi-separator mb-3 opacity-70" />
                            <div>Chu huu manh</div>
                        </ul>
                    </PopoverBody>
                </PopoverPop>
                <div className="input-icon" id="Popover-searchBoard">
                    <input
                        onClick={this.toggleFormSearch}
                        name="title"
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        // value={this.state.title}
                        autocomplete="off"
                        // onChange={this.onChangeSearch}
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