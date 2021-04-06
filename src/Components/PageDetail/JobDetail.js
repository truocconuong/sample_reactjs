import React, { Component } from "react";
import Network from "../../Service/Network";
import Fbloader from "../libs/PageLoader/fbloader";
import moment from "moment";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Pagination from "rc-pagination";
import ReactHtmlParser from "react-html-parser";
import "rc-pagination/assets/index.css";
import "./style.css";
import { connect } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import { domainServer, defaultAva } from "../../utils/config";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CandidateDetail from "../Modal/Candidate/CandidateDetail";
import CandidateCard from "./CanidateCard";
import CardTrello from "./CardTrello";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Overlay, Popover } from "react-bootstrap";
import { Popover as PopoverPop, PopoverHeader, PopoverBody } from "reactstrap";
import CustomToast from "../common/CustomToast";
import PreviewPdf from "../Modal/PreviewPdf/PreviewPdf";
import HistoryJob from "../Modal/JobDetail/HistoryJob";
import _ from 'lodash';

const api = new Network();
const ref = React.createRef();

class JobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDeleteUserPop: new Array(10).fill(false),
      data: {},
      dataCandidate: [],
      isLoading: false,
      isLoadingTable: false,
      isDisplay: false,
      arrLoading: [1, 2, 3, 4, 5],
      arrLoadingTwo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      userAssign: [],
      candidateFilter: [],
      laneSelected: [],
      isLoadingAssign: false,

      dataUserAssignJob: [],
      // model candidate detail
      candidateInfor: {},
      isOpenCandidateDetail: false,
      isOpenPreviewPdf: false,
      // delete user assign
      isOpen: false,
      idUserDelete: "",
      // add candidate card
      candidateCard: {},
      isOpenCandidateCard: false,

      //card trello
      cardTrello: {},
      isOpenCardTrello: false,

      showAssignUser: false,
      test: true,
      userBitlink: {
        urlShort: "",
        totalClick: "",
      },
      pageNumber: 1,
      totalRow: 0,
      numberInPage: 5,
      viewCandidate: [],

      // mang lane
      arrayLane: [],
      base64: "",

      // history
      dataHistory: [],
      isShowHistoryJob: false,

      // user add card
      users: [],
      userCard: [],

      isLoadingPdf: false
    };
    this.showInfoMember = [];
    this.handlePagination = this.handlePagination.bind(this);
    this.getData = this.getData.bind(this);
    this.getUserAssign = this.getUserAssign.bind(this);
    this.getDataUserAssignJob = this.getDataUserAssignJob.bind(this);

    this.toggleCandidateDetail = this.toggleCandidateDetail.bind(this);
    this.toggleCandidateAddCard = this.toggleCandidateAddCard.bind(this);
    this.toggleCardTrelo = this.toggleCardTrelo.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
  }
  toggleHistory(isShow) {
    this.setState({
      isShowHistoryJob: isShow,
    });
  }
  closeModelDelete = () => {
    this.setState({
      isOpen: false,
    });
  };

  openModelDelete = () => {
    this.setState({
      isOpen: true,
    });
  };

  confirmDelete = (userId, index) => {
    this.toggleDeleteUserPop(index);
    this.setState({
      isOpen: true,
      idUserDelete: userId,
    });
  };

  deleteUserAssign = async () => {
    const idJob = this.props.match.params.id;
    const { idUserDelete, dataUserAssignJob } = this.state;
    try {
      let data = dataUserAssignJob.filter((item) => {
        return item.userId !== idUserDelete;
      });
      this.setState({
        dataUserAssignJob: data,
        isOpen: false,
      });
      let result = await api.post(`/api/remove/assignment`, {
        userId: idUserDelete,
        jobId: idJob,
      });
      if (!result.data.success) {
        toast(
          <CustomToast
            title={"Something went wrong please try again later!"}
            type="error"
          />,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            className: "toast_login",
            closeButton: false,
            hideProgressBar: true,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            transition: Zoom,
          }
        );
      }
    } catch (err) {
      toast(
        <CustomToast
          title={"Something went wrong please try again later!"}
          type="error"
        />,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          className: "toast_login",
          closeButton: false,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          transition: Zoom,
        }
      );
    }
  };

  async getData() {
    try {
      let self = this;
      this.setState({
        isLoading: true,
        isLoadingTable: true,
      });
      const idJob = this.props.match.params.id;

      let jobDetail = api.get(`/api/admin/jobs/${idJob}`);
      let candiadateToJob = api.get(`/api/candidate/job/${idJob}`);
      let getLane = api.get(`/api/lanes`);
      let historyJob = api.post(`/api/history/job`, { idJob: idJob });
      let user = api.get(`/api/trello/user`);
      const [
        dataJob,
        dataCanidate,
        dataLane,
        dataHistory,
        dataUser,
      ] = await Promise.all([
        jobDetail,
        candiadateToJob,
        getLane,
        historyJob,
        user,
      ]);
      if (dataJob && dataCanidate) {
        self.setState({
          isLoading: false,
          isLoadingTable: false,
          data: dataJob.data,
          dataCandidate: dataCanidate.data.list,
          viewCandidate: dataCanidate.data.list.slice(
            0,
            this.state.numberInPage
          ),
          totalRow: dataCanidate.data.list.length,
          isDisplay: dataCanidate.data.list.length === 0,
          arrayLane: dataLane.data.lane,
          laneSelected: _.map(dataLane.data.lane, lane => {
            return {
              value: lane.id,
              label: lane.nameColumn
            }
          }),
          dataHistory: dataHistory.data.historyJob,
          users: dataUser.data.list.map((user) => {
            return {
              userId: user.id,
              label: user.email,
              name: user.name,
              linkAvatar: user.linkAvatar,
            };
          }),
        });
        if (dataJob.data.token) {
          let urlNew = `${dataJob.data.token}?jobId=${idJob}`;
          this.shortAndCopyLink(urlNew)
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  shortAndCopyLink = async (string) => {
    console.log(string)
    try {
      const dataSend = {
        link: string
      }
      const linkShort = await api.post(`/api/v1/short-link`, dataSend);
      if (linkShort) {
        console.log(linkShort)
        this.setState({
          linkShort: linkShort.data.url
        })
      }
    } catch (error) {

    }
  }

  async getDataCandidate() {
    try {
      let self = this;
      this.setState({
        isLoadingTable: true,
      });
      const idJob = this.props.match.params.id;
      let { numberInPage, pageNumber } = this.state;
      let response = await api.get(`/api/candidate/job/${idJob}`);
      if (response) {
        setTimeout(() => {
          self.setState({
            // isLoading: false,
            dataCandidate: response.data.list,
            viewCandidate: response.data.list.slice(
              (pageNumber - 1) * numberInPage,
              (pageNumber - 1) * numberInPage + numberInPage
            ),
            totalRow: response.data.list.length,
            isDisplay: response.data.list.length === 0,
          });
        }, 200);
        setTimeout(() => {
          self.setState({
            isLoadingTable: false,
          });
        }, 800);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handlePagination(page) {
    let { numberInPage, dataCandidate, candidateFilter } = this.state;
    let dataPaginate = dataCandidate

    if (!_.isEmpty(candidateFilter)) {
      dataPaginate = candidateFilter;
    }


    let viewCandidate = dataPaginate.slice(
      (page - 1) * numberInPage,
      (page - 1) * numberInPage + numberInPage
    );
    await this.setState({
      viewCandidate,
      pageNumber: page,
    });
  }
  async getUserAssign() {
    // dung để lấy danh sách các user để assign
    try {
      let response = await api.get(`/api/assign/list/user`);
      if (response.data.success) {
        this.setState({
          userAssign: response.data.user,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getDataUserAssignJob() {
    // dung để lấy thông tin user được assign vào job
    try {
      const idJob = this.props.match.params.id;
      let response = await api.get(`/api/assignment/job/${idJob}`);
      if (response.data.success) {
        this.setState({
          dataUserAssignJob: response.data.result,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleOnchange = async (event) => {
    this.setState({
      isLoadingAssign: true,
    });
    const idJob = this.props.match.params.id;
    const { dataUserAssignJob } = this.state;
    let check = dataUserAssignJob.find((item) => {
      return item.userId === event.value;
    });
    if (check) {
      toast.error("User has been assigned", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setState({
        isLoadingAssign: false,
      });
    } else {
      try {
        let response = await api.post(`/api/assignment/job/${idJob}`, {
          userId: event.value,
        });
        if (response.data.success) {
          if (!response.data.result.isReload) {
            let result = response.data.result;
            dataUserAssignJob.push(result);
            this.setState({
              isLoadingAssign: false,
              dataUserAssignJob,
            });
          } else {
            this.getDataUserAssignJob();
            this.setState({
              isLoadingAssign: false,
            });
          }
        }
      } catch (err) {
        this.setState({
          isLoadingAssign: false,
        });
        toast(
          <CustomToast
            title={"Something went wrong please try again later!"}
            type="error"
          />,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            className: "toast_login",
            closeButton: false,
            hideProgressBar: true,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            transition: Zoom,
          }
        );
        console.log(err);
      }
    }
  };

  toggleCandidateDetail(isShow) {
    this.setState({
      isOpenCandidateDetail: isShow,
    });
  }

  toggleCandidateAddCard(isShow) {
    this.setState({
      isOpenCandidateCard: isShow,
    });
  }

  toggleCardTrelo(isShow) {
    this.setState({
      isOpenCardTrello: isShow,
    });
  }

  async getCandidateDetail(id) {
    try {
      let self = this;
      const response = await api.get(`/api/detail/candidate/${id}`);
      if (response) {
        this.setState(
          {
            candidateInfor: response.data,
          },
          () => {
            self.toggleCandidateDetail(true);
          }
        );
      }
    } catch (error) {
      console.log("err while get candidate detail: ", error);
    }
  }

  async getCardDetail(id) {
    try {
      let self = this;
      const response = await api.get(`/api/cards/${id}`);
      console.log(response.data);
      if (response) {
        this.setState(
          {
            cardTrello: response.data.card,
            userCard: response.data.card.CardUsers.map((e) => {
              return {
                ...e.User,
                userId: e.User.id,
              };
            }),
          },
          () => {
            self.toggleCardTrelo(true);
          }
        );
      }
      this.previewPdf(id);
    } catch (error) {
      console.log("err while get card detail: ", error);
    }
  }

  async getCandidateAddCard(id, idCandidateJob) {
    try {
      let self = this;
      const idJob = this.props.match.params.id;
      const response = await api.get(
        `/api/addCard/candidate/${id}?idJob=${idJob}&idCandidateJob=${idCandidateJob}`
      );
      if (response) {
        this.setState(
          {
            candidateCard: response.data,
          },
          () => {
            self.toggleCandidateAddCard(true);
          }
        );
      }
      this.previewPdf(idCandidateJob);
    } catch (error) {
      console.log("err while get candidate detail: ", error);
    }
  }
  successCopy = () => {
    toast(<CustomToast title={"Copied to clipboard!"} />, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 3000,
      className: "toast_login",
      closeButton: false,
      hideProgressBar: true,
      newestOnTop: true,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      // transition: Zoom,
    });
  };

  toggleDeleteUserPop(index) {
    let self = this;
    const isShow = this.state.isOpenDeleteUserPop[index];
    let currentIsOpenDeleteUserPop = new Array(10).fill(false);
    this.setState(
      {
        isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
      },
      function () {
        currentIsOpenDeleteUserPop[index] = !isShow;
        self.setState({
          isOpenDeleteUserPop: currentIsOpenDeleteUserPop,
        });
      }
    );
  }

  toggleAssignUser = () => {
    this.setState({
      showAssignUser: !this.state.showAssignUser,
    });
  };

  async getUserBitlink() {
    // thông tin link bitly của member
    try {
      const idJob = this.props.match.params.id;
      let response = await api.get(`/api/member/assign/${idJob}`);
      if (response.data.success) {
        this.setState({
          userBitlink: response.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async previewPdf(candidateJobId) {
    try {
      this.setState({
        isLoadingPdf: true
      })
      const response = await api.get(
        `/api/v1/admin/preview/pdf/candidateJob/${candidateJobId}`
      );
      if (response) {
        this.setState({
          base64: response.data.base64,
          isLoadingPdf: false
        });
      }
    } catch (error) {
      console.log('hi')
      this.setState({
        base64: "",
        isLoadingPdf: false,
        isOpenPreviewPdf: false,
      });
    }
  }

  openPreviewPdfAndCloseCardTrello = () => {
    if (this.state.base64 !== "") {
      this.setState(
        {
          isOpenCardTrello: false,
          isOpenPreviewPdf: !this.state.isOpenPreviewPdf,
        },
        () => {
          if (!this.state.isOpenPreviewPdf) {
            this.setState({
              base64: "",
            });
          }
        }
      );
    } else {
      toast(
        <CustomToast
          title={"Cannot read file pdf please check again!"}
          type="error"
        />,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          className: "toast_login",
          closeButton: false,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          transition: Zoom,
        }
      );
    }
  };

  openPreviewPdfAndCloseCandidateCard = () => {
    if (this.state.base64 !== "") {
      this.setState(
        {
          isOpenCandidateCard: false,
          isOpenPreviewPdf: !this.state.isOpenPreviewPdf,
        },
        () => {
          if (!this.state.isOpenPreviewPdf) {
            this.setState({
              base64: "",
            });
          }
        }
      );
    } else {
      toast(
        <CustomToast
          title={"Cannot read file pdf please check again!"}
          type="error"
        />,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          className: "toast_login",
          closeButton: false,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          transition: Zoom,
        }
      );
    }
  };

  componentDidMount() {
    this.getData();
    this.getDataUserAssignJob();
    if (this.props.role === "Director" || this.props.role === "Leader") {
      this.getUserAssign();
    }
    if (this.props.role === "Member") {
      this.getUserBitlink();
    }
  }

  handleOnChangeLane = (e) => {
    const laneName = e ? e.label : null;
    const { dataCandidate } = this.state;
    const candidateFilter = [];
    if (laneName) {
      const filterCard = _.filter(dataCandidate, candidate => candidate.nameColumn === laneName);
      candidateFilter.push(...filterCard)
      this.setState({
        candidateFilter: candidateFilter
      }, () => {
        this.setState({
          viewCandidate: candidateFilter.slice(0, 5),
          totalRow: candidateFilter.length,
          isDisplay: candidateFilter.length === 0,
          pageNumber: 1,
        })
      })
    } else {
      this.setState({
        viewCandidate: dataCandidate.slice(0, 5),
        totalRow: dataCandidate.length,
        isDisplay: dataCandidate.length === 0,
        pageNumber: 1,
        candidateFilter: []
      })
    }
  }


  render() {
    const {
      data,
      viewCandidate,
      arrLoading,
      arrLoadingTwo,
      userAssign,
      dataUserAssignJob,
      isLoadingAssign,
      arrayLane,
      laneSelected
    } = this.state;
    let aboutClient = "";
    let desc = `<div></div>`;
    if (data.client) {
      aboutClient = data.client.about;
    }
    if (Object.keys(data).length > 0) {
      let descData =
        data.aboutFetch +
        aboutClient +
        data.responsibilities +
        data.requirement +
        data.niceToHave +
        data.benefit;
      desc = `<div>${descData}</div>`;
    }

    const optUser = userAssign.map((user) => {
      return { label: user.name, value: user.id };
    });


    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <HistoryJob
          show={this.state.isShowHistoryJob}
          onHide={this.toggleHistory.bind(this, false)}
          dataHistory={this.state.dataHistory}
        />
        <ModalTransition>
          {this.state.isOpen && (
            <Modal
              actions={[
                { text: "Delete", onClick: this.deleteUserAssign },
                { text: "Cancel", onClick: this.closeModelDelete },
              ]}
              onClose={this.closeModelDelete}
              heading="Are you sure you want to delete this user?"
              appearance="warning"
            ></Modal>
          )}
        </ModalTransition>

        <CandidateCard
          data={this.state.candidateCard}
          show={this.state.isOpenCandidateCard}
          lane={arrayLane}
          onHide={this.toggleCandidateAddCard.bind(this, false)}
          role={this.props.role}
          resetCandidateAddCard={this.getDataCandidate.bind(this)}
          openPreviewPdfAndCloseCandidateCard={this.openPreviewPdfAndCloseCandidateCard.bind(
            this
          )}
          base64={this.state.base64}
          users={this.state.users}
          // previewPdf={this.previewPdf.bind(this)}
          isLoadingPdf={this.state.isLoadingPdf}
        />

        <CardTrello
          data={this.state.cardTrello}
          userCard={this.state.userCard}
          users={this.state.users}
          show={this.state.isOpenCardTrello}
          lane={arrayLane}
          base64={this.state.base64}
          onHide={this.toggleCardTrelo.bind(this, false)}
          resetCandidateAddCard={this.getDataCandidate.bind(this)}
          openPreviewPdfAndCloseCardTrello={this.openPreviewPdfAndCloseCardTrello.bind(
            this
          )}
          isLoadingPdf={this.state.isLoadingPdf}
        // previewPdf={this.previewPdf.bind(this)}
        />

        <CandidateDetail
          data={this.state.candidateInfor}
          show={this.state.isOpenCandidateDetail}
          onHide={this.toggleCandidateDetail.bind(this, false)}
        />
        {this.state.base64 && this.state.isOpenPreviewPdf ? (
          <PreviewPdf
            show={this.state.isOpenPreviewPdf}
            base64={this.state.base64}
            onHide={this.openPreviewPdfAndCloseCardTrello.bind(this)}
          />
        ) : (
          ""
        )}

        <div className="content d-flex flex-column flex-column-fluid p-0">
          {this.state.isLoading ? <Fbloader /> : null}
          <ToastContainer />
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <NavLink to="/" className="text-muted">
                        Fetch admin
                      </NavLink>
                    </li>
                    <li className="breadcrumb-item">
                      <NavLink to="/job" className="text-muted">
                        Job
                      </NavLink>
                    </li>
                    <li className="breadcrumb-item">
                      <span
                        className="text-muted"
                        style={{ cursor: "pointer" }}
                      >
                        Job detail
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>

          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="d-flex mt-4">
                <div className="container p-0 d-flex dr_col">
                  {!this.state.isLoading ? (
                    <div className="col-xl-7 pl-0 prm_0">
                      <div className="card card-custom style-card-kitin">
                        <div className="card-header flex-wrap border-0 pt-6 pb-0">
                          <div className="card-title style-title-job">
                            <div className="contain-title-job dr_col">
                              <div className="title_job_detail">
                                <h3 className="m-0 ">{data.title}</h3>
                                <div className="text-muted font-weight-bold client_name">{data.client ? data.client.name : null}</div>
                              </div>
                              <div className="wrap_edit_job">
                                {
                                  data.token ? (
                                    <div className="mr-2">
                                      <CopyToClipboard
                                        text={
                                          this.state.linkShort
                                        }
                                        onCopy={this.successCopy}
                                      >
                                        <a className="link-short">{this.state.linkShort}</a>
                                      </CopyToClipboard>
                                    </div>
                                  ) : ''
                                }
                                <div className="mr-2">
                                  {this.props.role !== "Member" ? (
                                    <NavLink
                                      to={`/edit-job/${data.id}`}
                                      className="btn btn-primary font-weight-bolder"
                                      style={{ padding: "0.6rem 0.9rem" }}
                                    >
                                      Edit
                                    </NavLink>
                                  ) : null}
                                </div>
                                <div>
                                  <a
                                    href={`${domainServer}/api/download/job/${this.props.match.params.id}`}
                                    className="btn btn-light-primary font-weight-bold"
                                  >
                                    Download As PDF
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="style-info-job">
                              <div className="style-job-detail dorlar-job-detail p-0">
                                {data.salary ? (
                                  <span>
                                    <i className="fa fa-dollar-sign"></i>{" "}
                                    {data.salary}{" "}
                                  </span>
                                ) : null}
                              </div>
                              <div className="style-job-detail location-job-detail p-0">
                                {data.location ? (
                                  <span>
                                    {" "}
                                    <i className="fa fa-map-marker"></i>{" "}
                                    {data.location}{" "}
                                  </span>
                                ) : null}
                              </div>
                              <div className="style-job-detail calendar-job-detail p-0">
                                {data.location ? (
                                  <span>
                                    {" "}
                                    <i className="fa fa-clock"></i> {data.time}{" "}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card card-custom style-card-job">
                        <div className="card-header flex-wrap border-0 pt-5 pb-0">
                          <div className="assign-user-css">
                            {dataUserAssignJob.map((user, index) => {
                              if (!user.isFirst) {
                                return (
                                  <div key={index}>
                                    <Overlay
                                      show={
                                        this.state.isOpenDeleteUserPop[index]
                                      }
                                      target={this.showInfoMember[index]}
                                      placement="bottom"
                                      transition={false}
                                      rootClose={true}
                                      onHide={this.toggleDeleteUserPop.bind(
                                        this,
                                        index
                                      )}
                                    >
                                      <Popover id="popover-contained">
                                        <Popover.Content className="custom-popver-kitin">
                                          <p>{user.User.name}</p>
                                          {this.props.role === "Leader" ? (
                                            <span
                                              className="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon"
                                              title="Delete"
                                              onClick={() =>
                                                this.confirmDelete(
                                                  user.userId,
                                                  index
                                                )
                                              }
                                            >
                                              <span className="svg-icon svg-icon-md svg-icon-primary">
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
                                                    <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                    />
                                                    <path
                                                      d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z"
                                                      fill="#000000"
                                                      fillRule="nonzero"
                                                    />
                                                    <path
                                                      d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                                                      fill="#000000"
                                                      opacity="0.3"
                                                    />
                                                  </g>
                                                </svg>
                                              </span>
                                            </span>
                                          ) : null}
                                        </Popover.Content>
                                      </Popover>
                                    </Overlay>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={index}>
                                    <Overlay
                                      show={
                                        this.state.isOpenDeleteUserPop[index]
                                      }
                                      target={this.showInfoMember[index]}
                                      placement="bottom"
                                      transition={false}
                                      rootClose={true}
                                      onHide={this.toggleDeleteUserPop.bind(
                                        this,
                                        index
                                      )}
                                    >
                                      <Popover id="popover-contained">
                                        <Popover.Content className="custom-popver-kitin">
                                          <p>{user.User.name}</p>
                                        </Popover.Content>
                                      </Popover>
                                    </Overlay>
                                  </div>
                                );
                              }
                            })}
                            {dataUserAssignJob.map((user, index) => {
                              return (
                                <div
                                  key={index}
                                  ref={(ref) =>
                                    (this.showInfoMember[index] = ref)
                                  }
                                  onMouseOver={this.toggleDeleteUserPop.bind(
                                    this,
                                    index
                                  )}
                                  className="btn btn-md btn-icon btn-pill mr-2 custom-pointer"
                                >
                                  {user.User.linkAvatar ? (
                                    <img
                                      src={`${domainServer}/${user.User.linkAvatar}`}
                                      className="h-100 align-self-end w-100"
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={defaultAva}
                                      className="h-100 align-self-end"
                                      alt=""
                                    />
                                  )}
                                </div>
                              );
                            })}

                            {this.state.isLoadingAssign ? (
                              <div
                                className="btn btn-md btn-icon btn-pill font-size-sm spinner spinner-primary spinner-left mr-2"
                                style={{
                                  cursor: "wait",
                                }}
                              ></div>
                            ) : null}

                            <PopoverPop
                              popperClassName="popover-modal-card"
                              trigger="legacy"
                              placement="bottom"
                              isOpen={this.state.showAssignUser}
                              target={`Popover-khanhdeptrai`}
                              toggle={this.toggleAssignUser}
                            >
                              <PopoverBody>
                                {this.state.isLoadingAssign ? (
                                  <Select
                                    options={optUser}
                                    onChange={this.handleOnchange}
                                    isDisabled
                                  />
                                ) : (
                                  <Select
                                    options={optUser}
                                    onChange={this.handleOnchange}
                                  />
                                )}
                              </PopoverBody>
                            </PopoverPop>

                            <div
                              id={`Popover-khanhdeptrai`}
                              className={
                                this.props.role === "Member"
                                  ? "btn btn-md btn-icon btn-light-facebook btn-pill mr-2 off-button-add-user"
                                  : "btn btn-md btn-icon btn-light-facebook btn-pill mr-2"
                              }
                              data-toggle="tooltip"
                              title=""
                              data-original-title="More users"
                            >
                              <i className="fas fa-plus"></i>
                            </div>
                          </div>

                          <div className="content-job">
                            {ReactHtmlParser(desc)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-xl-7 pl-0 prm_0">
                      <div className="card card-custom style-card-kitin">
                        <div className="card-header flex-wrap border-0 pt-6 pb-0">
                          <div className="card-title style-title-job">
                            <div className="contain-title-job dr_col">
                              <div style={{ width: "80%" }}>
                                <h3 className="m-0 pt-2">
                                  <Skeleton height={24} />
                                </h3>
                              </div>
                              <div
                                style={{
                                  width: "20%",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <div>
                                  <Skeleton height={24} />
                                </div>
                              </div>
                            </div>
                            <div className="style-info-job">
                              <div className="style-job-detail dorlar-job-detail pr-3">
                                <Skeleton height={22} />
                              </div>
                              <div className="style-job-detail location-job-detail pr-3">
                                <Skeleton height={22} />
                              </div>
                              <div className="style-job-detail calendar-job-detail pr-3">
                                <Skeleton height={22} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card card-custom style-card-job">
                          <div className="card-header flex-wrap border-0 pt-5 pb-0">
                            {arrLoadingTwo.map((item, index) => {
                              return (
                                <div className="content-job" key={index}>
                                  <Skeleton height={20} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-xl-5 p-0">
                    <div className="card card-custom">
                      <div className="card-header flex-wrap justify-content-center border-0 pt-6 pb-0">
                        List Candidate
                      </div>

                      {!this.state.isLoadingTable ? (
                        <div
                          className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                          id="kt_datatable"
                          style={{
                            position: "static",
                            zoom: 1,
                            marginLeft: "12px",
                          }}
                        >
                          <div className="select-lane">
                            <Select
                              name="option"
                              isClearable
                              options={laneSelected}
                              placeholder="Select status ..."
                              onChange={this.handleOnChangeLane}
                            />
                          </div>
                          <table
                            className="datatable-table"
                            style={{ display: "block" }}
                          >
                            <thead className="datatable-head">
                              <tr
                                className="datatable-row"
                                style={{ left: "0px" }}
                              >
                                <th
                                  data-field="OrderID"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span style={{ width: "160px" }}>Name</span>
                                </th>
                                {/* <th
                                  data-field="ShipDate"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span style={{ width: "68px" }}>
                                    Date
                                  </span>
                                </th> */}
                                <th
                                  data-field="ShipDate"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span style={{ width: "130px" }}>
                                    Follower
                                  </span>
                                </th>
                                <th
                                  data-field="Actions"
                                  data-autohide-disabled="false"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span
                                    style={{
                                      width: "120px",
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    Actions
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="datatable-body" style={{}}>
                              {viewCandidate.map((candidate, index) => {
                                if (candidate.isAddCard) {
                                  return (
                                    <tr
                                      key={candidate.idCandidateJob}
                                      data-row={1}
                                      className="datatable-row datatable-row-even"
                                      style={{ left: "0px" }}
                                    >
                                      <td
                                        data-field="OrderID"
                                        aria-label="63868-257"
                                        className="datatable-cell"
                                      >
                                        <span
                                          style={{
                                            width: "160px",
                                            cursor: "pointer",
                                          }}
                                          onClick={this.getCardDetail.bind(
                                            this,
                                            candidate.idCandidateJob
                                          )}
                                        >
                                          {candidate.name}
                                        </span>
                                      </td>
                                      {/* <td
                                        data-field="ShipDate"
                                        aria-label="9/3/2017"
                                        className="datatable-cell"
                                      >
                                        <span style={{ width: "68px" }}>
                                          {moment(candidate.date).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </span>
                                      </td> */}
                                      <td
                                        className="datatable-cell"
                                      >
                                        <span style={{ width: "130px", fontSize: '12px' }}>
                                          {
                                            candidate.follower.map((follower, i) => {
                                              return (<p key={i}>{follower}</p>)
                                            })
                                          }
                                        </span>
                                      </td>
                                      <td
                                        data-field="Actions"
                                        data-autohide-disabled="false"
                                        aria-label="null"
                                        className="datatable-cell"
                                      >
                                        <span
                                          style={{
                                            width: "120px",
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <button
                                            className="btn btn-style-kitin kitin-card-trello-job hiden-kitin-column"
                                            style={{
                                              background: candidate.colorColumn,
                                              border: "none",
                                            }}
                                            onClick={this.getCardDetail.bind(
                                              this,
                                              candidate.idCandidateJob
                                            )}
                                            title={candidate.nameColumn}
                                          >
                                            {candidate.nameColumn}
                                          </button>
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <tr
                                      key={candidate.idCandidateJob}
                                      data-row={1}
                                      className="datatable-row datatable-row-even"
                                      style={{ left: "0px" }}
                                    >
                                      <td
                                        data-field="OrderID"
                                        aria-label="63868-257"
                                        className="datatable-cell"
                                      >
                                        <span
                                          style={{
                                            width: "160px",
                                            cursor: "pointer",
                                          }}
                                          onClick={this.getCandidateAddCard.bind(
                                            this,
                                            candidate.id,
                                            candidate.idCandidateJob
                                          )}
                                        >
                                          {candidate.name}
                                        </span>
                                      </td>

                                      <td
                                        data-field="ShipDate"
                                        aria-label="9/3/2017"
                                        className="datatable-cell"
                                      >
                                        <span style={{ width: "130px", fontSize: '12px' }}>
                                          {
                                            candidate.follower.map((follower, i) => {
                                              return (<p key={i}>{follower}</p>)
                                            })
                                          }
                                        </span>
                                      </td>
                                      <td
                                        data-field="Actions"
                                        data-autohide-disabled="false"
                                        aria-label="null"
                                        className="datatable-cell"
                                      >
                                        <span
                                          style={{
                                            width: "120px",
                                            display: "flex",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <button
                                            className="btn btn-light-warning font-weight-bold btn-style-kitin"
                                            onClick={this.getCandidateAddCard.bind(
                                              this,
                                              candidate.id,
                                              candidate.idCandidateJob
                                            )}
                                          >
                                            Add To Boards
                                          </button>
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
                              })}
                            </tbody>
                          </table>
                          <div className="datatable-pager datatable-paging-loaded fl_end mb-4 mr-2">
                            <Pagination
                              defaultPageSize={this.state.numberInPage}
                              current={this.state.pageNumber}
                              hideOnSinglePage={true}
                              showTitle={false}
                              onChange={this.handlePagination}
                              total={this.state.totalRow}
                              showLessItems={true}
                            />
                          </div>
                        </div>
                      ) : (

                        <div
                          className="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded"
                          id="kt_datatable"
                          style={{
                            position: "static",
                            zoom: 1,
                            marginLeft: "12px",
                          }}
                        >
                          <table
                            className="datatable-table"
                            style={{ display: "block" }}
                          >
                            <thead className="datatable-head">
                              <tr
                                className="datatable-row"
                                style={{ left: "0px" }}
                              >
                                <th
                                  data-field="OrderID"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span style={{ width: "160px" }}>Name</span>
                                </th>

                                <th
                                  data-field="ShipDate"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span style={{ width: "130px" }}>
                                    Follower
                                  </span>
                                </th>
                                <th
                                  data-field="Actions"
                                  data-autohide-disabled="false"
                                  className="datatable-cell datatable-cell-sort"
                                >
                                  <span
                                    style={{
                                      width: "120px",
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    Actions
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="datatable-body">
                              {arrLoading.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    data-row={1}
                                    className="datatable-row datatable-row-even"
                                    style={{ left: "0px" }}
                                  >
                                    <td
                                      data-field="OrderID"
                                      aria-label="63868-257"
                                      className="datatable-cell"
                                    >
                                      <span style={{ width: "160px" }}>
                                        <Skeleton height={24} />
                                      </span>
                                    </td>

                                    <td
                                      data-field="ShipDate"
                                      aria-label="9/3/2017"
                                      className="datatable-cell"
                                    >
                                      <span style={{ width: "130px" }}>
                                        <Skeleton height={24} />
                                      </span>
                                    </td>
                                    <td
                                      data-field="ShipDate"
                                      aria-label="9/3/2017"
                                      className="datatable-cell"
                                    >
                                      <span style={{ width: "120px" }}>
                                        <Skeleton height={24} />
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="datatable-pager datatable-paging-loaded fl_end mb-4 mr-2">
                            <Pagination
                              defaultPageSize={this.state.numberInPage}
                              current={this.state.pageNumber}
                              hideOnSinglePage={true}
                              showTitle={false}
                              onChange={this.handlePagination}
                              total={this.state.totalRow}
                              showLessItems={true}
                            />
                          </div>
                        </div>
                      )}
                      {this.state.isDisplay ? (
                        <div className="d-flex flex-column style-no-result">
                          <img src="/img/no-result.png" alt="" />
                          <h3 className="pb-4">
                            No candidate has applied yet!
                          </h3>
                        </div>
                      ) : null}
                    </div>
                    {this.props.role === "Member" ? (
                      <div className="container p-0 mt-4">
                        <div className="card card-custom card-stretch gutter-b">
                          <div className="card-header border-0 justify-content-center">
                            <h3 className="card-title text-dark">Followers</h3>
                          </div>
                          <div className="card-body pt-0">
                            <div className="table-responsive mt-3">
                              <table className="table table-borderless table-vertical-center">
                                <thead>
                                  <tr className="d-flex">
                                    <th
                                      className="p-0"
                                      style={{ width: "40px" }}
                                    />
                                    <th
                                      className="p-0"
                                      style={{ minWidth: "60px" }}
                                    />
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td className="pl-0">
                                      <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                        Your link
                                      </span>
                                      <span className="text-muted font-weight-bold d-block pt-3">
                                        <OverlayTrigger
                                          key={`bottom-member`}
                                          placement={"top"}
                                          overlay={
                                            <Tooltip id={`tooltip-top`}>
                                              Click to copy
                                            </Tooltip>
                                          }
                                          popperConfig={{
                                            modifiers: {
                                              preventOverflow: {
                                                enabled: false,
                                              },
                                            },
                                          }}
                                        >
                                          <CopyToClipboard
                                            text={
                                              this.state.userBitlink.urlShort
                                            }
                                            onCopy={this.successCopy}
                                          >
                                            <span className="linkbitly-css">
                                              {this.state.userBitlink.urlShort}
                                            </span>
                                          </CopyToClipboard>
                                        </OverlayTrigger>
                                      </span>
                                    </td>
                                    <td className="pl-0">
                                      <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                        Click
                                      </span>
                                      <span className="text-muted font-weight-bold d-block pt-3">
                                        {this.state.userBitlink.totalClick}
                                      </span>
                                    </td>
                                    <td className="pl-0">
                                      <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                        Candidate
                                      </span>
                                      <span className="text-muted font-weight-bold d-block pt-3">
                                        {this.state.userBitlink.numberCandidate}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="container p-0 mt-4">
                        <div className="card card-custom card-stretch gutter-b">
                          <div className="card-header border-0 justify-content-center">
                            <h3 className="card-title text-dark">Followers</h3>
                          </div>
                          <div className="card-body pt-0">
                            <div className="table-responsive mt-3">
                              <table className="table table-borderless table-vertical-center">
                                <thead>
                                  <tr className="d-flex">
                                    <th
                                      className="p-0"
                                      style={{ width: "40px" }}
                                    />
                                    <th
                                      className="p-0"
                                      style={{ minWidth: "60px" }}
                                    />
                                    <th
                                      className="p-0"
                                      style={{ minWidth: "60px" }}
                                    />
                                  </tr>
                                </thead>

                                <tbody>
                                  {dataUserAssignJob.map((user, index) => {
                                    if (user.urlShort) {
                                      return (
                                        <tr key={user.id}>
                                          <td className="pl-0">
                                            <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                              {user.User.name}
                                            </span>
                                            <span className="text-muted font-weight-bold d-block pt-3">
                                              <OverlayTrigger
                                                key={`bottom-${index}`}
                                                placement={"top"}
                                                overlay={
                                                  <Tooltip id={`tooltip-top`}>
                                                    Click to copy
                                                  </Tooltip>
                                                }
                                                popperConfig={{
                                                  modifiers: {
                                                    preventOverflow: {
                                                      enabled: false,
                                                    },
                                                  },
                                                }}
                                              >
                                                <CopyToClipboard
                                                  text={user.urlShort}
                                                  onCopy={this.successCopy}
                                                >
                                                  <span className="linkbitly-css">
                                                    {user.urlShort}
                                                  </span>
                                                </CopyToClipboard>
                                              </OverlayTrigger>
                                            </span>
                                          </td>
                                          <td className="pl-0">
                                            <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                              Click
                                            </span>
                                            <span className="text-muted font-weight-bold d-block pt-3">
                                              {user.totalClick}
                                            </span>
                                          </td>
                                          <td className="pl-0">
                                            <span className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">
                                              Candidate
                                            </span>
                                            <span className="text-muted font-weight-bold d-block pt-3">
                                              {user.numberCandidate}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="container p-0 mt-4">
                      <div className="card card-custom card-stretch gutter-b">
                        <div className="card-header border-0 justify-content-center">
                          <h3 className="card-title text-dark">
                            Note from leader
                          </h3>
                        </div>

                        <div className="card-body pt-0">
                          <div className="form-group row">
                            <div className="col">
                              <label>Note</label>
                              <div>
                                <Form.Control
                                  as="textarea"
                                  name="note"
                                  type="text"
                                  rows="4"
                                  defaultValue={data.note || ""}
                                  className="form-control-solid"
                                  readOnly
                                  style={{ overflowY: "scroll" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col">
                              <label>Keyword</label>
                              <div>
                                <Form.Control
                                  as="textarea"
                                  name="keyword"
                                  type="text"
                                  rows="4"
                                  defaultValue={data.keyword || ""}
                                  className="form-control-solid"
                                  readOnly
                                  style={{ overflowY: "scroll" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col">
                              <label>Desc Job</label>
                              <div>
                                <Form.Control
                                  as="textarea"
                                  name="descJob"
                                  type="text"
                                  defaultValue={data.descJob || ""}
                                  rows="4"
                                  className="form-control-solid"
                                  readOnly
                                  style={{ overflowY: "scroll" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col">
                              <label>Interview Process</label>
                              <div>
                                <Form.Control
                                  as="textarea"
                                  name="interviewProcess"
                                  type="text"
                                  rows="4"
                                  defaultValue={data.interviewProcess || ""}
                                  className="form-control-solid"
                                  readOnly
                                  style={{ overflowY: "scroll" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col">
                              <label>Extra benefit</label>
                              <div>
                                <Form.Control
                                  as="textarea"
                                  name="extraBenefit"
                                  type="text"
                                  rows="4"
                                  defaultValue={data.extraBenefit || ""}
                                  className="form-control-solid"
                                  readOnly
                                  style={{ overflowY: "scroll" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={this.toggleHistory.bind(this, true)}
          className="btn-add-card-vip btn btn-primary"
        >
          <span className="card-vip__plus">
            <i
              style={{ paddingRight: "0" }}
              className="flaticon2-calendar-1 custom_icon_history"
            ></i>
          </span>
        </button>
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
  };
};

export default connect(mapStateToProps)(JobDetail);
