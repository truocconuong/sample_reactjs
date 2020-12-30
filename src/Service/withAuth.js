import React, { Component } from "react";
import AuthService from "./AuthService.js";
import Login from "../Components/Login/LoginAdmin.js";
import Loading from "../Components/libs/PageLoader/fbloader.js";
import { setRole, setUserId} from "../redux/actions";
import { connect } from "react-redux";
import Network from "./Network";
export default function withAuth(AuthComponent) {
  const Auth = new AuthService();
  const api = new Network();
  class Authenticated extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLogin: false,
        isLoading: false,
        classHide: "hideInAuth",
      };
      this.checkLogin = this.checkLogin.bind(this);
    }
    async checkLogin() {
      // console.log("ISLOGIN", Auth.loggedIn());
      try {
        this.setState({
          isLoading: true,
        });
        let auth = await Auth.loggedIn();
        if (auth && auth.role) {
          // console.log("auth: ", role)
          await this.props.setRole(auth.role);
          await this.props.setUserId(auth.userId);
          this.setState({ isLogin: true });
        } else {
          this.setState({ isLogin: false });
        }
        setTimeout(() => {
          this.setState({
            isLoading: false,
            classHide: "",
          });
        }, 100);
      } catch (error) {
        console.log("err in with auth: ", error);
      }
    }

    componentDidMount() {
      
      this.checkLogin();
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? <Loading /> : null}
          <div className={`with_auth_div ${this.state.classHide}`}>
            {/* <Login {...this.props} auth={Auth} /> */}
            {!this.state.isLogin ? (
              <Login {...this.props} auth={Auth} />
            ) : (
              <AuthComponent {...this.props} auth={Auth} />
            )}
          </div>
        </div>
      );
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      setRole: (role) => dispatch(setRole(role)),
      setUserId: (userId) => dispatch(setUserId(userId)),
    };
  };
  const mapStateToProps = (state, ownProps) => {
    return {};
  };
  return connect(mapStateToProps, mapDispatchToProps)(Authenticated);
}
