import React, { useState } from "react";
import { connect } from "react-redux";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { Link } from "react-router-dom";


function ListBlog(props) {
  const [count, setCount] = useState(0);

  return (
    <div
      className={`d-flex flex-column flex-row-fluid wrapper ${props.className_wrap_broad}`}
    >
      <div className="content d-flex flex-column flex-column-fluid">
        {/* {this.state.isLoading ? <Fbloader /> : null} */}

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
                    <div className="text-dark">List Blog</div>
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
                  <h3 className="card-label">List job</h3>
                </div>
                <div className="card-toolbar">
                  <div className="dropdown dropdown-inline mr-2"></div>

                  <Link
                    to={"/add-job"}
                    className="btn btn-primary font-weight-bolder"
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
                          <rect x={0} y={0} width={24} height={24} />
                          <circle fill="#000000" cx={9} cy={15} r={6} />
                          <path
                            d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z"
                            fill="#000000"
                            opacity="0.3"
                          />
                        </g>
                      </svg>
                    </span>
                    New Blog
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row p-0 pb-5">
                 
                  
                </div>

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
                          <span style={{ width: "220px" }}>Title</span>
                        </th>

                        <th
                          data-field="ShipDate"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "137px" }}>Time</span>
                        </th>
                        <th
                          data-field="CompanyName"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "137px" }}>Link</span>
                        </th>
                       
                        <th
                          data-field="Type"
                          data-autohide-disabled="false"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "80px" }}>Status</span>
                        </th>
                        <th
                          data-field="Actions"
                          data-autohide-disabled="false"
                          className="datatable-cell datatable-cell-sort hide_mb"
                        >
                          <span style={{ width: "80px" }}>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="datatable-body" style={{}}>
                      {/* {data.map((job, index) => {
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
                                  <i className={this.state.classArr[index]}></i>
                                </span>
                              </td>
                              <td
                                data-field="OrderID"
                                aria-label="63868-257"
                                className="datatable-cell"
                              >
                                <span
                                  onClick={() => {
                                    this.props.history.push(
                                      `/job-detail/${job.id}`
                                    );
                                  }}
                                  className="text-hover-primary"
                                  style={{
                                    width: "220px",
                                    cursor: "pointer",
                                  }}
                                >
                                  {job.title}
                                </span>
                              </td>

                              <td
                                data-field="ShipDate"
                                aria-label="9/3/2017"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "137px" }}>
                                  {job.time}
                                </span>
                              </td>
                              <td
                                data-field="CompanyName"
                                aria-label="Stanton, Friesen and Grant"
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "137px" }}>
                                  {job.salary}
                                </span>
                              </td>
                              <td
                                data-field="Status"
                                aria-label={1}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "80px" }}>
                                  <span className="label font-weight-bold label-lg  label-light-success label-inline">
                                    {job.type}
                                  </span>
                                </span>
                              </td>
                              <td
                                data-field="Type"
                                data-autohide-disabled="false"
                                aria-label={2}
                                className="datatable-cell hide_mb"
                              >
                                <span style={{ width: "80px" }}>
                                  <span
                                    className={`label label-${this.renderClassJobStatus(
                                      job.jobStatus
                                    )} label-dot mr-2`}
                                  />
                                  <span
                                    className={`font-weight-bold text-${this.renderClassJobStatus(
                                      job.jobStatus
                                    )}`}
                                  >
                                    {job.jobStatus}
                                  </span>
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
                                    width: "80px",
                                  }}
                                >
                                  <Link
                                    to={`/job-detail/${job.id}`}
                                    className="btn btn-sm btn-clean btn-icon mr-2"
                                    title="Edit details"
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
                                  </Link>
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
                                        <span style={{ minWidth: 125 }}>
                                          {job.time}
                                        </span>
                                      </td>
                                      <td className="datatable-cell" style={{}}>
                                        <span style={{ width: 110 }}>
                                          <span className="label font-weight-bold label-lg  label-light-success label-inline">
                                            {job.type}
                                          </span>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr className="datatable-row">
                                      <td className="datatable-cell">
                                        <span>{job.salary}</span>
                                      </td>
                                      <td
                                        data-field="Country"
                                        aria-label="Philippines"
                                        className="datatable-cell"
                                        style={{}}
                                      >
                                        <span style={{ width: 110 }}>
                                          <span
                                            className={`label label-${this.renderClassJobStatus(
                                              job.jobStatus
                                            )} label-dot mr-2`}
                                          />
                                          <span
                                            className={`font-weight-bold text-${this.renderClassJobStatus(
                                              job.jobStatus
                                            )}`}
                                          >
                                            {job.jobStatus}
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
                      })} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
    history: ownProps.history,
  };
};

export default connect(mapStateToProps)(ListBlog);
