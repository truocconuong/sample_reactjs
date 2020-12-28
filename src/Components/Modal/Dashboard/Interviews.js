import React, { Component } from "react";
import moment from "moment";
import Modal, { ModalTransition, ScrollBehavior } from "@atlaskit/modal-dialog";

class Interviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
    };
    this.renderHeaderCustom = this.renderHeaderCustom.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderContainer = this.renderContainer.bind(this);
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

  renderHeaderCustom(data) {
    return (
      <div className="header_modal_cs">
        <h4 style={{ marginBottom: "0" }}>{data.title}</h4>
      </div>
    );
  }
  renderContainer(props) {
    return <div className="wrap_container_list">{props.children}</div>;
  }
  componentDidMount() {}
  render() {
    let self = this;
    const data = this.props.data;
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Header: this.renderHeaderCustom.bind(self, {
                title: "List Interviews",
              }),
              Container: this.renderContainer,
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            width={"x-large"}
          >
            <div className="row">
              <div className="col-lg-12 col-xxl-12">
                <div className="card card-custom card-stretch gutter-b">
                  <div className="card-body pt-0">
                    <div
                      className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                      id="kt_datatable"
                      style={{ position: "static", zoom: 1 }}
                    >
                      <table
                        className="datatable-table"
                        style={{ display: "block" }}
                      >
                        <thead className="datatable-head">
                          <tr className="datatable-row" style={{ left: "0px" }}>
                            <th
                              data-field="OrderID"
                              className="datatable-cell datatable-cell-sort"
                            >
                              <span style={{ width: "220px" }}>Name</span>
                            </th>

                            <th
                              data-field="ShipDate"
                              className="datatable-cell datatable-cell-sort hide_mb"
                            >
                              <span style={{ width: "130px" }}>Link Zoom</span>
                            </th>
                            <th
                              data-field="CompanyName"
                              className="datatable-cell datatable-cell-sort hide_mb"
                            >
                              <span style={{ width: "120px" }}>Location</span>
                            </th>
                            <th className="datatable-cell datatable-cell-sort hide_mb">
                              <span style={{ width: "100px" }}>
                                {" "}
                                Time Start
                              </span>
                            </th>
                            <th
                              data-field="Status"
                              className="datatable-cell datatable-cell-sort hide_mb"
                            >
                              <span style={{ width: "100px" }}> Time End</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="datatable-body" style={{}}>
                          {data.map((interview, index) => {
                            return (
                              <React.Fragment key={index}>
                                <tr
                                  data-row={1}
                                  className="datatable-row datatable-row-even"
                                  style={{ left: "0px" }}
                                >
                                  <td
                                    data-field="OrderID"
                                    aria-label="63868-257"
                                    className="datatable-cell"
                                  >
                                    <div
                                      className="text-hover-primary"
                                      style={{
                                        width: "220px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <div
                                        onClick={this.props.toggleDetailInterview.bind(
                                          this,
                                          true,
                                          interview
                                        )}
                                      >
                                        <div className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                          {interview.CandidateJob.Candidate.name}
                                        </div>
                                        <span className="text-muted font-weight-bold d-block cus_text_mute">
                                          {interview.jobName}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td
                                    data-field="ShipDate"
                                    aria-label="9/3/2017"
                                    className="datatable-cell hide_mb"
                                  >
                                    <span
                                      style={{ width: "130px" }}
                                      className="text-muted font-weight-bold cus_text_mute"
                                    >
                                      {interview.linkZoom}
                                    </span>
                                  </td>
                                  <td
                                    data-field="CompanyName"
                                    aria-label="Stanton, Friesen and Grant"
                                    className="datatable-cell hide_mb"
                                  >
                                    <span
                                      style={{ width: "120px" }}
                                      className="text-muted font-weight-bold cus_text_mute"
                                    >
                                      {interview.CandidateJob.Job.Location.name}
                                    </span>
                                  </td>
                                  <td
                                    data-field="Status"
                                    aria-label={1}
                                    className="datatable-cell hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      <span className="text-muted font-weight-bold cus_text_mute">
                                        {moment(interview.timeInterview).format(
                                          "hh:mm a DD/MM/YYYY"
                                        )}
                                      </span>
                                    </span>
                                  </td>
                                  <td
                                    data-field="Status"
                                    aria-label={1}
                                    className="datatable-cell hide_mb"
                                  >
                                    <span style={{ width: "100px" }}>
                                      <span className="text-muted font-weight-bold cus_text_mute">
                                        {moment(
                                          interview.timeInterviewEnd
                                        ).format("hh:mm a DD/MM/YYYY")}
                                      </span>
                                    </span>
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}

export default Interviews;
