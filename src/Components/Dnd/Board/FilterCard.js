import React, { Component } from "react";
import {
  Button as ButtonPop,
  Popover as PopoverPop,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Network from "../../../Service/Network";
import { defaultAva, domainServer } from "../../../utils/config";
import Select from "react-select";
import moment from 'moment'
import { DatetimePickerTrigger } from "../../libs/rc-datetime-picker/dist/rc-datetime-picker.cjs";

const api = new Network();

class FilterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "",
      jobId: "",
      clientId: "",
      jobs: [],
      clients: [],
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
      console.log(this.state.options);
    }
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

  filterCard = () => {
    const data = this.state;
    const item = {
      clientId: data.clientId,
      jobId: data.jobId,
      label: data.label,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd
    }
    this.props.callSearchCard(item)
  }
  componentDidMount() {
    this.initDataJobs();
    this.initDataClients();
  }

  render() {
    return (
      <div>
        <div className="all-filter-board row-one">
          <div className="filter-board-item">
            <input type="text" name="label" onChange={this.handleChangeInput} value={this.state.label} className="form-control" placeholder="Enter label" />
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
          <div className="filter-board-item">
            <Select
              className="select_user"
              classNamePrefix="select"
              isClearable
              isSearchable={true}
              name="clients"
              options={this.state.clients}
              onChange={this.handleChangeSelectClient}
              placeholder={"Choose client..."}
            />
          </div>
          <div className="filter-board-item">
            <input onChange={this.handleChangeInput} type="date" name="timeStart" className="form-control" placeholder="Enter your start card" />
          </div>
          <div className="filter-board-item">
            <input type="date" onChange={this.handleChangeInput} name="timeEnd" className="form-control" placeholder="Enter your end card" />
          </div>
          <div className="filter-board-item">
          </div>
          <div className="filter-board-item">
            <button onClick={this.filterCard} type="submit" className="btn btn-primary mr-2">Search</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FilterCard;
