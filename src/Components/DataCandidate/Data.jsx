import React, { Component } from "react";
import Network from "../../Service/Network";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PageLoader from "../Common/pageloader";
import { Link } from "react-router-dom";
const moment = require("moment");
const api = new Network();

export default class Candidate extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pageNumber: 1,
      pageSize: 20,
      totalRow: 0,
      data: [],
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.getData = this.getData.bind(this);
    this.getCount = this.getCount.bind(this);
  }

  async getCount() {
    try {
      const count = await api.get(`/datacandidates/count`);
      if (count) {
        if (this._isMounted) {
          await this.setState({
            totalRow: count,
          });
        }
      }
      console.log(count);
    } catch (error) {
      console.log(error);
    }
  }

  handlePagination = async (page) => {
    await this.setState({
      pageNumber: page,
      loading: true,
    });
    this.getData();
  };

  search = () => {
    let keyword = this.refs.inputSearch.value || '';
    try {
      if(keyword.includes("@gmail.com")){
        api
          .get(`/datacandidates?_limit=10&email_contains=${keyword}`)
          .then((res) => {
            this.setState({
              data: res
            });
          });
      }
      else{
        api
          .get(`/datacandidates?_limit=20&_q=${keyword}&_start=0`)
          .then((res) => {
            this.setState({
              data: res
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getData() {
    try {
      let start = this.state.pageSize * (this.state.pageNumber - 1);
      const response = await api.get(
        `/datacandidates?_limit=${this.state.pageSize}&_start=${start}`
      );
      if (response) {
        if (this._isMounted) {
          await this.setState({
            loading: false,
            data: response,
          });
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      }
    } catch (err) {
      console.log("FetchTechAdminError", err.response);
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getData();
    this.getCount();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <div className="main-content" id="panel">
        <PageLoader display={this.state.loading} />
        <div className="header pb-6">
          <div className="container-fluid">
            <div className="header-body">
              <div className="row align-items-center py-4">
                <div className="col-lg-6 col-7">
                  <nav
                    aria-label="breadcrumb"
                    className="d-none d-md-inline-block "
                  >
                    <ol
                      className="breadcrumb breadcrumb-links breadcrumb-dark"
                      style={{
                        boxShadow: "0 9px 30px 1px rgba(153,170,181,.2)",
                        backgroundColor: "white",
                      }}
                    >
                      <li className="breadcrumb-item">
                        <Link to="/" style={{ color: "#32325d" }}>
                          <i className="fas fa-home" />
                        </Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/data" style={{ color: "#32325d" }}>
                          Data Candidates
                        </Link>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page content */}
        <div className="container-fluid mt--6">
          {/* <div className="mt-4 mb-4" style={{ width: "100%" }}>
            <input
              type="text"
              name="input-search"
              onChange={this.handleChange}
              style={{
                border: "1px solid #dee2e6",
                width: "300px",
                height: "30px",
              }}
            />
          </div> */}
          <div className="row">
            <div className="col">
              <div className="card">
                {/* Card header */}
                <div className="card-header border-0">
                  {/* <h3 className="mb-0">Data</h3> */}
                  <div class="form-inline ml-auto">
                        <input className="form-control mr-sm-2" type="text" ref="inputSearch" placeholder="name, email, phone, year..." style={{width: '91%', height: '35px'}} />
                        <button className="btn btn-outline-success my-2 my-sm-0" style={{height: '35px', paddingTop: '7px'}} onClick={this.search}>Search</button>
                    </div>
                </div>
                {/* Light table */}
                <div className="table-responsive">
                  <table className="table align-items-center table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col" className="sort">
                          Name
                        </th>
                        <th scope="col" className="sort ">
                          Email
                        </th>
                        <th scope="col" className="sort">
                          Phone
                        </th>
                        {/* <th scope="col" className="sort">
                          Location
                        </th> */}
                        <th scope="col" className="sort">
                          fromWhom
                        </th>
                        {/* <th scope="col" className="sort">
                          approachDate
                        </th> */}
                        <th scope="col" className="sort">
                          nameJob
                        </th>
                        <th scope="col" className="sort">
                          recordYear
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list">
                      {this.state.data.map((item, index) => {
                        return (
                          <tr className="row-in-job" key={index}>
                            <td className="budget">
                              <span className="name mb-0 text-sm">
                                {item.name}
                              </span>
                            </td>
                            <td className="budget range">{item.email}</td>
                            <td>
                              <div className="media-body">{item.phone}</div>
                            </td>
                            {/* <td>
                              <div className="media-body">{item.location}</div>
                            </td> */}
                            <td>
                              <div className="media-body">{item.fromWhom}</div>
                            </td>
                            {/* <td>
                              <div className="media-body">
                                {item.approachDate}
                              </div>
                            </td> */}
                            <td>
                              <div className="media-body">{item.nameJob}</div>
                            </td>
                            <td>
                              <div className="media-body">
                                {item.recordYear}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Card footer */}
                <div className="card-footer py-4">
                  <Pagination
                    // style={{ marginTop: '60px', marginLeft: '5px' }}
                    defaultPageSize={20}
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

          {/* Footer */}
        </div>
      </div>
    );
  }
}
