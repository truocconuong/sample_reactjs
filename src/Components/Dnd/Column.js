import React, { Component } from "react";
import styled from "styled-components";
import Card from "./Card.js";
import { Droppable } from "react-beautiful-dnd";
import roleName from "../../utils/const";
import { connect } from "react-redux";
import Network from "../../Service/Network.js";
import _ from 'lodash'
const api = new Network();

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  background-color: #ebecf0;
  max-height: 100%;
  overflow-y: auto;
`;
const Title = styled.h3`
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;
const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  height: 75vh;
  overflow-y: auto;
`;

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      heightOfTaskList: 0,
      hasNextPage: true,
    };
    this.scrollCol = null;
  }

  getDataColumn = async (column) => {
    let url = `/api/admin/cards/${column.id}/lane?offset=${column.limit}`;
    const search = this.props.search
    for (const key in search) {
      if (!_.isNil(search[key]) && search[key] !== '') {
        console.log(search[key])
        const character = url.indexOf('?') === -1 ? '?' : '&'
        url += `${character}${[key]}=${search[key]}`
        // 
      }
    }
    console.log('checker', url)
    const response = await api.get(
      url
    );
    if (response) {
      const data = response.data.list;
      this.props.updateColumn(data, column);
      this.setState({
        loadMore: false,
        hasNextPage: response.data.list.length == 0 ? false : true
      });
      console.log(response.data.list.length)
    }
  };

  loadMoreLane = (column) => {
    this.setState({
      loadMore: true,
    });
    this.getDataColumn(column);
  };

  // tracking scroll
  componentDidMount() {
    this.scrollCol = document.getElementById(this.props.column.id);
  }

  componentWillUnmount() { }

  onScroll = (e) => {
    // offsetHeight chieu cao cua div TaskList
    // scrollHeight chieu cao thuc cua scroll div
    const scrollTop = Number(e.target.scrollTop.toFixed(0))
    if (
      this.scrollCol.scrollHeight - Math.floor(scrollTop + this.scrollCol.offsetHeight) <= 1 && this.state.hasNextPage
    ) {
      this.loadMoreLane(this.props.column);
    }
  };
  // end tracking scroll
  render() {
    return (
      <Container className="board-column">
        <div
          style={{ background: this.props.column.background }}
          className="make-color"
        ></div>
        <Title className="board-column-title">
          <div>{this.props.column.title}</div>
          {this.props.role !== roleName.DIRECTOR ? (
            <div
              className="wrap_add_icon"
              onClick={this.props.open_add_card_form}
            >
              <img className="add_icon" src="/img/plus.png" />
            </div>
          ) : (
              ""
            )}
        </Title>
        <Droppable
          style={{ overflow: "hidden" }}
          droppableId={this.props.column.id}
        >
          {(provided) => (
            <TaskList
              id={this.props.column.id}
              onScroll={(e) => this.onScroll(e)}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.props.cards.map((card, index) => {
                return (
                  <Card
                    lanes={this.props.lanes}
                    removeMemberToCard={this.props.removeMemberToCard}
                    addMemberToCard={this.props.addMemberToCard}
                    users={this.props.users}
                    index={index}
                    key={index}
                    card={card}
                    open_detail_card={this.props.open_detail_card.bind(
                      this,
                      card.id,
                      this.props.column.title
                    )}
                    actionUpdateColumn={this.props.actionUpdateColumn}
                    storageCard={this.props.storageCard}
                    background={this.props.column.background}
                    createLabel={this.props.createLabel}
                    removeLabel={this.props.removeLabel}
                    labels = {this.props.labels}
                  />
                );
              })}
              {provided.placeholder}
              <div className="loadmore-card">
                {this.props.cards.length > 4 && !this.props.column.maximum ? (
                  <div>
                    <div
                      className="btn btn-light btn-shadow btn-sm font-weight-bold font-size-sm spinner spinner-primary spinner-left"
                      style={{ cursor: "wait" }}
                    >
                      Please wait...
                    </div>
                  </div>
                ) : null}
              </div>
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
  };
};

export default connect(mapStateToProps)(Column);
