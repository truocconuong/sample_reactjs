import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast, Zoom } from "react-toastify";
import _ from 'lodash'
import PDFViewer from 'pdf-viewer-reactjs'
export default class PreviewPdf extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    render() {
        return (
            <Modal size="xl" show={this.props.show} onHide={this.props.onHide} centered>
                <Modal.Header >
                    <Modal.Title>Preview Pdf</Modal.Title>
                </Modal.Header>
                <Modal.Body className="background-pdf">
                    <ToastContainer closeOnClick autoClose={1000} rtl={false} />
                    <div className="card-body card-body-update card-body-preview background-pdf">
                        {
                            this.props.show && this.props.base64 ? (<PDFViewer
                                document={{
                                    base64: this.props.base64,
                                }}
                                scale={1.5}
                            />) : <div className="height-ao"></div>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
