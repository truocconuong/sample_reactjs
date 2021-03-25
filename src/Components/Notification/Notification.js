//copy code from client component
import React, { Component } from "react";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./style.css";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import ClientDetail from "../Modal/Client/DetailClient.js";
import CreateClient from "../Modal/Client/CreateClient";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import moment from "moment";
import Button from "@atlaskit/button/standard-button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import Select from "react-select";
import { urlPortal } from "../../utils/config";
import _ from "lodash";

const api = new Network();

const type = [
  { label: "Assign Card", value: "assignCard" },
  { label: "Assign Job", value: "assignJob" },
  { label: "Job Over Time", value: "jobOverTime" },
  { label: "Assign Task", value: "assignTask" },
];

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      pageNumber: 1,
      pageSize: 10,
      realSize: 0,
      totalRow: 0,
      start: 0,
      idDelete: null,
      data: [],
      clientInfor: {},
      isLoading: false,
      isOpenClientDetail: false,
      isOpenFormCreateClient: false,
      client: null,
      isOpen: false,
      setIsOpen: false,
      classToggleDetail: new Array(10).fill("show_mb"),
      classArr: new Array(10).fill("fa fa-caret-down"),
      selectUser: "",
      selectType: "",
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataClient = this.getDataClient.bind(this);
    this.toggleClientDetail = this.toggleClientDetail.bind(this);
    this.getClientDetail = this.getClientDetail.bind(this);
    this.toggleFormCreateClient = this.toggleFormCreateClient.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  showDetailNotification = (id, type) => {
    let url = '';
    if (type === "jobOverTime" || type === "assignJob") {
      url += `/job-detail/${id}`;
    } else if (type === "assignCard") {
      url += `/board?cardId=${id}`;
    }
    window.open(url, "_blank");
  };

  getUserSelect = (user) => {
    let selectUser = "";

    if (user !== null) {
      selectUser = user.value;
    }
    this.setState(
      {
        selectUser,
        pageNumber: 1,
      },
      () => {
        this.getDataClient();
      }
    );
  };

  getTypeSelect = (type) => {
    let selectType = "";
    if (type !== null) {
      selectType = type.value;
    }
    this.setState(
      {
        selectType,
        pageNumber: 1,
      },
      () => {
        this.getDataClient();
      }
    );
  };

  showDetail(index) {
    let currentClass = this.state.classToggleDetail;
    let currentClassArr = this.state.classArr;
    if (this.state.classToggleDetail[index] === "hide_mb") {
      currentClass[index] = "show_mb";
      currentClassArr[index] = "fa fa-caret-down";
      this.setState({
        classToggleDetail: currentClass,
        classArr: currentClassArr,
      });
    } else {
      currentClassArr[index] = "fa fa-caret-right";
      currentClass[index] = "hide_mb";
      this.setState({
        classToggleDetail: currentClass,
        classArr: currentClassArr,
      });
    }
  }
  close = () => {
    this.setState({
      isOpen: false,
    });
  };
  open = (id) => {
    this.setState({
      idDelete: id,
      isOpen: true,
    });
  };
  toggleClientDetail(isShow) {
    this.setState({
      isOpenClientDetail: isShow,
    });
  }
  toggleFormCreateClient(isShow) {
    this.setState({
      isOpenFormCreateClient: isShow,
    });
  }
  async getClientDetail(id) {
    try {
      let self = this;
      const response = await api.get(`/api/client/${id}`);
      if (response) {
        this.setState(
          {
            clientInfor: response.data.client,
          },
          () => {
            self.toggleClientDetail(true);
          }
        );
      }
    } catch (error) {
      console.log("err while get candidate detail: ", error);
    }
  }

  getUser = async () => {
    try {
      const response = await api.post(`/api/admin/user/list`);
      let listUser = [];
      _.map(response.data.user, (user) => {
        if (user.Role.name === "Leader" || user.Role.name === "Member") {
          const dataUser = {
            value: user.id,
            label: user.name,
          };
          listUser.push(dataUser);
        }
        return user;
      });

      this.setState({
        user: listUser,
      });
    } catch (error) {
      console.log("user", error);
    }
  };

  async getDataClient() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
        classToggleDetail: new Array(10).fill("show_mb"),
        classArr: new Array(10).fill("fa fa-caret-down"),
      });
      let start = this.state.pageSize * (this.state.pageNumber - 1) + 1;
      let url = `/api/v1/admin/all-notification?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`;
      if (this.state.selectUser !== "") {
        url += `&userId=${this.state.selectUser}`;
      }
      if (this.state.selectType !== "") {
        url += `&type=${this.state.selectType}`;
      }
      const response = await api.get(url);

      if (response) {
        // console.log(response.data.list);

        self.setState({
          // isLoading: false,
          data: response.data.list,
          totalRow: response.data.total,
          start: start,
          realSize: response.data.list.length,
        });

        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 1200);
      } else {
        this.setState({
          isLoading: false,
        });
      }
    } catch (err) {
      this.setState({
        isLoading: false,
      });
      console.log("Err in list job: ", err.response);
    }
  }
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
    });
    this.getDataClient();
  }
  componentDidMount() {
    this.getDataClient();
    this.getUser();
  }

  confirmDelete = (id) => {
    this.open(id);
  };
  deleteClient = async () => {
    const response = await api.delete(
      `/api/admin/client/${this.state.idDelete}`
    );
    if (response) {
      this.getDataClient();
      this.close();
    }
  };
  render() {
    const data = this.state.data;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <ModalTransition>
          {this.state.isOpen && (
            <Modal
              actions={[
                { text: "Delete", onClick: this.deleteClient },
                { text: "Cancel", onClick: this.close },
              ]}
              onClose={this.close}
              heading="Confirm delete this client"
              appearance="danger"
            >
              <p>Are you sure you want to delete this client?</p>
            </Modal>
          )}
        </ModalTransition>
        <ClientDetail
          data={this.state.clientInfor}
          show={this.state.isOpenClientDetail}
          onHide={this.toggleClientDetail.bind(this, false)}
        />

        <CreateClient
          loadData={this.getDataClient}
          show={this.state.isOpenFormCreateClient}
          onHide={this.toggleFormCreateClient.bind(this, false)}
        />
        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}

          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-dark">
                        Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <div className="text-dark">List notification</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">List notification</h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="select-notification">
                      <div className="choose-name">
                        <Select
                          options={this.state.user}
                          placeholder="Choose name..."
                          onChange={this.getUserSelect}
                          isClearable
                        />
                      </div>
                      <div className="choose-type">
                        <Select
                          options={type}
                          placeholder="Choose type..."
                          onChange={this.getTypeSelect}
                          isClearable
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
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
                          <th className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                            <span></span>
                          </th>
                          <th
                            data-field="OrderID"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "100px" }}>Name</span>
                          </th>
                          <th
                            data-field="Status"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "170px" }}>Message</span>
                          </th>

                          <th
                            data-field="Type"
                            className="datatable-cell datatable-cell-sort"
                          >
                            <span style={{ width: "100px" }}>Type</span>
                          </th>

                          <th
                            data-field="Status"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "137px" }}>Time</span>
                          </th>

                          <th
                            data-field="Actions"
                            data-autohide-disabled="false"
                            className="datatable-cell datatable-cell-sort hide_mb"
                          >
                            <span style={{ width: "125px" }}>View Detail</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="datatable-body" style={{}}>
                        {data.map((client, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr
                                data-row={1}
                                className="datatable-row datatable-row-even"
                                style={{ left: "0px" }}
                              >
                                <td className="datatable-cell datatable-toggle-detail hide_desktop show_mb">
                                  <span
                                    className="datatable-toggle-detail"
                                    onClick={this.showDetail.bind(this, index)}
                                  >
                                    <i
                                      className={this.state.classArr[index]}
                                    ></i>
                                  </span>
                                </td>
                                <td
                                  data-field="OrderID"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                >
                                  <span
                                    onClick={() =>
                                      this.showDetailNotification(
                                        client.content.id,
                                        client.type
                                      )
                                    }
                                    className="text-hover-primary"
                                    style={{
                                      width: "100px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {client.User ? client.User.name : ""}
                                  </span>
                                </td>

                                <td
                                  data-field="Type"
                                  data-autohide-disabled="false"
                                  aria-label={2}
                                  className="datatable-cell hide_mb"
                                >
                                  <span
                                    className="text-hover-primary"
                                    style={{
                                      width: "170px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      this.showDetailNotification(
                                        client.content.id,
                                        client.type
                                      )
                                    }
                                  >
                                    {client.content.message}
                                  </span>
                                </td>
                                <td
                                  data-field="Type"
                                  aria-label="63868-257"
                                  className="datatable-cell"
                                >
                                  <span
                                    onClick={() =>
                                      this.showDetailNotification(
                                        client.content.id,
                                        client.type
                                      )
                                    }
                                    className="text-hover-primary"
                                    style={{
                                      width: "100px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {client.type}
                                  </span>
                                </td>

                                <td
                                  data-field="ShipDate"
                                  aria-label="9/3/2017"
                                  className="datatable-cell hide_mb"
                                >
                                  <span style={{ width: "137px" }}>
                                    {moment(client.createdAt).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </span>
                                </td>

                                <td
                                  data-field="Actions"
                                  data-autohide-disabled="false"
                                  aria-label="null"
                                  className="datatable-cell hide_mb"
                                >
                                  <span
                                    style={{
                                      overflow: "visible",
                                      position: "relative",
                                      width: "125px",
                                    }}
                                  >
                                    <div
                                      //   href="#"
                                      className="btn btn-sm btn-clean btn-icon mr-2"
                                      onClick={() =>
                                        this.showDetailNotification(
                                          client.content.id,
                                          client.type
                                        )
                                      }
                                    >
                                      <i class="fa far fa-eye"></i>
                                    </div>
                                  </span>
                                </td>
                              </tr>
                              <tr
                                className={`datatable-row-detail hide_desktop ${this.state.classToggleDetail[index]}`}
                              >
                                <td
                                  style={{ padding: "0", width: "100%" }}
                                  className="datatable-detail"
                                  colSpan="9"
                                >
                                  <table style={{ width: "100%" }}>
                                    <tbody>
                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Website</span>
                                        </td>
                                        <td
                                          data-field="OrderID"
                                          aria-label="63868-257"
                                          className="datatable-cell"
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            {client.website ? (
                                              <span
                                                style={{
                                                  width: "130px",
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                  overflow: "hidden",
                                                }}
                                                className="label font-weight-bold label-lg  label-light-success label-inline"
                                              >
                                                <a
                                                  style={{
                                                    width: "130px",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                  }}
                                                  title={client.website}
                                                  href={client.website}
                                                >
                                                  {client.website}
                                                </a>
                                              </span>
                                            ) : null}
                                          </span>
                                        </td>
                                      </tr>

                                      <tr className="datatable-row">
                                        <td className="datatable-cell">
                                          <span>Actions</span>
                                        </td>
                                        <td
                                          className="datatable-cell-sorted datatable-cell"
                                          data-field="Status"
                                          aria-label={1}
                                          style={{}}
                                        >
                                          <span style={{ width: 110 }}>
                                            <div
                                              //   href="#"
                                              className="btn btn-sm btn-clean btn-icon mr-2"
                                              onClick={this.getClientDetail.bind(
                                                this,
                                                client.id
                                              )}
                                            >
                                              <span className="svg-icon svg-icon-md">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  width="24px"
                                                  height="24px"
                                                  viewBox="0 0 24 24"
                                                  version="1.1"
                                                >
                                                  <g
                                                    stroke="none"
                                                    strokeWidth={1}
                                                    fill="none"
                                                    fillRule="evenodd"
                                                  >
                                                    <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                    />
                                                    <path
                                                      d="M10.9,2 C11.4522847,2 11.9,2.44771525 11.9,3 C11.9,3.55228475 11.4522847,4 10.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,16 C20,15.4477153 20.4477153,15 21,15 C21.5522847,15 22,15.4477153 22,16 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L10.9,2 Z"
                                                      fill="#000000"
                                                      fillRule="nonzero"
                                                      opacity="0.3"
                                                    />
                                                    <path
                                                      d="M24.0690576,13.8973499 C24.0690576,13.1346331 24.2324969,10.1246259 21.8580869,7.73659596 C20.2600137,6.12944276 17.8683518,5.85068794 15.0081639,5.72356847 L15.0081639,1.83791555 C15.0081639,1.42370199 14.6723775,1.08791555 14.2581639,1.08791555 C14.0718537,1.08791555 13.892213,1.15726043 13.7542266,1.28244533 L7.24606818,7.18681951 C6.93929045,7.46513642 6.9162184,7.93944934 7.1945353,8.24622707 C7.20914339,8.26232899 7.22444472,8.27778811 7.24039592,8.29256062 L13.7485543,14.3198102 C14.0524605,14.6012598 14.5269852,14.5830551 14.8084348,14.2791489 C14.9368329,14.140506 15.0081639,13.9585047 15.0081639,13.7695393 L15.0081639,9.90761477 C16.8241562,9.95755456 18.1177196,10.0730665 19.2929978,10.4469645 C20.9778605,10.9829796 22.2816185,12.4994368 23.2042718,14.996336 L23.2043032,14.9963244 C23.313119,15.2908036 23.5938372,15.4863432 23.9077781,15.4863432 L24.0735976,15.4863432 C24.0735976,15.0278051 24.0690576,14.3014082 24.0690576,13.8973499 Z"
                                                      fill="#000000"
                                                      fillRule="nonzero"
                                                      transform="translate(15.536799, 8.287129) scale(-1, 1) translate(-15.536799, -8.287129) "
                                                    />
                                                  </g>
                                                </svg>
                                              </span>
                                            </div>

                                            <Link
                                              to={`/edit-client/${client.id}`}
                                              className="btn btn-sm btn-clean btn-icon mr-2"
                                              title="Edit details"
                                            >
                                              <span className="svg-icon svg-icon-md">
                                                <i className="la la-edit" />
                                              </span>
                                            </Link>
                                            <span
                                              onClick={() => {
                                                this.confirmDelete(client.id);
                                              }}
                                              className="btn btn-sm btn-clean btn-icon"
                                              title="Delete"
                                            >
                                              <span className="svg-icon svg-icon-md">
                                                <i className="la la-trash" />
                                              </span>
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="datatable-pager datatable-paging-loaded fl_end">
                      <Pagination
                        defaultPageSize={this.state.pageSize}
                        current={this.state.pageNumber}
                        hideOnSinglePage={true}
                        showTitle={false}
                        onChange={this.handlePagination}
                        total={this.state.totalRow}
                        showLessItems={true}
                      />

                      <div className="datatable-pager-info my-2 mb-sm-0">
                        <span className="datatable-pager-detail">
                          Showing {this.state.start} -{" "}
                          {this.state.start + this.state.realSize - 1} of{" "}
                          {this.state.totalRow}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
  };
};

export default connect(mapStateToProps)(Notification);
