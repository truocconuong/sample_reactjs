import React, { Component } from "react";
import Network from "../../Service/Network";
import Pagination from "rc-pagination";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../utils/common/convertDate";

const api = new Network();

class InterviewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageSize: 5,
      totalRow: 0,
      list: [],
      isLoading: false,
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.goToTrello = this.goToTrello.bind(this);
  }
  goToTrello() {
    this.props.history.push("/board");
  }
  async handlePagination(page) {
    await this.setState({
      pageNumber: page,
    });
    this.getDataRecruitmentProgress(this.props.nameColumn);
  }
  async getDataRecruitmentProgress(nameColumn) {
    try {
      this.setState({
        isLoading: true,
      });
      const response = await api.get(
        `/api/v1/admin-new/cards?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}&laneName=${nameColumn}`
      );
      if (response) {
        this.setState({
          list: response.data.list,
          totalRow: response.data.total,
          isLoading: false,
        });
        console.log(this.state.list);
      }
    } catch (error) {
      console.log("err while fetch data recruitment progress: ", error);
    }
  }
  componentDidMount() {
    this.getDataRecruitmentProgress(this.props.nameColumn);
  }
  render() {
    return (
      <div
        style={
          this.props.nameColumn === "Onboarding"
            ? { paddingLeft: 0 }
            : { paddingRight: 0 }
        }
        className="col-xl-6 plm_0 prm_0"
      >
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-header card-header-mobile border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                {this.props.nameColumn}
              </span>
            </h3>
          </div>
          <div className="card-body pt-1 pb-0 ">
            <div className="tab-content " id="myTabTables2">
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
                          className="p-0 text-left pl-3 title_recruitment"
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
                        this.state.list.map((e, index) => {
                          // console.log("see", e);
                          return (
                            <tr className="row_in_applicant" key={index}>
                              <td className="pl-0 d-flex align-items-center">
                                <span
                                  className="bullet bullet-bar  align-self-stretch"
                                  style={{ background: e.Lane.background }}
                                ></span>
                                <div className="wrap_name_candidate">
                                  <div
                                    onClick={this.goToTrello.bind(this)}
                                    style={{
                                      cursor: "pointer",
                                      width: "230px",
                                    }}
                                    className="text-dark font-weight-bold text-hover-primary mb-1 font-size-lg hide_3dot"
                                  >
                                    {e.Candidate.name}
                                  </div>
                                  <input
                                    className="text-muted font-weight-bold d-block form-control form-control-solid input_cs_nameJob"
                                    readOnly
                                    value={e.Job.title}
                                  />
                                </div>
                              </td>
                              <td
                                className="text-left pr-0"
                                style={{ maxWidth: "446px" }}
                              >
                                <div className="text-dark font-weight-bold mb-1 font-size-lg d-flex align-items-center ">
                                  <span
                                    style={{ background: e.Lane.background }}
                                    className="dot_cs_status mr-1"
                                  />
                                  <input
                                    className=" font-weight-bold d-block form-control form-control-solid input_cs_nameJob input_cx_status"
                                    readOnly
                                    value={e.Lane.nameColumn}
                                  />
                                </div>
                              </td>
                              <td style={{ width: "100px" }}>
                                <span>
                                  <input
                                    className=" font-weight-bold d-block form-control form-control-solid input_cs_nameJob input_cx_status"
                                    readOnly
                                    value={formatDate(e.approachDate)}
                                  />
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ width: "40%" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ width: "40%" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ width: "20%" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ width: "40%" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ width: "40%" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ width: "20%" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ width: "40%" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ width: "40%" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ width: "20%" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ width: "40%" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ width: "40%" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ width: "20%" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ width: "40%" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ width: "40%" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ width: "20%" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr>
                          {/* <tr style={{ height: "70px" }}>
                            <td className="p-0" style={{ minWidth: "250px" }}>
                              <Skeleton height={30} />
                            </td>
                            <td
                              style={{ maxWidth: "446px" }}
                              className="text-left pr-0"
                            >
                              <Skeleton height={30} />
                            </td>
                            <td style={{ maxWidth: "100px" }}>
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
                            <td style={{ maxWidth: "100px" }}>
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
                            <td style={{ maxWidth: "100px" }}>
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
                            <td style={{ maxWidth: "100px" }}>
                              <Skeleton height={30} />
                            </td>
                          </tr> */}
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

export default InterviewList;
