import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import moment from "moment";
import Wrapper from "../common/Wrapper.js";
import Network from "../../Service/Network";
import Drawer from "@material-ui/core/Drawer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { defaultAva, domainServer } from "../../utils/config.js";

const api = new Network();

class DrawerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasNextPage: true,
      isNextPageLoading: false,
      notification: [],
      pageSize: 12,
      pageNumber: 1,
      total: 0,
    };
    this.onChangeUploadHandler = this.onChangeUploadHandler.bind(this);
    this.redirectProfile = this.redirectProfile.bind(this);
    this.forwardNoti = this.forwardNoti.bind(this);
    // this.getNoti = this.getNoti.bind(this);
    this.renderNotiRow = this.renderNotiRow.bind(this);
    this.scrollCol = null;
    this.scrollRef = React.createRef();
  }
  // Render an item or a loading indicator.
  renderNotiIcon(noti) {
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
          <i className="flaticon-safe-shield-protection text-warning icon-lg" />
        );
        break;
      default:
        icon = <i className="flaticon-notepad text-primary icon-lg"></i>;
        break;
    }
    return icon;
  }
  renderNotiRow = (index, noti, forwardNoti) => {
    return (
      <div
        key={index}
        className="navi-item rounded"
        style={!noti.status ? { backgroundColor: "#e1f0ff" } : null}
        onClick={forwardNoti.bind(this, noti.type, noti.content.id)}
        title={noti.content.title}
      >
        <div className="navi-link rounded">
          <div className="symbol symbol-50 mr-3">
            <div className="symbol-label">{this.renderNotiIcon(noti)}</div>
          </div>
          <div className="navi-text">
            <div className="font-weight-bold font-size-lg mess_noti_cs">
              {noti.content.message}
            </div>
            <div className="text-muted content_title_noti">
              {noti.content.title}
            </div>
            <div className="time_noti text-muted">
              {moment(noti.createdAt).format("hh:mm a DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  forwardNoti(type, id) {
    if (type == "assignJob") {
      this.props.onHide();
      this.props.history.push(`/job-detail/${id}`);
    } else if (type == "assignCard") {
      this.props.onHide();
      this.props.history.push(`/board`);
    } else if (type == "assignTask") {
      this.props.onHide();
      this.props.history.push(`/`);
    } else if (type == "jobOverTime") {
      this.props.onHide();
      this.props.history.push(`/job-detail/${id}`);
    }
  }
  async onChangeUploadHandler(event) {
    try {
      let file_size = event.target.files[0].size;
      // console.log(file_size)
      if (file_size > 3145728) {
        toast.error("Image file size too big!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return false;
      }
      var formData = new FormData();
      formData.append("linkAvatar", event.target.files[0]);

      const request_header = api.getHeaderUpload();
      const request_server = api.domain;
      var self = this;
      const config = {
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          self.setState({ uploadProcess: percentCompleted });
        },
      };
      config.headers = request_header.headers;
      this.setState({ loadingUpload: true });
      axios
        .post(request_server + "/api/upload/avatar", formData, config)
        .then((res) => {
          if (res) {
            console.log(res.data.data.avatar);
            console.log(request_server + "/" + res.data.data.avatar);
            self.props.doneUpload(res.data.data.avatar);
            // var current_data = this.state.data;
            // current_data.avatar = res.data.data.avatar;
            // this.avatar_slider.slickGoTo(0, false);
            // MidleService.reloadUserFunc();
            // this.setState({
            //   loadingUpload: false,
            //   uploadProcess: null,
            //   data: current_data,
            // });
          } else {
            this.setState({ loadingUpload: false });
            toast.error("Something went wrong please try again later!", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loadingUpload: false });
          toast.error("Something went wrong please try again later!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (e) {
      console.log(e);
    }
  }
  redirectProfile(id) {
    this.props.onHide();
    if (this.props.hideMenuResponsive) {
      this.props.hideMenuResponsive();
    }
    this.props.history.push(`/profile/${id}`);
  }
  componentDidMount() {
    this.props.getDataNoti();
    // this.scrollCol = document.getElementById("loadmore_noti");
    // console.log(this.scrollCol);
    // console.log(this.scrollRef.current)
  }
  componentDidUpdate() {
    this.scrollCol = document.getElementById("loadmore_noti");
    // console.log(this.scrollCol);
  }
  componentWillReceiveProps() {
    this.scrollCol = document.getElementById("loadmore_noti");
  }
  onScroll = (e) => {
    // offsetHeight chieu cao cua div TaskList
    // scrollHeight chieu cao thuc cua scroll div
    console.log(e.target.scrollTop + this.scrollCol.offsetHeight);
    console.log(this.scrollCol.scrollHeight);
    if (
      Math.floor(e.target.scrollTop + this.scrollCol.offsetHeight) ==
      this.scrollCol.scrollHeight
    ) {
      console.log("load");
      this.props.getDataNoti();
    }
  };
  render() {
    const data = this.props.data;
    const notification = this.props.notification;
    const { hasNextPage, isNextPageLoading } = this.state;
    console.log(notification);
    return (
      <Drawer
        anchor={"left"}
        open={this.props.show}
        onClose={this.props.onHide}
      >
        <div className=" p-10 ">
          <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
            <h3 className="font-weight-bold m-0">User Profile</h3>
            <div
              className="btn btn-xs btn-icon btn-light btn-hover-primary"
              onClick={this.props.onHide}
            >
              <i className="ki ki-close icon-xs text-muted" />
            </div>
          </div>
          <div className="offcanvas-content pr-5 mr-n5 scroll ">
            <div className="d-flex align-items-center mt-5">
              <div className="symbol symbol-100 mr-5">
                <div
                  className="symbol-label symbol-label-cs-profile"
                  style={{
                    backgroundImage: data.linkAvatar
                      ? `url("${domainServer + "/" + data.linkAvatar}")`
                      : `url("${defaultAva}")`,
                  }}
                />
                <i className="symbol-badge bg-success" />
                <div className="avatar-edit--profile">
                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={this.onChangeUploadHandler}
                  />
                  <label className="label_cs_up_ava" htmlFor="imageUpload">
                    <i className="flaticon2-pen"></i>
                  </label>
                </div>
              </div>
              <div className="d-flex flex-column">
                <div
                  onClick={this.redirectProfile.bind(this, data.id)}
                  className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"
                  title="View details"
                  style={{ cursor: "pointer" }}
                >
                  {data.name ? data.name : null}
                </div>
                <div className="text-muted mt-1">
                  {data.Role ? data.Role.name : null}{" "}
                  {data.Team ? data.Team.name : null}
                </div>

                <div className="navi mt-2">
                  <a href="#" className="navi-item">
                    <span className="navi-link p-0 pb-2">
                      <span className="navi-icon mr-1">
                        <span className="svg-icon svg-icon-lg svg-icon-primary">
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
                              <path
                                d="M21,12.0829584 C20.6747915,12.0283988 20.3407122,12 20,12 C16.6862915,12 14,14.6862915 14,18 C14,18.3407122 14.0283988,18.6747915 14.0829584,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,12.0829584 Z M18.1444251,7.83964668 L12,11.1481833 L5.85557487,7.83964668 C5.4908718,7.6432681 5.03602525,7.77972206 4.83964668,8.14442513 C4.6432681,8.5091282 4.77972206,8.96397475 5.14442513,9.16035332 L11.6444251,12.6603533 C11.8664074,12.7798822 12.1335926,12.7798822 12.3555749,12.6603533 L18.8555749,9.16035332 C19.2202779,8.96397475 19.3567319,8.5091282 19.1603533,8.14442513 C18.9639747,7.77972206 18.5091282,7.6432681 18.1444251,7.83964668 Z"
                                fill="#000000"
                              />
                              <circle
                                fill="#000000"
                                opacity="0.3"
                                cx="19.5"
                                cy="17.5"
                                r="2.5"
                              />
                            </g>
                          </svg>
                        </span>
                      </span>
                      <span className="navi-text text-muted text-hover-primary">
                        {data.email ? data.email : null}
                      </span>
                    </span>
                  </a>
                  <div
                    onClick={this.props.logout}
                    className="btn btn-sm btn-light-primary font-weight-bolder py-2 px-5"
                  >
                    Sign Out
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-dashed mt-8 mb-5" />
            <h5 className="mb-5">Notifications</h5>
            {/* <div id="loadmore_noti" ref={this.scrollRef} style={{height: "500px"}}>huhuh</div> */}
            <div
              onScroll={this.onScroll}
              className="navi navi-spacer-x-0 navi_cs"
              id="loadmore_noti"
            >
              {notification.map((noti, index) => {
                return this.renderNotiRow(index, noti, this.forwardNoti);
              })}
              {this.props.hasNextPage ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    className="btn btn-light btn-shadow btn-sm font-weight-bold font-size-sm spinner spinner-primary spinner-left"
                    style={{ cursor: "wait" }}
                  >
                    Please wait...
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default DrawerProfile;
