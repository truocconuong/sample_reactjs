import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import data from "./data.js";
import Column from "./Column.js";
import { DragDropContext } from "react-beautiful-dnd";
import AddCard from "./AddCard.js";
import DetailCard from "./DetailCard.js";
import Network from "../../Service/Network.js";
import _ from "lodash";
import Fbloader from "../libs/PageLoader/fbloader.js";
import { connect } from "react-redux";
import CreateInterviewCard from "./CreateInterviewCard.js";
import toastr from "toastr";
import roleName from "../../utils/const";
import DetailInterviewCard from "./DetailInterviewCard.js";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast";

const api = new Network();

const Container = styled.div`
  display: flex;
  overflow-x: auto;
`;

class Broad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_add_card: false,
      show_detail_card: false,
      card_selected: {
        content: {
          name: "",
          position: "",
          clientName: "",
          phone: "",
          email: "",
          location: "",
          approachDate: "",
          linkCv: "",
          nameJob: "",
          idJob: "",
          noteApproach: "",
          user: [],
          jobSelected: {},
          laneSelected: {},
        },
      },
      card_data_detail: {
        content: {
          name: "",
          position: "",
          clientName: "",
          phone: "",
          email: "",
          location: "",
          approachDate: "",
          linkCv: "",
          nameJob: "",
          idJob: "",
          noteApproach: "",
          user: [],
          jobSelected: {},
          laneSelected: {},
        },
      },

      data: {},
      data_real: {},
      jobs: [],
      users: [],
      lanes: [],
      isLoading: true,
      columnSelectedId: "",
      update: false,
      show_form_create_interview: false,
      show_form_detail_interview: false,
      isAddCardNoColumn: false,
    };
    this.open_add_card_form = this.open_add_card_form.bind(this);
    this.close_add_card_form = this.close_add_card_form.bind(this);
    this.open_detail_card = this.open_detail_card.bind(this);
    this.close_detail_card = this.close_detail_card.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.initData = this.initData.bind(this);
    this.initJob = this.initJob.bind(this);
    this.handleInputUpdateCard = this.handleInputUpdateCard.bind(this);
    this.toggleDetailCardAndInterview = this.toggleDetailCardAndInterview.bind(
      this
    );
    this.createInterview = this.createInterview.bind(this);
    this.open_add_card_form_no_column = this.open_add_card_form_no_column.bind(
      this
    );
    this.toggleDetailInterview = this.toggleDetailInterview.bind(this);
  }

  async createInterview(data) {
    try {
      const response = await api.post(`/api/admin/card/interview`, data);
      if (response) {
        toast(<CustomToast title={"Create interview successed !"} />, {
          position: toast.POSITION.TOP_CENTER,
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
        });

        this.setState({
          isLoading: true,
        });
        this.toggleDetailCardAndInterview();
        this.close_detail_card();
        this.initData();
      }
    } catch (error) {
      toast(
        <CustomToast title={"Interview time is overlapped !"} type={"error"} />,
        {
          position: toast.POSITION.TOP_CENTER,
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
  }

  toggleDetailCardAndInterview() {
    this.setState({
      show_detail_card: !this.state.show_detail_card,
      show_form_create_interview: !this.state.show_form_create_interview,
    });
  }

  toggleDetailInterview() {
    this.setState({
      show_detail_card: !this.state.show_detail_card,
      show_form_detail_interview: !this.state.show_form_detail_interview,
    });
  }

  toggleFormCreateInterview() {
    this.state({
      show_form_create_interview: !this.state.show_form_create_interview,
    });
  }

  handleInputUpdateCard(e) {
    let name = e.target.name;
    let value = e.target.value;
    const cardDataDetail = this.state.card_data_detail;
    _.assign(cardDataDetail.content, { [name]: value });
    this.setState({ card_data_detail: cardDataDetail });
  }

  updateCard = async () => {
    const { card_data_detail } = this.state;
    const content = card_data_detail.content;
    const data = {
      name: content.name,
      position: content.position,
      clientName: content.clientName,
      phone: content.phone,
      email: content.email,
      location: content.location,
      approachDate: content.approachDate,
      cv: content.linkCv,
      nameJob: content.nameJob,
      noteApproach: content.noteApproach,
      idJob: content.idJob,
    };
    const idCard = card_data_detail.id;
    try {
      const response = await api.patch(`/api/cards/${idCard}`, data);
      if (response) {
        toast(<CustomToast title={"Update card successed !"} />, {
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
        });
        this.initData();
        this.close_detail_card();
      }
    } catch (error) {
      if (error.error.data) {
        if (error.error.data.error === 'Cannot update candidate') {
          toast(<CustomToast title={"Email or phone already exists!"} type={'error'} />, {
            position: toast.POSITION.TOP_CENTER,
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
          });
        }
      }
    }
  };

  open_add_card_form(columnId) {
    // mo form add card
    this.setState({
      columnSelectedId: columnId,
      show_add_card: true,
    });
  }

  open_add_card_form_no_column() {
    // mo form add card
    this.setState({
      isAddCardNoColumn: true,
      show_add_card: true,
    });
  }

  close_add_card_form() {
    // dong form add card
    this.setState({
      isAddCardNoColumn: false,
      columnSelectedId: "",
      show_add_card: false,
    });
  }

  open_detail_card(cardId, columnTitle) {
    const card = this.state.data.cards[cardId];
    card.title = columnTitle;
    this.setState({
      show_detail_card: true,
      card_selected: _.cloneDeep(card),
      card_data_detail: _.cloneDeep(card),
    });
  }

  close_detail_card() {
    this.setState({
      show_detail_card: false,
    });
  }

  onDragEnd(result) {
    const { destination, source, draggableId } = result;
    let self = this;
    if (!destination || this.props.role === "Director") {
      return;
    }
    if (
      destination.droppableId === source.draggableId &&
      destination.index === source.index
    ) {
      return;
    }
    const start = this.state.data.columns[source.droppableId]; // cot bat dau keo
    const finish = this.state.data.columns[destination.droppableId]; // cot dich den
    if (start === finish) {
      // keo trong 1 cot
      const newCardIds = Array.from(start.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newCol = {
        ...start,
        cardIds: newCardIds,
      };

      const data = {
        ...self.state.data,
        columns: {
          ...self.state.data.columns,
          [newCol.id]: newCol,
        },
      };
      this.setState({
        data: data,
      });
    } else {
      // keo qua 2 cot khac nhau
      const startCardId = Array.from(start.cardIds); // list card trong cot bat dau
      startCardId.splice(source.index, 1); // xoa card ra khoi cot
      const newStart = {
        // update lai so card trong cot
        ...start,
        cardIds: startCardId,
      };

      const finishCardId = Array.from(finish.cardIds); // list card trong cot ket thuc
      finishCardId.splice(destination.index, 0, draggableId); // them card vao cot (draggableId la id cua card duoc keo)
      const newFinish = {
        // update lai so card trong cot
        ...finish,
        cardIds: finishCardId,
      };
      const data = {
        // ste lai state
        ...self.state.data,
        columns: {
          ...self.state.data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      this.setState({
        data: data,
      });
    }
    this.updateLaneOfCard(result);
  }

  updateLaneOfCard = async (result) => {
    const cardId = result.draggableId;
    const laneIdUpdate = {
      laneId: result.destination.droppableId,
    };
    try {
      await api.patch(`/api/cards/${cardId}`, laneIdUpdate);
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    this.initData();
    this.initJob();
    this.initUserTeam();
    this.offOverFlowY();
  }

  componentWillUnmount() {
    this.onOverFlowY();
  }

  offOverFlowY = () => {
    document.body.style["overflow-y"] = "hidden";
  };

  onOverFlowY = () => {
    document.body.style["overflow-y"] = "scroll";
  };

  async initData() {
    const data = {
      columns: {},
      cards: {},
      columnOrder: [],
    };
    try {
      const lanes = await api.get(`/api/admin/new/cards`);
      const columns = lanes.data.list;
      for (const column of columns) {
        data.columns[`${column.id}`] = {
          id: `${column.id}`,
          title: column.nameColumn,
          background: column.background,
          limit: 5,
          maximum: false,
          cardIds: _.map(column.CandidateJobs, (candidate) => candidate.id),
        };
        const cards = column.CandidateJobs;
        for (const card of cards) {
          const cardId = `${card.id}`;
          data.cards[cardId] = {
            id: cardId,
            content: {
              name: card.Candidate.name,
              position: card.position,
              clientName: !_.isNil(card.Job.Client) ? card.Job.Client.name : "",
              phone: card.Candidate.phone,
              email: card.Candidate.email,
              location: card.Job.Location.name,
              approachDate: card.approachDate,
              linkCv: card.cv,
              nameJob: card.Job.title,
              noteApproach: card.noteApproach,
              interview: card.Interview,
              idJob: card.jobId,
              jobSelected: {
                value: card.Job.title,
                label: card.Job.title,
              },
              user: _.map(card.Users, (user) => {
                return {
                  name: user.name,
                  id: user.id,
                  email: user.email,
                  linkAvatar: user.linkAvatar,
                };
              }),
            },
          };
        }
      }
      data.columnOrder = _.map(columns, (column) => `${column.id}`);
      this.setState({
        data: data,
        data_real: data,
        lanes: _.map(columns, (column) => {
          return {
            value: column.id,
            label: column.nameColumn,
          };
        }),
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({
      isLoading: false,
    });
  }

  async initJob() {
    try {
      const response = await api.get(`/api/trello/job/active`);
      if (response) {
        const data = response.data.arrJob;
        const jobs = _.map(data, (item) => {
          return {
            id: item.id,
            value: item.title,
            label: item.title,
            clientName: !_.isNil(item.Client) ? item.Client.name : "",
            locationName: !_.isNil(item.Location.name)
              ? item.Location.name
              : "",
          };
        });
        this.setState({ jobs: jobs });
      }
    } catch (error) { }
  }

  initUserTeam = async () => {
    try {
      const response = await api.get(`/api/trello/user`);
      if (response) {
        const data = response.data.list;
        const users = _.map(data, (user) => {
          return {
            value: user.id,
            label: user.email,
            name: user.name,
            linkAvatar: user.linkAvatar,
          };
        });
        this.setState({
          users: users,
        });
      }
    } catch (error) { }
  };

  createCardToLane = async (item) => {
    const data = {
      ...item,
    };
    if (this.state.columnSelectedId !== "") {
      data.laneId = this.state.columnSelectedId;
    }
    try {
      const response = await api.post(`/api/cards`, data);
      if (response) {
        toast(<CustomToast title={"Create card successed !"} />, {
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
        });
        this.setState({
          isLoading: true,
        });
        this.close_add_card_form();
        this.initData();
      }
    } catch (error) {
      this.close_add_card_form();
      toast(<CustomToast title={"Card already exists !"} type={'error'} />, {
        position: toast.POSITION.TOP_CENTER,
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
      });
    }
  };
  addMemberToCard = async (dataUser) => {
    try {
      const response = await api.patch(
        `/api/cards/assignment/${dataUser.card_id}`,
        { userId: dataUser.content.id }
      );
      if (response) {
        const { data, card_selected } = this.state;
        data.cards[dataUser.card_id].content.user.push(dataUser.content);
        card_selected.content.user.push(dataUser.content);
        this.setState({
          card_selected: card_selected,
          update: !this.state.update,
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  removeMemberToCard = async (card_id, user_id) => {
    try {
      const response = await api.patch(
        `/api/cards/remove/assignment/${card_id}`,
        { userId: user_id }
      );
      if (response) {
        const { data, card_selected } = this.state;
        data.cards[card_id].content.user = _.filter(
          data.cards[card_id].content.user,
          (user) => user.id !== user_id
        );
        card_selected.content.user = _.filter(
          card_selected.content.user,
          (user) => user.id !== user_id
        );
        this.setState({ data: data, card_selected: card_selected });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleOnChangeJobSelected = (e) => {
    const data = this.state.card_selected;
    data.content.jobSelected = e;
    data.content.nameJob = e.value;
    data.content.idJob = e.id;
    data.content.clientName = e.clientName;
    data.content.location = e.locationName;
    console.log("isId", data);
    this.setState({
      card_data_detail: data,
    });
  };

  updateColumn = (cards, column) => {
    const { data } = this.state;
    const idCards = _.map(cards, (card) => card.id);
    data.columns[column.id].cardIds.push(...idCards);
    data.columns[column.id].limit = column.limit + 5;
    if (_.isEmpty(cards)) {
      data.columns[column.id].maximum = true;
    }
    for (const card of cards) {
      const cardId = `${card.id}`;
      data.cards[cardId] = {
        id: cardId,
        content: {
          name: card.Candidate.name,
          position: card.position,
          clientName: !_.isNil(card.Job.Client) ? card.Job.Client.name : "",
          phone: card.Candidate.phone,
          email: card.Candidate.email,
          location: card.Job.Location.name,
          approachDate: card.approachDate,
          linkCv: card.cv,
          nameJob: card.Job.title,
          noteApproach: card.noteApproach,
          interview: card.Interview,
          idJob: card.jobId,
          jobSelected: {
            value: card.Job.title,
            label: card.Job.title,
          },
          user: _.map(card.Users, (user) => {
            return {
              name: user.name,
              id: user.id,
              email: user.email,
              linkAvatar: user.linkAvatar,
            };
          }),
        },
      };
    }
    this.setState({
      data: data,
    });
  };

  render() {
    return (
      <div
        id="main-board"
        className={`d-flex flex-column flex-column-fluid ${this.props.className_wrap_broad} board`}
      >
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        {this.state.isLoading ? <Fbloader /> : null}
        <AddCard
          jobs={this.state.jobs}
          lanes={this.state.lanes}
          show={this.state.show_add_card}
          createCardToLane={this.createCardToLane}
          onHide={this.close_add_card_form}
          isAddCardNoColumn={this.state.isAddCardNoColumn}
        />
        <DetailCard
          show={this.state.show_detail_card}
          onHide={this.close_detail_card}
          data={this.state.card_selected}
          data_detail={this.state.card_data_detail}
          update={this.handleInputUpdateCard.bind(this)}
          updateCard={this.updateCard}
          handleOnChangeJobSelected={this.handleOnChangeJobSelected}
          jobs={this.state.jobs}
          removeMemberToCard={this.removeMemberToCard}
          users={this.state.users}
          updated={this.state.update}
          addMemberToCard={this.addMemberToCard}
          toggleDetailCardAndInterview={this.toggleDetailCardAndInterview}
          toggleDetailInterview={this.toggleDetailInterview}
        />

        <CreateInterviewCard
          show={this.state.show_form_create_interview}
          data={this.state.card_selected}
          createInterview={this.createInterview}
          onHide={this.toggleDetailCardAndInterview}
        />
        <DetailInterviewCard
          show={this.state.show_form_detail_interview}
          data={this.state.card_selected}
          onHide={this.toggleDetailInterview}
        />
        <div
          className="subheader py-3 py-lg-8 subheader-transparent"
          id="kt_subheader"
        >
          <div className="trello">
            <div className="d-flex align-items-center mr-1">
              <div className="d-flex align-items-baseline flex-wrap mr-5">
                <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-dark">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <div className="text-dark">List Cards</div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap"></div>
          </div>
        </div>
        <div className="d-flex flex-column-fluid trello-main">
          <div className="container_trello">
            {this.state.data.columnOrder ? (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Container>
                  {this.state.data.columnOrder.map((columnId, index) => {
                    const column = this.state.data.columns[columnId];
                    const cards = column.cardIds.map((cardId) => {
                      return this.state.data.cards[cardId];
                    });
                    return (
                      <Column
                        index={index}
                        key={columnId}
                        column={column}
                        cards={cards}
                        users={this.state.users}
                        open_add_card_form={this.open_add_card_form.bind(
                          this,
                          columnId
                        )}
                        open_detail_card={this.open_detail_card}
                        addMemberToCard={this.addMemberToCard}
                        removeMemberToCard={this.removeMemberToCard}
                        updateColumn={this.updateColumn}
                      />
                    );
                  })}
                </Container>
              </DragDropContext>
            ) : (
                ""
              )}
          </div>
        </div>

        {this.props.role !== roleName.DIRECTOR ? (
          <button
            type="button"
            className="btn-add-card-vip btn btn-primary"
            onClick={this.open_add_card_form_no_column}
          >
            <span className="card-vip__plus">+</span>
          </button>
        ) : (
            ""
          )}
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

export default connect(mapStateToProps)(Broad);
