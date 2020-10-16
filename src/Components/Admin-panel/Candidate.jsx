import React, { Component } from 'react';
import Network from '../../Service/Network';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import PageLoader from '../Common/pageloader';
import { Link } from 'react-router-dom';
const moment = require('moment');
const api = new Network();

export default class Candidate extends Component {
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
		this.getDataCandidate = this.getDataCandidate.bind(this);
		this.getCount = this.getCount.bind(this);
	}

	async getCount(){
		try {
			const count = await api.get(
				`/candidates/count`
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

	handlePagination = async (page) => {
		await this.setState({
			pageNumber: page,
			loading: true
		});
		this.getDataCandidate();
	};
	async getDataCandidate() {
		try {
			let start = this.state.pageSize*(this.state.pageNumber-1)
			const response = await api.get(
				`/candidates?_start=${start}&_limit=${this.state.pageSize}&_sort=id:asc`
			);
			if (response) {
				if (this._isMounted) {
					await this.setState({
						loading: false,
						data: response,
						
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
		this.getDataCandidate();
		this.getCount();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	render() {
		const list = this.state.data;
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
										</ol>
									</nav>
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
									<h3 className="mb-0">List candidates</h3>
								</div>
								{/* Light table */}
								<div className="table-responsive">
									<table className="table align-items-center table-flush">
										<thead className="thead-light">
											<tr>
												<th scope="col" className="sort">
													Job_Title
												</th>
												<th scope="col" className="sort ">
													Date
												</th>
												<th scope="col" className="sort">
													Candidate Name
												</th>

												<th scope="col" className="sort">
													Action
												</th>
											</tr>
										</thead>
										<tbody className="list">
											{(list || []).map((item, index) => {
												return (
													<tr className="row-in-job" key={index}>
														<td className="budget">
															<span className="name mb-0 text-sm">{item.jobs[0].title}</span>
														</td>
														<td className="budget range" >{moment(moment.utc(item.updated_at)).local().format("DD/MM/YYYY  h:mm A")}</td>
														<td>
															<div className="media-body">{item.name}</div>
														</td>

														<td>
															<Link to={`/candidate-detail/${item.id}`} className="btn btn-sm btn-neutral">
															{/* <a href="#" className="btn btn-sm btn-neutral"> */}
																View
															{/* </a> */}
															</Link>
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
										defaultPageSize={10}
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

					{/* Footer */}
				</div>
			</div>
		);
	}
}
