import React, { Component } from "react";
import Network from "../../../Service/Network";
import Pagination from "rc-pagination";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import CandidateDetail from "../../Modal/Candidate/CandidateDetail.js";

const api = new Network();

class Applicants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listApplivcant: [],
      pageNumber: 1,
      pageSize: 5,
      totalRow: 0,
      isOpenCandidateDetail: false,
      candidateInfor: {},
      isLoading: false,
    };
    this.getApplicant = this.getApplicant.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.toggleCandidateDetail = this.toggleCandidateDetail.bind(this);
    this.openDetailCandidate = this.openDetailCandidate.bind(this);
  }
  toggleCandidateDetail(isShow) {
    this.setState({
      isOpenCandidateDetail: isShow,
    });
  }
  openDetailCandidate(data) {
    this.setState(
      {
        candidateInfor: data,
      },
      function () {
        this.toggleCandidateDetail(true);
      }
    );
  }
  async getApplicant() {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.get(
        `/api/admin/applicants/candidate?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
      );
      if (response) {
        this.setState({
          listApplivcant: response.data.list,
          totalRow: response.data.total,
          isLoading: false,
        });
        // console.log(response.data);
      }
    } catch (error) {
      console.log("err while fetch data applicants: ", error);
    }
  }
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
    });
    this.getApplicant();
  }
  componentDidMount() {
    this.getApplicant();
  }
  render() {
    return (
      <div className="col-xl-4 plm_0 prm_0">
        <CandidateDetail
          data={this.state.candidateInfor}
          show={this.state.isOpenCandidateDetail}
          onHide={this.toggleCandidateDetail.bind(this, false)}
        />
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-header card-header-mobile border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                New Applicants
              </span>
            </h3>
          </div>
          <div className="card-body pt-1 pb-0">
            <div className="tab-content ">
              <div
                className="tab-pane fade show active"
                id="kt_tab_pane_2_3"
                role="tabpanel"
                aria-labelledby="kt_tab_pane_2_3"
              >
                <div className="table-responsive table_flex_between">
                  <table className="table table-borderless table-vertical-center">
                    <thead>
                      <tr className="title_recruitment">
                        <th className="p-0" style={{ minWidth: "150px" }}></th>
                        <th
                          className="p-0 text-right pr-3 title_recruitment"
                          style={{
                            minWidth: "140px",
                            maxWidth: "200px",
                            overFlow: "hidden",
                          }}
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {!this.state.isLoading ? (
                        this.state.listApplivcant.map((applicant, index) => {
                          return (
                            <tr className="row_in_applicant" key={index}>
                              <td className="pl-0">
                                <div
                                  onClick={this.openDetailCandidate.bind(
                                    this,
                                    applicant
                                  )}
                                  style={{
                                    cursor: "pointer",
                                    width: "243px",
                                  }}
                                  title={applicant.Candidate.name}
                                  className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg hide_3dot"
                                >
                                  {applicant.Candidate.name}
                                </div>
                                <div
                                  style={{
                                    // cursor: "pointer",
                                    width: "243px",
                                  }}
                                  title={`Applied for ${applicant.Job.title}`}
                                  className="text-muted font-weight-bold d-block custom_font_12 hide_3dot"
                                >
                                  Applied for{" "}
                                  <span className="job_applied">
                                    {applicant.Job.title}
                                  </span>
                                </div>
                              </td>
                              <td
                                className="text-right pr-0"
                                style={{ maxWidth: "446px" }}
                              >
                                <div className="text-dark font-weight-bold  date_applied">
                                  {moment(applicant.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                          </tr>
                        </>
                      )}
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

export default Applicants;
