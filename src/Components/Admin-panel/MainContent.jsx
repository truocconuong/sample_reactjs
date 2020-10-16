import React, { Component } from 'react';
import LeftMenu from './LeftMenu';
import Job from './Job';
import Candidate from './Candidate';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

export default class MainContent extends Component {
	render() {
		return (
			<div>
				<Router>
                    <LeftMenu />
					<Switch>
						<Job />
					</Switch>
				</Router>
			</div>
		);
	}
}
