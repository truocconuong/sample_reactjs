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
const api = new Network();

class FilterMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      options: [
        {
          value: "",
          label: "",
        },
      ],
    };
    this.initDataUsers = this.initDataUsers.bind(this);
  }
  async initDataUsers() {
    const response = await api.get(
      `/api/search/board/members?search=${this.state.search}`
    );
    if (response) {
      const users = response.data.list;
      this.setState({
        options: users.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        }),
      });
      console.log(this.state.options);
    }
  }
  handleChangeInput = (e) => {
    if (e) {
      this.props.searchCardByUserId(e.value);
    } else {
      this.props.initDataAgain();
    }
    console.log(e);
  };

  elementFormSearchUsers = () => {
    return (
      <ul className="navi navi-hover navi-selected-ul  header-users">
        <li className="navi-header font-weight-bold py-4">
          <span className="font-size-lg">Members</span>
        </li>
        <li className="navi-separator mb-3 opacity-70" />
        {this.state.isLoadingMember
          ? this.elmIsLoading()
          : this.state.users.map((user, index) => (
              <div
                onClick={() => {
                  // this.setDefaultSearch();
                  this.toggleFormSearch();
                  this.props.searchCardByUserId(user.id);
                }}
                className="search-user"
                key={index}
              >
                <div className="d-flex align-items-center">
                  <div className="symbol symbol-50 symbol-light mr-5">
                    <span className="symbol-label symbol-label-cs">
                      <img
                        src={
                          user.linkAvatar
                            ? domainServer + "/" + user.linkAvatar
                            : defaultAva
                        }
                        className="h-100 align-self-end"
                        alt=""
                      />
                    </span>
                  </div>
                  <div className="d-flex flex-column flex-grow-1">
                    <div
                      style={{ cursor: "pointer" }}
                      className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1"
                    >
                      {user.name}
                    </div>
                    <span className="text-muted font-weight-bold">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        <div></div>
      </ul>
    );
  };
  componentDidMount() {
    this.initDataUsers();
  }
  render() {
    return (
      <div>
        <Select
          className="select_user"
          classNamePrefix="select"
          isClearable
          isSearchable={true}
          name="users"
          options={this.state.options}
          onChange={this.handleChangeInput}
          placeholder={"Choose member..."}
        />
      </div>
    );
  }
}

export default FilterMember;
