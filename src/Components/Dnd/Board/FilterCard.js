import React, { Component } from "react";
import Network from "../../../Service/Network";
import Select from "react-select";
import moment from 'moment'
import roleName from "../../../utils/const";
import { connect } from "react-redux";
import SearchBoard from './SearchBoard'
const api = new Network();

class FilterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "",
      jobId: "",
      clientId: "",
      searchMember: "",
      userId: "",
      jobs: [],
      clients: [],
      labels: [],
      members: [],
      startCard: moment(),
      endCard: moment()
    };
  }
  initDataJobs = async () => {
    const response = await api.get(
      `/api/admin/search/jobs`
    );
    if (response) {
      const jobs = response.data.listJob;

      this.setState({
        jobs: jobs.map((e) => {
          return {
            label: e.title,
            value: e.id,
          };
        }),
      });
    }
  }

  handleChangeInputFilterMember = (e) => {
    let value = null;
    if (e) {
      value = e.value
    }
    this.setState({
      userId: value
    })
  }

  initDataClients = async () => {
    const response = await api.get(
      `/api/all/client`
    );
    if (response) {
      const clients = response.data.clients;
      this.setState({
        clients: clients.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        }),
      });
    }
  }
  initDataLabels = async () => {
    const response = await api.get(
      `/api/v1/label`
    );
    if (response) {
      const labels = response.data.list;
      this.setState({
        labels: labels.map((e) => {
          return {
            label: e.title,
            value: e.id,
          };
        }),
      });
    }
  }

  async initDataUsers() {
    const response = await api.get(
      `/api/search/board/members?search=${this.state.searchMember}`
    );
    if (response) {
      console.log('o lag ak', response);
      const users = response.data.list;
      this.setState({
        members: users.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        }, () => {
          console.log(this.state)
        }),
      });
    }
  }

  handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  };

  handleChangeSelectJob = (e) => {
    let jobId = null;
    if (e) {
      jobId = e.value
    }
    this.setState({
      jobId: jobId
    })
  }

  handleChangeSelectClient = (e) => {
    let clientId = null;
    if (e) {
      clientId = e.value
    }
    this.setState({
      clientId: clientId
    })
  }

  handleChangeSelectLabel = (e) => {
    let label = null;
    if (e) {
      label = e.label
    }
    this.setState({
      label: label
    })
  }

  filterCard = () => {
    const data = this.state;
    const item = {
      clientId: data.clientId,
      jobId: data.jobId,
      label: data.label,
      userId: data.userId,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd
    }
    this.props.callSearchCard(item)
  }
  componentDidMount() {
    this.initDataJobs();
    this.initDataClients();
    this.initDataLabels();
    this.initDataUsers();
  }

  render() {
    return (
      <div>
        <div className="all-filter-board row-one">
          <div className="row-filter-two">
            <SearchBoard
              searchCardDetail={this.props.searchCardDetail}
            />
            {this.props.role === roleName.DIRECTOR ? (<div className="filter-board-item board-item-search">
              <Select
                className="select_user select_client"
                classNamePrefix="select"
                isClearable
                isSearchable={true}
                name="userId"
                options={this.state.members}
                onChange={this.handleChangeInputFilterMember}
                placeholder={"Choose member..."}
              />
            </div>) : null}
          </div>
          <div className="row-filter-two">
            <div className="filter-board-item">
              <Select
                className="select_user"
                classNamePrefix="select"
                isClearable
                isSearchable={true}
                name="label"
                options={this.state.labels}
                onChange={this.handleChangeSelectLabel}
                placeholder={"Choose label..."}
              />
            </div>
            <div className="filter-board-item">
              <Select
                className="select_user"
                classNamePrefix="select"
                isClearable
                isSearchable={true}
                name="jobId"
                options={this.state.jobs}
                onChange={this.handleChangeSelectJob}
                placeholder={"Choose job..."}
              />
            </div>
          </div>

          <div className="row-filter-two">
            <div className="filter-board-item">
              <Select
                className="select_user select_client"
                classNamePrefix="select"
                isClearable
                isSearchable={true}
                name="clientId"
                options={this.state.clients}
                onChange={this.handleChangeSelectClient}
                placeholder={"Choose client..."}
              />
            </div>
            <div className="filter-date-row">
              <div className="filter-board-item">
                <input onChange={this.handleChangeInput} type="date" name="timeStart" className="form-control" placeholder="Enter your start card" />
              </div>
              <div className="filter-board-item">
                <input type="date" onChange={this.handleChangeInput} name="timeEnd" className="form-control" placeholder="Enter your end card" />
              </div>
            </div>
          </div>
          <div className="filter-board-item btn-search-filter">
            <button onClick={this.filterCard} type="submit" className="btn btn-primary mr-2">Search</button>
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
    role: state.auth.role,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps)(FilterCard);