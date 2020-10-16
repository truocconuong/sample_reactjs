import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import './style.css';

class PageLoader extends Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			class: 'page-loader',
			loader: 0
		};
	}

	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	componentDidUpdate(prevProps) {
		// console.log(this._isMounted);
		if (prevProps.display !== this.props.display) {
			if (this.props.display == false) {
				if (this._isMounted) {
					this.setState({ class: 'page-loader animate', loader: 60 });
					setTimeout(
						function() {
							if (this._isMounted) {
								this.setState({ loader: 100 });
							}
						}.bind(this),
						200
					);

					setTimeout(
						function() {
							if (this._isMounted) {
								this.setState({ class: 'page-loader hide', loader: 100 });
							}
						}.bind(this),
						800
					);
				}
			} else {
				if (this._isMounted) {
					this.setState({ class: 'page-loader', loader: 0 });
				}
			}
		}
	}

	render() {
		return (
			<div className={this.state.class}>
				<Progress
					percent={this.state.loader}
					status="success"
					theme={{
						success: {
							color: '#16a085'
						},
						active: {
							color: 'white'
						},
						default: {
							color: 'white'
						}
					}}
				/>
			</div>
		);
	}
}
export default PageLoader;
