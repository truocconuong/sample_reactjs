import React, { Component } from "react";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";
import "../style.css";
import { defaultAva, domainServer } from "../../../utils/config.js";

class DetailTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      errors: {},
      isLoading: false,
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.submitTask = this.submitTask.bind(this);
    this.openEditTask = this.openEditTask.bind(this);
  }
  async submitTask() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
      });
      const response = await this.props.submitTask();
      if (response) {
        console.log(response);
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
          self.props.onHide();
        }, 500);
      } else {
        self.setState({
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("submit task err: ", error);
      this.setState({
        isLoading: false,
      });
    }
  }
  openEditTask() {
    this.props.onHide();
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
          <button
            className="btn btn-primary mr-2"
            onClick={() => self.props.openEditTask(true, self.props.data)}
          >
            Edit
          </button>
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  renderHeaderCustom(data) {
    return (
      <div className="header_modal_cs header_modal_cs_task">
        <h4 style={{ marginBottom: "0", textAlign: "center" }}>
          {data.titleJob}
        </h4>
        
      </div>
    );
  }

  render() {
    let self = this;
    const data = this.props.data;
    // console.log(data);
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                titleJob:
                  self.props.data.startDate + " - " + self.props.data.endDate,
              }),
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            height={"auto"}
            width={436}
          >
            <div className="card-body card-body-cs-detail-task">
              <div className="">
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-50 symbol-light mr-5">
                    <span className="symbol-label symbol-label-cs">
                      <img
                        src={
                          data.user.linkAvatar
                            ? domainServer + "/" + data.user.linkAvatar
                            : defaultAva
                        }
                        className="h-100 align-self-center"
                        alt=""
                      />
                    </span>
                  </div>
                  <div className="d-flex flex-column flex-grow-1">
                    <div className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">
                      {data.user.name}
                    </div>
                    <span className="text-muted font-weight-bold">
                      {data.user.nameTeam}
                    </span>
                  </div>
                </div>

                {data.content.map((task, index) => {
                  if (task) {
                    return (
                      <p
                        key={index}
                        className="text-dark-50 m-0 pt-3 font-weight-normal"
                      >
                        {`${task.content} (${task.percent}%)`} 
                      </p>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

export default DetailTask;
