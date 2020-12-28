import axios from "axios";
import { domainServer } from "../utils/config.js";

var self = null;
export default class AuthService {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.setProfile = this.setProfile.bind(this);

    this.domain = domainServer;

    self = this;
  }

  login(email, password, callback) {
    let setProfile = this.setProfile;
    axios
      .post(`${this.domain}/api/sigin`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        console.log(response.data.data);
        setProfile(response.data.data.token);
        localStorage.setItem(
          "tokenTimeStamp",
          response.data.data.tokenTimeStamp
        );
        localStorage.removeItem("forceLogout");
        callback(true);
      })
      .catch(function (error) {
        console.log(error);
        callback(false);
      });
  }
  handleError(error, rejected) {
    if (error.response) {
      if (error.response.status === 401) {
        this.forceLogout();
      } else if (error.response.status === 404) {
        // window.location.href = '/error';
      } else {
        rejected(error);
      }
    } else {
      console.log("ERROR---->", error);
      rejected(error);
    }
  }
  loggedIn() {
    return new Promise((resolved, rejected) => {
      // const profile = this.getProfile();
      // if (!profile) {
      let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
      if (!tokenTimeStamp) {
        resolved(null);
      } else {
        let setProfile = this.setProfile;
        axios
          .post(`${this.domain}/api/checklogin/browser`, {
            tokenTimeStamp: tokenTimeStamp,
          })
          .then(function (response) {
            setProfile(response.data.data.tokenAuth);
            resolved(response.data.data.role);
          })
          .catch(function (error) {
            self.handleError(error, rejected);
            console.log(error);
          });
      }
      // } else {
      //   let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
      //   if (!tokenTimeStamp) {
      //     resolved(null);
      //   } else {
      //     axios
      //       .post(`${this.domain}/api/checklogin/browser`, {
      //         tokenTimeStamp: tokenTimeStamp,
      //       })
      //       .then(function (response) {
      //         resolved(response.data.data.role);
      //       })
      //       .catch(function (error) {
      //         self.handleError(error, rejected);
      //         console.log(error);
      //       });
      //   }
      // }
    });
  }

  setProfile(profile) {
    sessionStorage.setItem("token", profile);
  }
  getProfile() {
    let tokenTimeStamp = localStorage.getItem("tokenTimeStamp");
    if (tokenTimeStamp) {
      const profile = sessionStorage.getItem("token");
      return profile ? profile : null;
    } else {
      return null;
    }
  }

  logout() {
    // console.log('LogOut');
    sessionStorage.removeItem("token");
    localStorage.removeItem("tokenTimeStamp");
    window.location.replace("/");
  }
  forceLogout() {
    // console.log('LogOut');
    sessionStorage.removeItem("token");
    localStorage.removeItem("tokenTimeStamp");
    localStorage.setItem("forceLogout", "true");
    window.location.replace("/");
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
