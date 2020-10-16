import React, { Component } from "react";
import Main from "./Components/Main";
import withAuth from "./Service/withAuth";

class App extends Component {
  render() {
    return <Main></Main>;
  }
}

export default withAuth(App);
