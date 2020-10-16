import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Network from '../../Service/Network';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import './style.css';
import PageLoader from '../Common/pageloader';
import { Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const api = new Network();

class Job extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			pageNumber: 1,
			pageSize: 10,
			totalRow: 0,
			data: []
		};
		this.handlePagination = this.handlePagination.bind(this);
		this.getDataJob = this.getDataJob.bind(this);
		this.activeJob = this.activeJob.bind(this);
		this.viewJobDetail = this.viewJobDetail.bind(this);
		this.getCount = this.getCount.bind(this);
	}
	viewJobDetail(link) {
		this.props.history.push(link);
	}
	async activeJob(enable, id_job, index) {
		if (enable) {
			// active job
			await this.setState({
				loading: true
			});
			try {
				const active_status = await api.put(`/jobs/${id_job}`, { enable: true });
				if (active_status) {
					let current_data = this.state.data;
					current_data[index].enable = true;
					await this.setState({
						data: current_data,
						loading: false
					});
					toast.success('Job actived!', {
						position: toast.POSITION.BOTTOM_RIGHT
					});
				} else {
					toast.error('Something went wrong. Please try again later!', {
						position: toast.POSITION.BOTTOM_RIGHT
					});
				}
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong. Please try again later!', {
					position: toast.POSITION.BOTTOM_RIGHT
				});
			}
		} else {
			// deactive job
			await this.setState({
				loading: true
			});
			try {
				const active_status = await api.put(`/jobs/${id_job}`, { enable: false });
				if (active_status) {
					let current_data = this.state.data;
					current_data[index].enable = false;
					await this.setState({
						data: current_data,
						loading: false
					});
					toast.success('Job Deactived!', {
						position: toast.POSITION.BOTTOM_RIGHT
					});
					console.log(active_status);
				} else {
					toast.error('Something went wrong. Please try again later!', {
						position: toast.POSITION.BOTTOM_RIGHT
					});
				}
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong. Please try again later!', {
					position: toast.POSITION.BOTTOM_RIGHT
				});
			}
		}
	}
	handlePagination = async (page) => {
		await this.setState({
			pageNumber: page,
			loading: true
		});
		this.getDataJob();
	};
	async getCount(){
		try {
			const count = await api.get(
				`/jobs/count`
			);
			if(count){
				if(this._isMounted){
					await this.setState({
						totalRow: count
					})
				}
			}
			console.log(count);
		} catch (error) {
			console.log(error)
		}
		
	}

	async getDataJob() {
		try { 
			let start = this.state.pageSize*(this.state.pageNumber-1)
			const response = await api.get(
				// `/api/admin/jobs?pageSize=${this.state.pageSize}&pageNumber=${this.state.pageNumber}`
				`/jobs?_start=${start}&_limit=${this.state.pageSize}&_sort=created_at:desc`
			);
			
			if (response) {
				if (this._isMounted) {
					await this.setState({
						loading: false,
						data: response
					});
					window.scroll({
						top: 0,
						left: 0,
						behavior: 'smooth'
					});
					console.log(response);
				}
			}
		} catch (err) {
			console.log('FetchTechAdminError', err.response);
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.getDataJob();
		this.getCount();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	render() {
		return (
			<div className="main-content" id="panel">
				<PageLoader display={this.state.loading} />
				<ToastContainer closeOnClick autoClose={1000} rtl={false} />

				<div className="header pb-6">
					<div className="container-fluid">
						<div className="header-body">
							<div className="row align-items-center py-4">
								<div className="col-lg-6 col-7">
									{/* <h6 className="h2 text-white d-inline-block mb-0">List Jobs</h6> */}
									<nav aria-label="breadcrumb" className="d-none d-md-inline-block ">
										
										<ol className="breadcrumb breadcrumb-links breadcrumb-dark" style={{boxShadow: '0 9px 30px 1px rgba(153,170,181,.2)', backgroundColor: 'white'}}>
											<li className="breadcrumb-item">
                                                <Link to="/" style={{color: '#32325d'}}><i className="fas fa-home" /></Link>
											</li>
											<li className="breadcrumb-item">
												<Link to="/" style={{color: '#32325d'}}>List Jobs</Link>
											</li>
										</ol>
									</nav>
								</div>
								<div className="col-lg-6 col-5 text-right">
									<Link className="btn btn-sm btn-neutral" to="/post-job" style={{color: '#32325d'}}>
										Create New Job
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
								<div className="card-header border-0">
									<h3 className="mb-0">List Jobs</h3>
								</div>
								{/* Light table */}
								<div className="table-responsive">
									<table className="table align-items-center table-flush">
										<thead className="thead-light">
											<tr>
												{/* <th scope="col" className="sort header-table-title">
													Job_ID
												</th> */}
												<th scope="col" className="sort header-table-title">
													Title
												</th>
												<th scope="col" className="sort header-table-title">
													Range
												</th>
												<th scope="col" className="sort header-table-title">
													Location
												</th>
												<th scope="col" className="sort header-table-title">
													Status
												</th>
											</tr>
										</thead>
										<tbody className="list">
											{(this.state.data || []).map((job, index) => {
												
												return (
													<tr className="row-in-job" key={index}>
														{/* <td className="budget job-id">
																<span className="name mb-0 text-sm">{job.id}</span>
															</td> */}
														{/* onClick={this.viewJobDetail.bind(this,`/job-detail/${job.id}`)} */}
														<td className="title-job">
															<Link to={`/job-detail/${job.id}`}>
																<div className="media-body ">{job.title}</div>
															</Link>
														</td>

														<td className="budget range">
															<Link to={`/job-detail/${job.id}`}>{job.time}</Link>
														</td>

														<td className="budget">
															<Link to={`/job-detail/${job.id}`}>{job.location.name}</Link>
														</td>

														<td className="action-job">
															{job.enable ? (
																<span className="badge badge-dot mr-4 active-dot">
																	<i className="bg-success" />
																	<span className="status">Active</span>
																</span>
															) : (
																<span className="badge badge-dot mr-4">
																	<i className="bg-danger" />
																	<span className="status">Deactive</span>
																</span>
															)}

															<Dropdown>
																<Dropdown.Toggle
																	className="btn btn-sm btn-icon-only text-light"
																	id="dropdown-basic"
																>
																	<i className="fas fa-ellipsis-v" />
																</Dropdown.Toggle>

																<Dropdown.Menu>
																	{job.enable ? (
																		<Dropdown.Item
																			onClick={this.activeJob.bind(
																				this,
																				false,
																				job.id,
																				index
																			)}
																		>
																			Deactive
																		</Dropdown.Item>
																	) : (
																		<Dropdown.Item
																			onClick={this.activeJob.bind(
																				this,
																				true,
																				job.id,
																				index
																			)}
																		>
																			Active
																		</Dropdown.Item>
																	)}

																	<Dropdown.Item href={`/edit-job/${job.id}`}>
																		Edit
																		{/* <Link style={{"color": "#212529"}} to={`/edit-job/${job.id}`}>Edit</Link> */}
																	</Dropdown.Item>
																	<Dropdown.Item>Delete</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
								{/* Card footer */}

								<div className="card-footer py-4">
									<Pagination
										// style={{ marginTop: '60px', marginLeft: '5px' }}
										defaultPageSize={this.state.pageSize}
										current={this.state.pageNumber}
										hideOnSinglePage={true}
										showTitle={false}
										onChange={this.handlePagination}
										total={this.state.totalRow}
										showLessItems={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(Job);
