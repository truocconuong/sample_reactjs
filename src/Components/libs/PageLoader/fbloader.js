import React, { Component } from "react";
import "./style.css";

export default class Fbloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classLoading: "load-csx-fb",
    };
    this.toggleLoading = this.toggleLoading.bind(this);
  }
  toggleLoading() {
    this.setState({
      classLoading: "load-csx-fb go_down",
    });
  }
  componentWillMount() {
    this.toggleLoading();
  }

  render() {
    return (
      <div className="wrap_fb_loader">
        <div className={"page-load-mg"}>
          <div className={this.state.classLoading}>
            <div
              className="btn btn-light btn-shadow btn-sm font-weight-bold font-size-sm spinner spinner-primary spinner-left"
              style={{ cursor: "wait" }}
            >
              Please wait...
            </div>
          </div>
        </div>
      </div>
    );
  }
}
