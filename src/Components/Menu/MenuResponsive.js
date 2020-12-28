import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import MenuLeft1 from "./MenuLeft.js";
import { Link } from "react-router-dom";


class MenuResponsive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }
  toggleDrawer(isShow) {
    this.setState({
      show: isShow,
    });
  }
  render() {
    return (
      <div id="kt_header_mobile" className="header-mobile">
        {/* <Drawer
          anchor={"left"}
          open={this.state.show}
          onClose={this.toggleDrawer.bind(this, false)}
        >
          <MenuLeft1 isMobile={true} hideMenuResponsive={this.toggleDrawer.bind(this, false)}/>
        </Drawer> */}
        <div className={this.state.show? "drawer_div" : "drawer_div drawer_hide"} onClick={this.toggleDrawer.bind(this,false)}>
          <MenuLeft1
            isMobile={true}
            hideMenuResponsive={this.toggleDrawer.bind(this, false)}
          />
        </div>
        <Link to="/">
          <img
            alt="Logo"
            src="/img/Group 2167.svg"
            className="logo-default max-h-30px"
          />
        </Link>
        <div className="d-flex align-items-center">
          <button
            className="btn p-0 burger-icon burger-icon-left"
            id="kt_aside_mobile_toggle"
            onClick={this.toggleDrawer.bind(this, true)}
          >
            <span />
          </button>
        </div>
      </div>
    );
  }
}

export default MenuResponsive;
