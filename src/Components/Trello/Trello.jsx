import React, { Component } from "react";
import Network from '../../Service/Network';
import {Link} from 'react-router-dom';
import Board from "react-trello";
import "./style.css";
import MyCard from "./Card/Card";
import NewCardForm from "./Card/NewCardForm";
import CardDetail from "./Card/CardDetail";
const moment = require("moment");
const api = new Network();

const handleDragStart = (cardId, laneId) => {
  console.log("drag started");
  console.log(`cardId: ${cardId}`);
  console.log(`laneId: ${laneId}`);
  console.log("==================");
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  try{
    let data = {
      laneId: targetLaneId
    }
    const card = api.put(`/cards/${cardId}`, data);
  }catch(err){
    console.log(err);
  }
};

const components = {
  Card: MyCard,
  NewCardForm: NewCardForm
};

class Trello extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        lanes: [
          {
            id: "pendding",
            title: "Pendding",
            cards: [],
          },
          {
            id: "approach",
            title: "Approach",
            cards: [],
          },
          {
            id: "sent_jd",
            title: "Sent JD",
            cards: [],
          },
          {
            id: "check_eng",
            title: "Check Eng",
            cards: [],
          },
          {
            id: "screen_cv",
            title: "Screen CV",
            cards: [],
          },
          {
            id: "schedule",
            title: "Schedule",
            cards: [],
          },
          {
            id: "interview_online",
            title: "Interview Set Up Online",
            cards: [],
          },
          {
            id: "interview_f2f",
            title: "Interview Set Up F2F",
            cards: [],
          },
          {
            id: "testing",
            title: "Testing",
            cards: [],
          },
          {
            id: "consider",
            title: "Considering",
            cards: [],
          },
          {
            id: "inform_fail",
            title: "Inform Failure",
            cards: [],
          },
          {
            id: "benefit_deal",
            title: "Benefit Deal",
            cards: [],
          },
          {
            id: "offer_confirmation",
            title: "Offer Confirmation Waiting",
            cards: [],
          },
          {
            id: "onboard",
            title: "Onboarding",
            cards: [],
          },
          {
            id: "done",
            title: "Done",
            cards: [],
          },
          {
            id: "fail_approach_screen",
            title: "Fail Approach Or Screen Cv",
            cards: [],
          },
          {
            id: "fail_interview",
            title: "Fail Interview",
            cards: []
          },
          {
            id: "cancel_interview",
            title: "Cancelled Interview",
            cards: []
          },
          {
            id: "cancel_offer_fail_benefit",
            title: "Cancel Offer Or Fail Benefit Deal",
            cards: []
          },
          {
            id: "contract_prepare",
            title: "Cancel Offer Or Fail Benefit Deal",
            cards: []
          },
          {
            id: "contract_done",
            title: "Contract Done",
            cards: []
          },

        ],
      }
    };
  }


  getData = async () => {
    try {
        const data = await api.get(
            `/api/cards`
        );
        let arr_card_one = [];
        let arr_card_two = [];
        let arr_card_three = [];
        data.map(item => {

          let array_tag = item.users.map((user) => {
            return {
              title: user.username,
              style: { backgroundColor: user.color, color: 'white'}
            }
          })

          let card = {
            id: String(item.id),
            laneId: item.laneId,
            title: item.title,
            name: item.name,
            tags: array_tag,
            email: item.email,
            phone: item.phone,
            cardStyle: { "width": 300, "margin": "auto", "marginBottom": 5 },
            label: moment(moment.utc(item.created_at)).local().format("DD/MM/YYYY")
          }

          this.state.data.lanes.forEach((el, index) => {
              if(el.id === item.laneId){
                this.state.data.lanes[index].cards.push(card);
              }
          })
          let data_tempt = this.state.data;
          this.setState({
            data: data_tempt
          })
          // if(item.laneId === "pendding"){
          //   arr_card_one.push(card);
          // }
          // if(item.laneId === "approach"){
          //   arr_card_two.push(card);
          // }
          // if(item.laneId === "done"){
          //   arr_card_three.push(card);
          // }          
        })
        // console.log(this.state.data);
        // let data_tempt = this.state.data;
        // data_tempt.lanes[0].cards = arr_card_one;
        // data_tempt.lanes[1].cards = arr_card_two;
        // data_tempt.lanes[2].cards = arr_card_three;
        // this.setState({
        //   data: data_tempt
        // })
        
        
    } catch (error) {
        console.log(error)
    }
  }

  handleCardAdd = (card, laneId) => {
    try{
      let user = JSON.parse(localStorage.getItem('user'));
      let data = {
        title: card.title,
        name: card.name,
        email: card.email,
        phone: card.phone,
        laneId: laneId,
        users: [user.idUser]
      }
      const card_Result = api.post(`/cards`, data);
      if(card_Result){
        console.log("thanh cong");
      }else{
        console.log("that bai");
      }
    }catch(err){
      console.log(err);
    }
  };
  onCardClick = (cardId, metadata, laneId) => {
    this.refs.detail_card.getDataCardDetail(cardId, true);
  }

  onCardDelete = (cardId, laneId) => {
    
  }



  completeCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'COMPLETED',
      card: {
        id: 'Milk',
        title: 'Buy Milk',
        label: '15 mins',
        description: 'Use Headspace app',
      },
    })
    this.state.eventBus.publish({
      type: 'REMOVE_CARD',
      laneId: 'PLANNED',
      cardId: 'Milk',
    })
  }

  addCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'BLOCKED',
      card: {
        id: 'Ec2Error',
        title: 'EC2 Instance Down',
        label: '30 mins',
        description: 'Main EC2 instance down',
      },
    })
  }
  componentDidMount(){
      this.getData();
  }

  render() {
    return (
      <div
        className="main-content trello-con"
        id="panel"
        style={{ backgroundColor: "#CFE0F7" }}
      >
        <div className="header bg-primary cus-bg-primary">
          <div className="container-fluid">
            <div className="header-body">
              <div
                className="row align-items-center"
                style={{ paddingTop: "12px" }}
              >
                <div className="col-lg-6 col-7 " style={{ paddingLeft: "0" }}>
                  {/* <h6 className="h2 text-white d-inline-block mb-0">List Jobs</h6> */}
                  <nav
                    aria-label="breadcrumb"
                    className="d-none d-md-inline-block "
                  >
                    <ol className="breadcrumb breadcrumb-links breadcrumb-dark cus-breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/trello">Leader</Link>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Board
          components={components}
          data={this.state.data}
          draggable
          editable
          onLaneAdd={this.onLaneAdd}
          onCardAdd={this.handleCardAdd}
          onCardClick={this.onCardClick}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          style={{ backgroundColor: "rgb(207, 224, 247)" }}
          tagStyle={{fontSize: '80%'}}
        />
        <CardDetail ref="detail_card"></CardDetail>
      </div>
    );
  }
}

export default Trello;
