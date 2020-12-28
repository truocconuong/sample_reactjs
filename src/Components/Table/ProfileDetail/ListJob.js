import React, { Component } from "react";
import Pagination from "rc-pagination";

class ListJob extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col-lg-8">
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                List Job
              </span>
              <span className="text-muted mt-3 font-weight-bold font-size-sm">
                You are following {this.props.total} jobs
              </span>
            </h3>
            
          </div>
          <div className="card-body pt-2 pb-0 mt-n3">
            <div className="tab-content mt-5" id="myTabTables11">
              
              <div
                className="tab-pane fade show active"
                id="kt_tab_pane_11_3"
                role="tabpanel"
                aria-labelledby="kt_tab_pane_11_3"
              >
                
                <div className="table-responsive">
                  <table className="table table-borderless table-vertical-center">
                    <thead>
                      <tr>
                       
                        <th className="p-0 min-w-200px" />
                        <th className="p-0 min-w-100px" />
                        <th className="p-0 min-w-125px" />
                        <th className="p-0 min-w-110px" />
                        
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.data.map((job, index) => {
                        return (
                          <tr key={index}>
                           

                            <td className="pl-0">
                              <div
                                onClick={() => {
                                  this.props.history.push(
                                    `/job-detail/${job.id}`
                                  );
                                }}
                                style={{cursor: "pointer" }}
                                className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg"
                              >
                                {job.title}
                              </div>
                              <div>
                               
                                <div className="text-muted font-weight-bold text-hover-primary">
                                  {job.type}
                                </div>
                              </div>
                            </td>
                            <td className="text-right">
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                {job.salary}
                              </span>
                              <span className="text-muted font-weight-bold">
                                Salary
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                Candidate
                              </span>
                              <span className="text-muted font-weight-bold">
                                {job.candidate}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="label label-lg label-light-primary label-inline">
                                {job.jobStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="datatable-pager datatable-paging-loaded fl_end">
                      <Pagination
                        defaultPageSize={this.props.pageSize}
                        current={this.props.pageNumber}
                        hideOnSinglePage={true}
                        showTitle={false}
                        onChange={this.props.handlePagination}
                        total={this.props.total}
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

export default ListJob;
