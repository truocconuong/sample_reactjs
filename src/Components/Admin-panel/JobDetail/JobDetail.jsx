import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Network from '../../../Service/Network';
import PageLoader from '../../Common/pageloader';
import ReactHtmlParser from 'react-html-parser';
import './style.css';
const api = new Network();
export default class Job extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			data: {
				location:{
					name: ""
				},
			},
			loading: true
		};
		this.getData = this.getData.bind(this);
	}
	async getData() {
		try {
			const id_job = this.props.match.params.id;
			const response = await api.get(`/jobs/${id_job}`);
			if (response) {
				if (this._isMounted) {
					await this.setState({
						data: response,
						loading: false
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
		let id = this.props.match.params.id;
		let descData = data.aboutFetch +  data.aboutClient + data.responsibilities + data.requirement + data.niceToHave + data.why;
		let desc = `<div>${descData}</div>`;
		return (
			<div className="main-content" id="panel">
				<PageLoader display={this.state.loading} />

				<div className="header pb-6">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-center py-4">
								<div className="col-lg-6 col-7">
									{/* <h6 className="h2 text-white d-inline-block mb-0">List Jobs</h6> */}
									<nav aria-label="breadcrumb" className="d-none d-md-inline-block ">
										<ol className="breadcrumb breadcrumb-links breadcrumb-dark">
											<li className="breadcrumb-item">
												<Link to="/job">
													<i className="fas fa-home" />
												</Link>
											</li>
											<li className="breadcrumb-item">
												<Link to="/job">Jobs</Link>
											</li>
											<li className="breadcrumb-item" style={{color:"#5e72e4"}}>
												Job Detail
											</li>
											{/* <li className="breadcrumb-item active" aria-current="page">Tables</li> */}
										</ol>
									</nav>
								</div>
								<div className="col-lg-6 col-5 text-right">
									<Link className="btn btn-sm btn-neutral" to={`/edit-job/${id}`}>
										Edit
									</Link>
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
									<h3 className="mb-0">{data.title}</h3>
									<div className="type-job">{data.type}</div>
									<div className="content-info">
										<div className="overview-content-info">
											<div className="conent-info-negotiate">
												<i className="fas fa-dollar-sign" />
											</div>
											<div>{data.salary}</div>
										</div>
										<div className="overview-content-info">
											<div className="content-info-detail">
												<i className="fas fa-map-marker-alt" />
											</div>
											<div>{data.location.name}</div>
										</div>
										<div className="overview-content-info">
											<div className="content-info-detail">
												<i className="fas fa-calendar-alt" />
											</div>
											<div>{data.time}</div>
										</div>
									</div>
								</div>
								{/* Light table */}

								<div className="card-body">{ReactHtmlParser(desc)}</div>

								{/* Card footer */}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
