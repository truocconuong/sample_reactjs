import React, { Component } from "react";
import dateFns from "date-fns";
import Network from "../../../Service/Network";
import moment from "moment";
import Interviews from "../../Modal/Dashboard/Interviews.js";
import DetailInterviewCard from "../../Modal/Dashboard/DetailInterviewCard.js";

import "./style.css";

const colors = ["#ee5253", "#27ae60", "#5f27cd", "#f368e0", "#ff6348"];
const api = new Network();
class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      startDateSchedule: moment().startOf("month"),
      endDateSchedule: moment().endOf("month"),
      calendar: {},
      listColor: new Array(10).fill(),
      showInterviews: false,
      data: [],
      show_form_detail_interview: false,
      interviewDetail: {},
    };
    this.getDataSchedule = this.getDataSchedule.bind(this);
    this.showInterviews = this.showInterviews.bind(this);
    this.toggleDetailInterview = this.toggleDetailInterview.bind(this);
  }
  toggleDetailInterview(isShow, data) {
    // console.log(data);
    this.setState({
      show_form_detail_interview: isShow,
      interviewDetail: isShow ? data : {},
      showInterviews: isShow ? false : true,
    });
  }
  async getDataSchedule() {
    try {
      const response = await api.get(
        `/api/admin/calendar/interview?start=${moment(
          this.state.startDateSchedule
        ).format("MM/DD/YYYY")}&end=${moment(this.state.endDateSchedule).format(
          "MM/DD/YYYY"
        )}`
      );
      if (response) {
        this.setState({
          calendar: response.data.calendar,
        });
        // console.log(response.data.calendar);
      }
    } catch (error) {
      console.log("err while fetch data schedule: ", error);
    }
  }

  renderHeader() {
    const dateFormat = "MMMM, YYYY";

    return (
      <div className="header row_calendar flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center col_flg_2">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "ddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center date_in_week" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row_calendar">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate, calendar } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell cell_cs ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() =>
              this.onDateClick(
                dateFns.parse(cloneDay),
                calendar[moment(cloneDay).format("DD/MM/YYYY")]
              )
            }
          >
            {!dateFns.isSameMonth(day, monthStart) ? null : (
              <>
                <div className="number">{formattedDate}</div>
                {calendar[moment(day).format("DD/MM/YYYY")] ? (
                  <div className="wrap_dot_interview">
                   

                    {calendar[moment(day).format("DD/MM/YYYY")].interviews.map(
                      (interview, index) => {
                        if (index < 3) {
                          return (
                            <div
                              key={index}
                              className="label  label-dot cs_dot"
                              style={{ backgroundColor: colors[index] }}
                            ></div>
                          );
                        } else if (
                          index ==
                          calendar[moment(day).format("DD/MM/YYYY")].interviews
                            .length -
                            1
                        ) {
                          return (
                            <img  key={index} className="icon_more" src="/img/more.png" />
                          );
                        } else {
                          return null;
                        }
                      }
                    )}
                  </div>
                ) : (
                  <div className="wrap_dot_interview"></div>
                )}
              </>
            )}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row_calendar" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = (day, data) => {
    this.setState(
      {
        selectedDate: day,
        data: data ? data.interviews : [],
      },
      function () {
        if (data) {
          this.showInterviews(true);
        }
      }
    );
  };

  nextMonth = () => {
    // startDateSchedule: moment().startOf("month"),
    //   endDateSchedule: moment().endOf("month"),
    this.setState(
      {
        currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
        startDateSchedule: moment(
          dateFns.addMonths(this.state.currentMonth, 1)
        ).startOf("month"),
        endDateSchedule: moment(
          dateFns.addMonths(this.state.currentMonth, 1)
        ).endOf("month"),
      },
      function () {
        this.getDataSchedule();
      }
    );
  };

  prevMonth = () => {
    this.setState(
      {
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
        startDateSchedule: moment(
          dateFns.subMonths(this.state.currentMonth, 1)
        ).startOf("month"),
        endDateSchedule: moment(
          dateFns.subMonths(this.state.currentMonth, 1)
        ).endOf("month"),
      },
      function () {
        this.getDataSchedule();
      }
    );
  };
  showInterviews(isShow) {
    this.setState({
      showInterviews: isShow,
    });
  }
  componentDidMount() {
    this.getDataSchedule();
  }
  render() {
    const data = this.props.data;
    return (
      <div className="col-xl-4 plm_0 prm_0">
        <DetailInterviewCard
          show={this.state.show_form_detail_interview}
          data={this.state.interviewDetail}
          onHide={this.toggleDetailInterview.bind(this, false)}
        />
        <Interviews
          show={this.state.showInterviews}
          data={this.state.data}
          onHide={this.showInterviews.bind(this, false)}
          toggleDetailInterview={this.toggleDetailInterview}
        />
        <div className="card card-custom card-stretch gutter-b">
          <div className="card-header card-header-mobile border-0 pt-5">
           
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">
                Interview Schedule
              </span>
             
            </h3>
          </div>
          
          <div className="card-body calendar-body-card  pt-0">
            <div>
              <div className="">
                <div className="calendar">
                  {this.renderHeader()}
                  {this.renderDays()}
                  {this.renderCells()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
