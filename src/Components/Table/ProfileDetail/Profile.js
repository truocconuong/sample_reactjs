import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import ListJob from "./ListJob.js";
import Network from "../../../Service/Network";
import Fbloader from "../../libs/PageLoader/fbloader.js";
import "./style.css";
import { defaultAva, domainServer } from "../../../utils/config.js";

const api = new Network();

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className}>
      <i
        style={{ ...style, display: "block", fontSize: "14px" }}
        onClick={onClick}
        className={` text-dark-50 ki ki-arrow-next `}
      ></i>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className}>
      <i
        style={{ ...style, display: "block", fontSize: "14px" }}
        onClick={onClick}
        className={` text-dark-50 ki ki-arrow-back `}
      ></i>
    </div>
  );
}

const settings = {
  dots: true,
  infinite: true,
  speed: 4000,
  slidesToShow: 6,
  slidesToScroll: 6,
  autoplay: true,
  autoplaySpeed: 3000,
  swipeToSlide: true,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        speed: 800,
      },
    },
  ],
};
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: {},
      countCv: [],
      pageNumber: 1,
      pageSize: 5,
      totalRow: 0,
      listJobAssign: [],
    };
    this.getInitData = this.getInitData.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.getDataListJobAssign = this.getDataListJobAssign.bind(this);
  }
  async getInitData() {
    try {
      this.setState({
        isLoading: true,
      });
      const id = this.props.match.params.id;
      const [profileInfor, listCountCv, listJobAssign] = await Promise.all([
        api.get(`/api/user/${id}`),
        api.get(`/api/cards/cv/user/${id}`),
        api.get(
          `/api/job/user/profile?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}&id=${id}`
        ),
      ]);

      if (profileInfor) {
        this.setState({
          user: profileInfor.data.user,
          countCv: listCountCv.data.list,
          isLoading: false,
          listJobAssign: listJobAssign.data.jobs,
          totalRow: listJobAssign.data.total,
        });
      }

      // console.log(listJobAssign.data);
    } catch (error) {
      console.log("err while fetch inti data profile: ", error);
    }
  }
  async getDataListJobAssign() {
    try {
      const id = this.props.match.params.id;
      const response = await api.get(
        `/api/job/user/profile?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}&id=${id}`
      );
      if (response) {
        this.setState({
          isLoading: false,
          listJobAssign: response.data.jobs,
        });
      }
    } catch (error) {
      console.log("err while get list job assign: ", error);
    }
  }
  async handlePagination(page) {
    await this.setState(
      {
        pageNumber: page,
        isLoading: true,
      },
      function () {
        this.getDataListJobAssign();
      }
    );
  }
  componentDidMount() {
    this.getInitData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getInitData();
    }
  }
  render() {
    const { user, countCv } = this.state;
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        
        {this.state.isLoading ? <Fbloader /> : null}
        <div
          className="content d-flex flex-column flex-column-fluid"
          id="kt_content"
        >
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
             
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">

                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <a className="text-muted">Fetch-Admin</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a className="text-muted">Profile</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom gutter-b">
                <div className="card-body">
                  <div className="d-flex mb-9">
                    <div className="flex-shrink-0 mr-7 mt-lg-0 mt-3">
                      <div className="symbol symbol-50 symbol-lg-120">
                        <img
                          src={
                            user.linkAvatar
                              ? domainServer + "/" + user.linkAvatar
                              : defaultAva
                          }
                          alt="image"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between flex-wrap mt-1">
                        <div className="d-flex mr-3">
                          <a
                            href="#"
                            className="text-dark-75 text-hover-primary font-size-h5 font-weight-bold mr-3"
                          >
                            {user.name}
                          </a>
                          <a href="#">
                            <i className="flaticon2-correct text-success font-size-h5" />
                          </a>
                        </div>
                       
                      </div>
                     
                      <div className="d-flex flex-wrap justify-content-between mt-1">
                        <div className="d-flex flex-column flex-grow-1 pr-8">
                          <div className="d-flex flex-wrap mb-4">
                            <a
                              href="#"
                              className="text-dark-50 text-hover-primary font-weight-bold mr-lg-8 mr-5 mb-lg-0 mb-2"
                            >
                              <i className="flaticon2-new-email mr-2 font-size-lg" />
                              {user.email}
                            </a>
                            <a
                              href="#"
                              className="text-dark-50 text-hover-primary font-weight-bold mr-lg-8 mr-5 mb-lg-0 mb-2"
                            >
                              <i className="flaticon2-calendar-3 mr-2 font-size-lg" />
                              {user.Role ? user.Role.name : null}
                            </a>
                            <a
                              href="#"
                              className="text-dark-50 text-hover-primary font-weight-bold"
                            >
                              {user.Team ? (
                                <i className="flaticon2-placeholder mr-2 font-size-lg" />
                              ) : null}

                              {user.Team ? user.Team.name : null}
                            </a>
                          </div>
                          <span className="font-weight-bold text-dark-50">
                            Hôm nay trời nhẹ lên cao
                          </span>
                          <span className="font-weight-bold text-dark-50">
                            Tôi buồn không hiểu vì sao tôi buồn
                          </span>
                        </div>
                      </div>
                     
                    </div>
                   
                  </div>
                 
                  <div className="separator separator-solid" />
                
                  <div className=" mt-8">
                    <Slider {...settings}>
                     
                      {countCv.map((col, index) => {
                        return (
                          <div
                            key={index}
                            className="d-flex align-items-center flex-lg-fill mr-5 mb-2"
                          >
                            <div className="col_in_slide">
                              <div className="text-dark-75 font-weight-bolder font-size-sm">
                                {col.name}
                              </div>
                              <div className="font-weight-bolder font-size-h5 text-dark-50 font-weight-bold">
                                {col.cv} Cv
                              </div>
                            </div>
                          </div>
                        );
                      })}

                     
                    </Slider>
                  </div>
                
                </div>
              </div>
              
              <div className="row">
                <ListJob
                  pageSize={this.state.pageSize}
                  pageNumber={this.state.pageNumber}
                  history={this.props.history}
                  total={this.state.totalRow}
                  data={this.state.listJobAssign}
                  handlePagination={this.handlePagination.bind(this)}
                />
                <div className="col-lg-4">
                 
                  <div className="card card-custom card-stretch gutter-b">
                  
                    <div className="card-header border-0 pt-5">
                      <h3 className="card-title font-weight-bolder">
                        Action Needed
                      </h3>
                      <div className="card-toolbar">
                        <div className="dropdown dropdown-inline">
                          <a
                            href="#"
                            className="btn btn-clean btn-sm btn-icon"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="ki ki-bold-more-hor" />
                          </a>
                          <div className="dropdown-menu dropdown-menu-md dropdown-menu-right">
                           
                            <ul className="navi navi-hover py-5">
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-drop" />
                                  </span>
                                  <span className="navi-text">New Group</span>
                                </a>
                              </li>
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-list-3" />
                                  </span>
                                  <span className="navi-text">Contacts</span>
                                </a>
                              </li>
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-rocket-1" />
                                  </span>
                                  <span className="navi-text">Groups</span>
                                  <span className="navi-link-badge">
                                    <span className="label label-light-primary label-inline font-weight-bold">
                                      new
                                    </span>
                                  </span>
                                </a>
                              </li>
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-bell-2" />
                                  </span>
                                  <span className="navi-text">Calls</span>
                                </a>
                              </li>
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-gear" />
                                  </span>
                                  <span className="navi-text">Settings</span>
                                </a>
                              </li>
                              <li className="navi-separator my-3" />
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-magnifier-tool" />
                                  </span>
                                  <span className="navi-text">Help</span>
                                </a>
                              </li>
                              <li className="navi-item">
                                <a href="#" className="navi-link">
                                  <span className="navi-icon">
                                    <i className="flaticon2-bell-2" />
                                  </span>
                                  <span className="navi-text">Privacy</span>
                                  <span className="navi-link-badge">
                                    <span className="label label-light-danger label-rounded font-weight-bold">
                                      5
                                    </span>
                                  </span>
                                </a>
                              </li>
                            </ul>
                         
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    <div className="card-body d-flex flex-column">
                      <div
                        className="flex-grow-1"
                        style={{ position: "relative" }}
                      >
                        <div
                          id="kt_mixed_widget_14_chart"
                          style={{ height: "200px", minHeight: "200.7px" }}
                        >
                         
                        </div>

                        <div className="resize-triggers">
                          <div className="expand-trigger">
                            <div style={{ width: "356px", height: "223px" }} />
                          </div>
                          <div className="contract-trigger" />
                        </div>
                      </div>
                      <div className="pt-5">
                        <p className="text-center font-weight-normal font-size-lg pb-7">
                          Notes: Current sprint requires stakeholders
                          <br />
                          to approve newly amended policies
                        </p>
                        <a
                          href="#"
                          className="btn btn-success btn-shadow-hover font-weight-bolder w-100 py-3"
                        >
                          Generate Report
                        </a>
                      </div>
                    </div>
                   
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

export default connect(mapStateToProps)(Profile);
