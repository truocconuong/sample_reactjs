import React, { Component } from "react";
import Main from "./Components/Main.js";
import withAuth from "./Service/withAuth";
console.warn = () => {}

class App extends Component {
  
  render() {
    return <Main></Main>;
  }
}

export default withAuth(App);
