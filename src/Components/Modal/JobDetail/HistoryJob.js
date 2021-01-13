import React, { Component } from "react";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";
import "./style.css";
import moment from "moment";
import { defaultAva, domainServer } from "../../../utils/config";
import ReactHtmlParser from "react-html-parser";


class HistoryJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderRowActivity = this.renderRowActivity.bind(this);
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  renderHeaderCustom() {
    return (
      <div className="header_modal_cs">
        <div className="wrap_left_icon_act">
          <i className="flaticon2-calendar-1 custom_icon_history"></i>
          <div className="act_history">Activity</div>
        </div>
      </div>
    );
  }
  renderRowActivity(e, index) {
    console.log(e.content)
    if (e.type == "update_job") {
      let content = JSON.parse(e.content);
      console.log(content)
      return (
        <div className="row_history" key={index}>
          <div className="symbol symbol-50 symbol-light ">
            <span className="symbol-label symbol-label-cs cs_ava_history">
              <img
                src={
                  e.User.linkAvatar
                    ? domainServer + "/" + e.User.linkAvatar
                    : defaultAva
                }
                className="h-100 align-self-end"
                alt=""
              />
            </span>
          </div>
          <div className="wrap_left_content_history">
            <div className="conten_history">
              <span className="name_history">
                {e.User.name} 
              </span>
              {` has update this job:`}
             
            </div>
            <ul>
              {content.map((e, i) => {
                return (
                  <li className="cs_update_history" key={i}>
                    <span className="key_history">{`${e.path}: `}</span>
                    {ReactHtmlParser(e.lhs)} <span className="change_to">change to</span> {ReactHtmlParser(e.rhs)} 
                    {/* {e.lhs} <span className="change_to">change to</span>  {e.rhs} */}
                    {/* {`${e.lhs} => ${e.rhs}`} */}
                  </li>
                );
              })}
            </ul>
            <div className="time_history">
              {moment(e.createdAt).format("hh:mma DD/MM/YYYY")}
            </div>
          </div>
        </div>

      );
    } else {
      return (
        <div className="row_history" key={index}>
          <div className="symbol symbol-50 symbol-light ">
            <span className="symbol-label symbol-label-cs cs_ava_history">
              <img
                src={
                  e.User.linkAvatar
                    ? domainServer + "/" + e.User.linkAvatar
                    : defaultAva
                }
                className="h-100 align-self-end"
                alt=""
              />
            </span>
          </div>
          <div className="wrap_left_content_history">
            <div className="conten_history">
              <span className="name_history"> {e.User.name} </span>
              {`${e.content}`}
            </div>
            <div className="time_history">
              {moment(e.createdAt).format("hh:mma DD/MM/YYYY")}
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    let self = this;
    const props = this.props;
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self),
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            height={525}
            width={550}
          >
            <div>
              {this.props.dataHistory.map((e, index) => {
                 return this.renderRowActivity(e, index);
               
              })}
            </div>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

export default HistoryJob;
