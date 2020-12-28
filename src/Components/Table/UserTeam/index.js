import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { connect } from "react-redux";
import Team from "./Team.js";
import User from "./User.js";
import { Link, NavLink } from "react-router-dom";

class UserTeam extends Component {
  constructor() {
    super();
    this.state = {
      isShowComponentUser: true,
      brewCum: "List user",
    };
  }

  changeComponent = (selectedKey) => {
    let data = {
      brewCum: "",
      isShowComponentUser: false,
    };
    if (selectedKey === "user") {
      data.brewCum = "List user";
      data.isShowComponentUser = true;
    } else {
      data.brewCum = "List team";
      data.isShowComponentUser = false;
    }
    this.setState(data);
  };
  render() {
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <div className="content d-flex flex-column flex-column-fluid">
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap container_user_cs">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <Link to="/" className="text-dark">
                        Dashboard
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <div className="text-dark">{this.state.brewCum}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container d-flex container_user_cs">
              <div className="container-toggle-form">
                <Nav
                  className="nav nav-pills"
                  id="myTab"
                  activeKey="/user"
                  onSelect={(selectedKey) => this.changeComponent(selectedKey)}
                >
                  <Nav.Item className="nav-item">
                    <Nav.Link
                      className={
                        this.state.isShowComponentUser
                          ? "nav-link active"
                          : "nav-link"
                      }
                      eventKey="user"
                    >
                      <span className="nav-icon">
                        <i className="flaticon-users-1"></i>
                      </span>
                      <span className="nav-text">User</span>
                    </Nav.Link>
                  </Nav.Item>
                  {this.props.role === "Director" ? (
                    <Nav.Item>
                      <Nav.Link
                        className={
                          !this.state.isShowComponentUser
                            ? "nav-link active"
                            : "nav-link"
                        }
                        eventKey="team"
                      >
                        <span className="nav-icon">
                          <i className="flaticon2-group"></i>
                        </span>
                        <span className="nav-text">Team</span>
                      </Nav.Link>
                    </Nav.Item>
                  ) : null}
                </Nav>
              </div>
            </div>
          </div>
          {this.state.isShowComponentUser ? (
            <User history={this.props.history} role={this.props.role} />
          ) : (
            <Team />
          )}
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
    role: state.auth.role,
    history: ownProps.history,
  };
};

export default connect(mapStateToProps)(UserTeam);
