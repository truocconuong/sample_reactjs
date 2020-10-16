import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AuthService from '../../Service/AuthService';
const auth = new AuthService();

export default class LeftMenu extends Component {


	handleLogout(){
		auth.logout();
	}
	render() {
		return (
			<nav
				className="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs navbar-light bg-white"
				id="sidenav-main"
				style={{ boxShadow: 'none' }}
			>
				<div className="scrollbar-inner">
					{/* Brand */}
					<div className="sidenav-header  align-items-center">
						<a className="navbar-brand">
							<img src="/img/Group 2167.svg" className="navbar-brand-img" alt="..." />
						</a>
					</div>
					<div className="navbar-inner">
						{/* Collapse */}
						<div className="collapse navbar-collapse" id="sidenav-collapse-main">
							{/* Nav items */}
							<ul className="navbar-nav">
								<li className="nav-item">
									<NavLink className="nav-link" to="/job">
										<i className="ni ni-bullet-list-67" />
										<span className="nav-link-text">Jobs</span>
									</NavLink>
									<NavLink className="nav-link" to="/post-job">
										<i className="ni ni-support-16" />
										<span className="nav-link-text">Create new job</span>
									</NavLink>
									{/* <a className="nav-link active" href="tables.html">
										
										
									</a> */}
								</li>

								<li className="nav-item">
									<NavLink className="nav-link" to="/candidate">
										<i className="ni ni-circle-08 text-brown" />
										<span className="nav-link-text">Candidates</span>
									</NavLink>
									<NavLink className="nav-link" to="/data">
										<i className="ni ni-single-copy-04" />
										<span className="nav-link-text">Data</span>
									</NavLink>
									<NavLink className="nav-link" to="/trello">
										<i className="ni ni-spaceship" />	
										<span className="nav-link-text">Trello</span>
									</NavLink>
									
								</li>
							</ul>
							<hr className="my-3" />
							<ul className="navbar-nav mb-md-3">
								<li className="nav-item" onClick={this.handleLogout} style={{cursor:'pointer'}}>
									<div className="nav-link">
										<i className="ni ni-settings-gear-65" />
										<span className="nav-link-text">Logout</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
