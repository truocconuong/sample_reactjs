import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import MenuLeft1 from "./MenuLeft.js";
import { Link } from "react-router-dom";
import {
  addPaddingBroad,
  removePaddingBroad,
  setAvatarUser,
  responsivePaddingBroad,
} from "../../redux/actions";
import { connect } from "react-redux";

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
    if (this.props.className_wrap_broad === "pl_0") {
      this.props.removePadding();
    } else if (this.props.className_wrap_broad === "pl_100") {
      this.props.responsivePadding();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", (size) => {
      if (size.target.innerWidth < 768) {
        this.props.responsivePadding();
        // console.log("mobile", size.target.innerWidth);
      } else {
        this.props.removePadding();
        // console.log("web", size.target.innerWidth);
        console.log("isShow", this.state.show);
        this.setState({
          show: false,
        });
      }
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
        {window.innerWidth < 768 ? (
          <div
            className={
              this.state.show ? "drawer_div" : "drawer_div drawer_hide"
            }
            onClick={this.toggleDrawer.bind(this, false)}
          >
            <MenuLeft1
              isMobile={true}
              hideMenuResponsive={this.toggleDrawer.bind(this, false)}
            />
          </div>
        ) : null}

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

const mapDispatchToProps = (dispatch) => {
  return {
    removePadding: () => dispatch(removePaddingBroad()),
    responsivePadding: () => dispatch(responsivePaddingBroad()),
  };
};
const mapStateToProps = (state, ownProps) => {
  return {
    role: state.auth.role,
    history: ownProps.history,
    classHide: ownProps.classHide,
    isMobile: ownProps.isMobile,
    hideMenuResponsive: ownProps.hideMenuResponsive,
    className_wrap_broad: state.ui.className_wrap_broad,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuResponsive);
