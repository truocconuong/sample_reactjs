import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../../Service/AuthService';
import { ToastContainer, toast } from 'react-toastify';

const auth = new AuthService();
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	isChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
			[name]: value
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		auth.login(this.state.email, this.state.password, (login) => {
			if (login) {
				toast.success('Login Success!', {
					position: toast.POSITION.BOTTOM_RIGHT
				});
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			} else {
				toast.error('Email or password wrong !', {
					position: toast.POSITION.BOTTOM_RIGHT
				});
			}
		});
	};

	render() {
		return (
			<div className="bg-default">
				<ToastContainer closeOnClick autoClose={1000} rtl={false}/>
				{/* Main content */}
				<div className="main-content">
					{/* Header */}
					<div className="header bg-gradient-primary py-5  ">
						<div className="container">
							<div className="header-body text-center mb-7">
								<div className="row justify-content-center">
									<div className="col-xl-6 col-lg-8 col-md-8 px-12">
										<h1 className="text-white">Welcome to Fetch - Admin!</h1>
										{/* <p className="text-lead text-white">
											Use these awesome forms to login or create new account in your project for
											free.
										</p> */}
									</div>
								</div>
							</div>
						</div>
						<div className="separator separator-bottom separator-skew zindex-100">
							<svg
								x={0}
								y={0}
								viewBox="0 0 2560 100"
								preserveAspectRatio="none"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon className="fill-default" points="2560 0 2560 100 0 100" />
							</svg>
						</div>
					</div>
					{/* Page content */}
					<div className="container mt--8 pb-5">
						<div className="row justify-content-center">
							<div className="col-lg-5 col-md-7">
								<div className="card bg-secondary border-0 mb-0">
									<div className="card-body px-lg-5 py-lg-5">
										<form role="form" onSubmit={this.handleSubmit}>
											<div className="form-group mb-3">
												<div className="input-group input-group-merge input-group-alternative">
													<div className="input-group-prepend">
														<span className="input-group-text">
															<i className="ni ni-email-83" />
														</span>
													</div>
													<input
														className="form-control"
														name="email"
														onChange={this.isChange}
														placeholder="Email"
														type="email"
													/>
												</div>
											</div>
											<div className="form-group">
												<div className="input-group input-group-merge input-group-alternative">
													<div className="input-group-prepend">
														<span className="input-group-text">
															<i className="ni ni-lock-circle-open" />
														</span>
													</div>
													<input
														className="form-control"
														placeholder="Password"
														type="password"
														name="password"
														onChange={this.isChange}
													/>
												</div>
											</div>

											<div className="text-center">
												<button
													type="submit"
													className="btn btn-primary my-4"
													style={{
														color: '#fff',
														borderColor: '#5e72e4',
														backgroundColor: '#5e72e4',
														boxShadow:'0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08)'
													}}
												>
													Sign in
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Footer */}
				<footer className="py-7 pb-8" id="footer-main">
					<div className="container">
						<div className="row align-items-center justify-content-xl-between">
							<div className="col-xl-6">
								<div className="copyright text-center text-xl-left text-muted">
									© Copyright 2020 Fetch Tech. All Rights Reserved.
								</div>
							</div>
							<div className="col-xl-6" />
						</div>
					</div>
				</footer>
			</div>
		);
	}
}
