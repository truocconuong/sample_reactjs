import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../Service/AuthService";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import "./style.css";
import toastr from "toastr";

const auth = new AuthService();

toastr.options = {
  positionClass: "toast-top-right",
};
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      remember: true,
      isLoading: false,
    };
  }

  isChange = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    let self = this;
    e.preventDefault();
    this.setState({
      isLoading: true,
    });
    auth.login(this.state.email, this.state.password, (login) => {
      if (login) {
        toast(<CustomToast title={"Login Success!"} />, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          className: "toast_login",
          closeButton: false,
          hideProgressBar: true,
          newestOnTop: true,
          closeOnClick: true,
          rtl: false,
          pauseOnFocusLoss: true,
          draggable: true,
          pauseOnHover: true,
          transition: Zoom,
        });
        if(this.state.remember){
          localStorage.setItem(
            "isRemember",
            true
          );
        }else{
          localStorage.setItem(
            "isRemember",
            false
          );
        }
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
          window.location.reload();
        }, 500);
      } else {
        toast.error("Email or password wrong !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
        }, 1500);
      }
    });
  };
  componentDidMount() {
    const forceLogout = localStorage.getItem("forceLogout");
    if (forceLogout) {
      toast(<CustomToast title={"Your account is already logged in on another device!"} type={"warning"}/>, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        className: "toast_login",
        closeButton: false,
        hideProgressBar: true,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        transition: Zoom,
      });
    }
  }
  render() {
    return (
      <div className="d-flex flex-column flex-root" style={{ height: "100vh" }}>
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        <div
          className="login login-4 login-signin-on d-flex flex-row-fluid"
          id="kt_login"
        >
          <div
            className="d-flex flex-center flex-row-fluid bgi-size-cover bgi-position-top bgi-no-repeat"
            style={{
              backgroundImage: 'url("/img/bg-3.jpg")',
            }}
          >
            <div className="login-form text-center p-7 position-relative overflow-hidden">
              <div className="d-flex flex-center mb-15">
                <a href="#">
                  <img
                    src="/img/Group 2167.svg"
                    className="max-h-75px"
                    alt=""
                  />
                </a>
              </div>
              <div className="login-signin">
                <div className="mb-20">
                  <h3>Welcome to Talent Acquisition Portal</h3>
                  <div className="text-muted font-weight-bold">
                    Enter your details to login to your account:
                  </div>
                </div>
                <form
                  className="form"
                  id="kt_login_signin_form"
                  onSubmit={this.handleSubmit}
                >
                  <div className="form-group mb-5">
                    <input
                      className="form-control h-auto form-control-solid py-4 px-8"
                      type="text"
                      placeholder="Email"
                      autoComplete="off"
                      name="email"
                      onChange={this.isChange}
                      disabled={this.state.isLoading ? true : false}
                    />
                  </div>
                  <div className="form-group mb-5">
                    <input
                      className="form-control h-auto form-control-solid py-4 px-8"
                      type="password"
                      placeholder="Password"
                      name="password"
                      autoComplete="off"
                      onChange={this.isChange}
                      disabled={this.state.isLoading ? true : false}
                    />
                  </div>
                  <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
                    <div className="checkbox-inline">
                      <label className="checkbox m-0 text-muted">
                        <input type="checkbox" name="remember" onChange={this.isChange} checked={this.state.remember}/>
                        <span />
                        Remember me
                      </label>
                    </div>
                  </div>
                  <button
                    id="kt_login_signin_submit"
                    className={
                      this.state.isLoading
                        ? "btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4  spinner spinner-right spinner-white pr-15"
                        : "btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4 "
                    }
                  >
                    {this.state.isLoading ? "Please wait" : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
