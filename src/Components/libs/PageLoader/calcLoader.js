import React, { Component } from "react";
import "./style.css";
import { CircleSpinner } from "react-spinners-kit";
export default class PageLoaCalcLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={this.props.show ? "load_calc_wrap" : "load_calc_wrap _load_hide"}
      >
        <div className="load-calc">
          <CircleSpinner color="#0f4837" size={40} />
        </div>
      </div>
    );
  }
}
