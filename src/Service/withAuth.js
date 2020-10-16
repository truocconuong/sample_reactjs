import React, {Component} from 'react'
import AuthService from './AuthService.js'
import Login from "../Components/Login/LoginAdmin";
export default function withAuth(AuthComponent) {
    const Auth = new AuthService()
    return class Authenticated extends Component {
      constructor(props) {
        super(props)
        this.state = {
          isLogin: false
        };
      }
                
      componentDidMount () {
      	// console.log("ISLOGIN", Auth.loggedIn())
        if (Auth.loggedIn()) {
          this.setState({ isLogin: true })
        }else{
          this.setState({ isLogin: false })
        }
      }

      render() {
        return (
          <div>
          {!this.state.isLogin ? (
               <Login {...this.props}  auth={Auth} />
            ) : (
              <AuthComponent {...this.props}  auth={Auth} />
            )}
          </div>
        )
      }
    }
}
