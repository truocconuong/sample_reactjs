import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import { addPaddingBroad, removePaddingBroad } from "../../redux/actions";
import { connect } from "react-redux";
import AuthService from "../../Service/AuthService.js";
import Network from "../../Service/Network.js";
import { defaultAva, domainServer } from "../../utils/config.js";
import { withRouter } from "react-router-dom";
import Pusher from "pusher-js";
import DrawerProfile from "./DrawerProfile.js";
import { ToastContainer, toast, Flip, Zoom } from "react-toastify";
import moment from "moment";
import PwaInstall from './PwaInstall.js';
const socket = require("socket.io-client")(domainServer);

const auth = new AuthService();
const api = new Network();

class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      class_menu_left: "wrap_menu_left",
      class_arr: "fa fa-chevron-right",
      isOpenDrawer: false,
      profile: {},
      notification: [],
      countUnreadNoti: 0,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.uploadAvatarDone = this.uploadAvatarDone.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.initPusher = this.initPusher.bind(this);
    this.markAllNotiRead = this.markAllNotiRead.bind(this);
    this.renderNotiToast = this.renderNotiToast.bind(this);
    this.forwardNoti = this.forwardNoti.bind(this);
    this.drawerProfile = React.createRef();
  }

  forwardNoti(type, id) {
    if (type == "assignJob") {
      this.props.history.push(`/job-detail/${id}`);
    } else if (type == "assignCard") {
      this.props.history.push(`/board`);
    } else if (type == "assignTask") {
      this.props.history.push(`/`);
    }
  }
  renderNotiToast(noti) {
    let icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
    console.log(noti.type);
    switch (noti.type) {
      case "assignJob":
        icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
        break;
      case "assignCard":
        icon = <i className="flaticon-bell text-success icon-lg" />;
        break;
      case "assignTask":
        icon = <i className="flaticon-calendar-1 text-success icon-lg" />;
        break;
      case "jobOverTime":
        icon = (
          <i className="flaticon-safe-shield-protection text-danger icon-lg" />
        );
        break;
      default:
        icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
        break;
    }
    return (
      <div
        className="navi-item rounded"
        onClick={this.forwardNoti.bind(this, noti.type, noti.content.id)}
      >
        <div className="navi-link rounded d-flex">
          <div className="symbol symbol-50 mr-3">
            <div className="symbol-label symbol_label_cs">{icon}</div>
          </div>
          <div className="navi-text">
            <div className="text-dark font-weight-bold font-size-lg cus_text_mute">
              {noti.content.message}
            </div>
            <div className="text-muted">{noti.content.title}</div>
            <div className="time_noti text-muted">
              {moment(noti.createdAt).format("hh:mm a DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </div>
    );
  }
  initSocketIO(userId) {
    let self = this;
    socket.emit("join", userId);
    socket.on("notification", function (noti) {
      console.log(noti);
      self.drawerProfile.current.receiveNewNoti(noti.content);
      self.setState((prevState) => {
        return {
          countUnreadNoti: prevState.countUnreadNoti + 1,
        };
      });
      console.log(noti.content);
      toast(self.renderNotiToast(noti.content), {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        transition: Zoom,
        className: "custom_toast",
      });
    });
  }
  initPusher(idUser) {
    const pusher = new Pusher("e14503e929f2e0a46385", {
      cluster: "ap1",
      encrypted: true,
    });

    const channel = pusher.subscribe("notification");
    channel.bind(idUser, (noti) => {
      console.log(noti);
      this.drawerProfile.current.receiveNewNoti(noti.content);
      this.setState((prevState) => {
        return {
          countUnreadNoti: prevState.countUnreadNoti + 1,
        };
      });
      toast(this.renderNotiToast(noti.content), {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        transition: Zoom,
        className: "custom_toast",
      });
    });
  }
  uploadAvatarDone(linkAvatar) {
    let currentProfile = this.state.profile;
    currentProfile.linkAvatar = linkAvatar;
    this.setState({
      profile: currentProfile,
    });
  }
  async getProfile() {
    try {
      const responseProfile = await api.get(`/api/profile`);
      if (responseProfile) {
        this.initSocketIO(responseProfile.data.user.id);
        this.setState(
          {
            profile: responseProfile.data.user,
            countUnreadNoti: responseProfile.data.user.countNotificationNotSeen
              ? responseProfile.data.user.countNotificationNotSeen
              : 0,
          },
          function () {}
        );
      }
    } catch (error) {
      console.log("err while get profile user: ", error);
    }
  }
  async markAllNotiRead() {
    try {
      const response = await api.patch(`/api/read/all/notification`);
      if (response) {
        this.drawerProfile.current.markAllNotiRead();
        this.setState({
          countUnreadNoti: 0,
        });
      }
    } catch (error) {
      console.log("err while mark read: ", error);
    }
  }
  async toggleDrawer(open) {
    
    // mark all noti as read => call api read noti
    if (this.state.countUnreadNoti != 0 && !open) {
      await this.markAllNotiRead();
    }
    this.setState({ isOpenDrawer: open });
  }
  toggleMenu() {
    if (this.state.class_menu_left === "wrap_menu_left") {
      this.props.addPadding();
      this.setState({
        class_menu_left: "wrap_menu_left menu_extend",
        class_arr: "fa fa-chevron-left",
      });
    } else {
      this.props.removePadding();
      this.setState({
        class_menu_left: "wrap_menu_left",
        class_arr: "fa fa-chevron-right",
      });
    }
  }
  handleOnClick(e, path) {
    e.preventDefault();
    this.props.hideMenuResponsive();
    this.props.history.push(path);
  }
  logout() {
    auth.logout();
  }
  componentDidMount() {
    this.getProfile();
  }
  render() {
    const notification = this.state.notification;
    return (
      <div className={`stick_toggle_button ${this.props.classHide}`}>
        <ToastContainer />
        {this.state.isOpenDrawer ? (
          <DrawerProfile
            show={this.state.isOpenDrawer}
            onHide={this.toggleDrawer.bind(this, false)}
            logout={this.logout}
            data={this.state.profile}
            doneUpload={this.uploadAvatarDone.bind(this)}
            history={this.props.history}
            hideMenuResponsive={this.props.hideMenuResponsive}
            notification={notification}
            ref={this.drawerProfile}
          />
        ) : null}

        <div className="toggle_button" onClick={this.toggleMenu}>
          <i className={this.state.class_arr} aria-hidden="true"></i>
        </div>
        <div className={this.state.class_menu_left}>
          <div>
            <div
              className="row_icon wrap_avatar_user"
              onClick={this.toggleDrawer.bind(this, true)}
            >
              <div className="position-relative">
                {this.state.profile ? (
                  <img
                    className="ava_img"
                    src={
                      this.state.profile.linkAvatar
                        ? domainServer + "/" + this.state.profile.linkAvatar
                        : defaultAva
                    }
                    alt="ava"
                  />
                ) : (
                  <img className="ava_img" src={defaultAva} alt="ava" />
                )}
                {this.state.countUnreadNoti != 0 ? (
                  <span className="label label-sm  label-danger font-weight-bolder position-absolute noti_count mt-1 mr-1">
                    {this.state.countUnreadNoti}
                  </span>
                ) : null}
              </div>

              <div className="content_menu">Profile</div>
            </div>

            <NavLink
              exact
              activeClassName="selected"
              to="/"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/")
                  : () => null
              }
              className="row_icon"
            >
              <div className="wrap_icon_menu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 477.867 477.867"
                  className="svg_icon"
                >
                  <path
                    d="M470.382,224.808c-0.482-0.323-0.979-0.621-1.492-0.893l-33.911-18.261l-188.058,99.567
			c-4.996,2.646-10.978,2.646-15.974,0L42.89,205.654L8.978,223.915C0.736,228.29-2.4,238.518,1.975,246.76
			c0.272,0.512,0.57,1.01,0.893,1.492l236.066,124.979l236.066-124.979C480.199,240.503,478.132,230.007,470.382,224.808z"
                  />

                  <path
                    d="M475.803,333.227c-1.581-2.929-3.984-5.332-6.912-6.912l-33.911-18.261l-188.058,99.567
			c-4.996,2.646-10.978,2.646-15.974,0L42.89,308.054L8.978,326.315c-8.295,4.477-11.389,14.83-6.912,23.125
			c1.581,2.929,3.984,5.332,6.912,6.912l221.867,119.467c5.05,2.719,11.129,2.719,16.179,0l221.867-119.467
			C477.185,351.875,480.28,341.522,475.803,333.227z"
                  />

                  <path
                    d="M470.382,122.408c-0.482-0.323-0.979-0.621-1.492-0.893L247.024,2.048c-5.05-2.719-11.129-2.719-16.179,0L8.978,121.515
			C0.736,125.89-2.4,136.118,1.975,144.36c0.272,0.512,0.57,1.01,0.893,1.492l236.066,124.979l236.066-124.979
			C480.199,138.103,478.132,127.607,470.382,122.408z"
                  />
                </svg>
              </div>
              <div className="content_menu">Dashboard</div>
            </NavLink>

            <NavLink
              exact
              activeClassName="selected"
              to="/job"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/job")
                  : () => null
              }
              className="row_icon"
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fa fa-list hover_icon"></i>
              </div>
              <div className="content_menu">Jobs</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/client"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/client")
                  : () => null
              }
              className="row_icon"
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fa fa-users hover_icon"></i>
              </div>
              <div className="content_menu">Clients</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/candidate"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/candidate")
                  : () => null
              }
              className="row_icon"
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fa fa-id-card hover_icon"></i>
              </div>
              <div className="content_menu">Candidates</div>
            </NavLink>

            <NavLink
              exact
              activeClassName="selected"
              to="/users"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/users")
                  : () => null
              }
              className="row_icon"
              style={this.props.role == "Member" ? { display: "none" } : null}
            >
              <div className="wrap_icon_menu">
                <i className="fa fa-user hover_icon"></i>
              </div>
              <div className="content_menu">Users</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/search"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/search")
                  : () => null
              }
              className="row_icon"
            >
              <div className="wrap_icon_menu">
                <i className="fa fa-search hover_icon"></i>
              </div>
              <div className="content_menu">Search</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/interview"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/interview")
                  : () => null
              }
              className="row_icon"
            >
              <div className="wrap_icon_menu">
                <i className="far fa-handshake hover_icon"></i>
              </div>
              <div className="content_menu">Interview</div>
            </NavLink>
            <NavLink
              exact
              activeClassName="selected"
              to="/board"
              onClick={
                this.props.isMobile
                  ? (e) => this.handleOnClick(e, "/board")
                  : () => null
              }
              className="row_icon"
            >
              <div className="wrap_icon_menu">
                <i className="fab fa-trello hover_icon"></i>
              </div>
              <div className="content_menu">Board</div>
            </NavLink>
            {this.props.role === "Director" ? (
              <NavLink
                exact
                activeClassName="selected"
                to="/setting"
                onClick={
                  this.props.isMobile
                    ? (e) => this.handleOnClick(e, "/setting")
                    : () => null
                }
                className="row_icon"
              >
                <div className="wrap_icon_menu">
                  <i className="fa fa-cog hover_icon"></i>
                </div>
                <div className="content_menu">Setting</div>
              </NavLink>
            ) : null}
           <PwaInstall />
          </div>
          <div></div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPadding: () => dispatch(addPaddingBroad()),
    removePadding: () => dispatch(removePaddingBroad()),
  };
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
    history: ownProps.history,
    classHide: ownProps.classHide,
    isMobile: ownProps.isMobile,
    hideMenuResponsive: ownProps.hideMenuResponsive,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MenuLeft)
);
