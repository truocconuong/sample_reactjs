import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Network from '../../../Service/Network';
import PageLoader from '../../Common/pageloader';
import './style.css';
const moment = require('moment');
const domain = 'http://202.134.19.211:1337';
// domain = 'https://api.fetch.tech';
const api = new Network();
export default class CandidateDetail extends Component {
	
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			data: {
				cv:[{url:""}]
			},
			loading: true, 
			linkDownload: ""
		};
		this.getData = this.getData.bind(this);
	}
	async getData() {
		try {
			const id_can = this.props.match.params.id;
			const response = await api.get(`/candidates/${id_can}`);
			if (response) {
				if (this._isMounted) {
					await this.setState({
						data: response,
						loading: false,
						linkDownload: domain + response.cv[0].url
					});
					window.scroll({
						top: 0,
						left: 0,
						behavior: 'smooth'
					});
					console.log(this.state.data);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.getData();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		let data = this.state.data;
		return (
			<div className="main-content" id="panel">
				<PageLoader display={this.state.loading} />

				<div className="header pb-6">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-center py-4">
								<div className="col-lg-6 col-7">
									<nav aria-label="breadcrumb" className="d-none d-md-inline-block ">
										<ol className="breadcrumb breadcrumb-links breadcrumb-dark" style={{boxShadow: '0 9px 30px 1px rgba(153,170,181,.2)', backgroundColor: 'white'}}>
											<li className="breadcrumb-item">
                                                <Link to="/" style={{color: '#32325d'}}><i className="fas fa-home" /></Link>
											</li>
											<li className="breadcrumb-item">
												<Link to="/candidate" style={{color: '#32325d'}}>Candidates</Link>
											</li>
											<li className="breadcrumb-item">
												<Link style={{color: '#32325d'}}>Candidate Detail</Link>
											</li>
										</ol>
									</nav>
								</div>
								<div className="col-lg-6 col-5 text-right">
									<a className="btn btn-sm btn-neutral" target="_blank" href={this.state.linkDownload}>
										Download CV
									</a>
									{/* https://api.fetch.tech/api/admin/cv/candidate/${id_can} */}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Page content */}
				<div className="container-fluid mt--6">
					<div className="row">
						<div className="col">
							<div className="card">
								{/* Card header */}
								<div className="card-header bg-transparent">
									<h2 className="">{data.name}</h2>
									<h4 className="">{data.titleJob}</h4>
									<h4>
										<i className="fas fa-calendar-alt" /> {moment(moment.utc(data.updated_at)).local().format("DD/MM/YYYY  h:mm A")}
									</h4>
								</div>
								{/* Light table */}
								<div className="card-body">
									<div>
										<p>
											<span>
												<strong>Email: </strong>
											</span>
											{data.email}
										</p>
										<p>
											<span>
												<strong>Phone: </strong>
											</span>
											{data.phone}
										</p>
										<p>
											<span>
												<strong>CV: </strong>
											</span>
											{data.cv[0].url}
										</p>
										{data.message ? (
											<p>
												<span>
													<strong>Message: </strong>
												</span>
												{data.message}
											</p>
										) : null}
									</div>
								</div>
								{/* Card footer */}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
