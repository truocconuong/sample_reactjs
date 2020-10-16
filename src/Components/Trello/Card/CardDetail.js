import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Network from "./../../../Service/Network";

const api = new Network();

class CardDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      data: {},
      user: {},
    };
  }
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
      data: {},
      user: {}
    }));
  };
  getDataCardDetail = async (cardId, modal) => {
    this.setState({
      modal: modal,
    });
    const data = await api.get(`/cards/${cardId}`);
    this.setState({
      data: data,
      user: data.users[0],
    });
  };

  render() {
    const data = this.state.data;
    return (
      <div>
        <Modal show={this.state.modal} onHide={this.toggle}>
          <div className="modal-content">
            <Modal.Header closeButton style={{borderBottom: '1px solid #e9ecef'}}>
              <h5 className="modal-title" id="exampleModalLabel">
                {data.title}
              </h5>
            </Modal.Header>
            <Modal.Body style={{paddingTop: '14px'}}>
              <div>Name: {data.name}</div>
              <div>Email: {data.email}</div>
              <div>Phone: {data.phone}</div>
              <div>Creator: {this.state.user.username}</div>
              <div>Group: {this.state.user.GroupId}</div>
              <div>Role: {this.state.user.nameRole}</div>
              <div>
                <div>
                  Comment
                </div>
                <div className="cardetail-comment">
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
                  <button type="button" class="btn btn-info button-comment">Comment</button>
                </div>
              </div>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    );
  }
}
export default CardDetail;
