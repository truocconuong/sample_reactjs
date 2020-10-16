import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../routes';
import LeftMenu from './Admin-panel/LeftMenu';

class Main extends Component {
	showContentMenu = (routes) => {
		var result = null;
		if (routes.length > 0) {
			result = routes.map((route, index) => {
				return <Route key={index} path={route.path} exact={route.exact} component={route.main} />;
			});
		}
		return result;
	};

	render() {
		return (
			<Router>
				<LeftMenu />
				<Switch>{this.showContentMenu(routes)}</Switch>
			</Router>
		);
	}
}

export default Main;
