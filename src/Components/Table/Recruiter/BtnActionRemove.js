import React, { Component } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
class BtnActionRemove extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenPopover: false
        }
    }
    toggleIsOpenPopover = () => {
        this.setState({
            isOpenPopover: !this.state.isOpenPopover
        })
    }
    render() {
        const { role, id } = this.props;
        return (
            <>
                <Popover placement="right" isOpen={this.state.isOpenPopover} target={`Popover-Remove-${id}`} toggle={this.toggleIsOpenPopover}>
                    <PopoverHeader className="text-center">Do you want remove?</PopoverHeader>
                    <PopoverBody>
                        <div className="remove-skill-footer">
                            <button onClick={() => {
                                this.toggleIsOpenPopover();
                                this.props.actionDelete(id);
                            }} type="reset" className="btn btn-primary btn-remove-skill">Yes</button>
                            <button onClick={
                                () => {
                                    this.toggleIsOpenPopover();
                                }
                            } type="reset" className="btn btn-secondary btn-remove-skill">No</button></div>
                    </PopoverBody>
                </Popover>
                <a
                    id={`Popover-Remove-${id}`}
                    className="btn btn-sm btn-clean btn-icon"
                    title="Delete"
                    style={role == "Member" ? { display: "none" } : null}
                >
                    <span className="svg-icon svg-icon-md">
                        <i className="la la-trash"></i>
                    </span>
                </a>
            </>
        );
    }
}

export default BtnActionRemove;