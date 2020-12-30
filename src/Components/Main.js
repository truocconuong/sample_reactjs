import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "../routes";
import MenuLeft from "./Menu/MenuLeft.js";
import MenuResponsive from "./Menu/MenuResponsive.js";

class Main extends Component {
  showContentMenu = (routes) => {
    var result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        );
      });
    }
    return result;
  };
  componentDidMount(){
    // console.log(window.innerWidth)
  }
  render() {
    return (
      <Router>
        <div className="d-flex wrap_all">
          <MenuResponsive />
          <MenuLeft classHide={"hide_menu_left"}/>

          <Switch>{this.showContentMenu(routes)}</Switch>
        </div>
      </Router>
    );
  }
}

export default Main;
