import React, { Component } from "react";
import { Modal, Form } from "react-bootstrap";

export default class ModelResult extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.onHide}
        centered
      >
        <Modal.Header className="header-candidate-job">
          <Modal.Title>Your Search Query</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body card-body-update">
            <div className="form-group">
              <label>
                Copy, open the search string in Google and find the
                right candidates
              </label>
              <Form.Control
                name="result"
                type="text"
                className="form-control-solid"
              />
            </div>
          </div>

          <div className="card-footer pl-0 pr-0 card-hqk-dkc">
            <div>
              <button className="btn btn-light-primary font-weight-bolder style-btn-kitin mr-2 cusm-btn-hqkl">
                Copy Url
              </button>

              <a
                href="/"
                className="btn btn-primary font-weight-bolder style-btn-kitin mr-2 cusm-btn-hqkl"
              >
                Open in Google
              </a>
              {/* <button
                type="reset"
                className="btn btn-secondary"
                onClick={this.props.onHide}
              >
                Cancel
              </button> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
