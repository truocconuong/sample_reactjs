import React, { Component } from "react";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "./../style.css";
import Network from "../../../Service/Network";
import reactCSS from 'reactcss'
const api = new Network();

export default class DetailClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      isOpen: true,
      name: "",
      website: "",
      about: "",
      background: "",
      editorAbout: EditorState.createEmpty(),
    };
    this.renderFooter = this.renderFooter.bind(this);
  }

  setDefaultState = () => {
    this.setState({
      scrollBehaviour: "inside",
      isOpen: true,
      name: "",
      website: "",
      about: "",
      background: '',
      editorAbout: EditorState.createEmpty(),
    });
  };
  onEditorStateChange = (editorState) => {
    this.setState({
      editorAbout: editorState,
      about: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
  };

  handleInputChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  }

  async createClient(e) {
    e.preventDefault();
    const { name, website, about } = this.state;
    const data = {
      name,
      website,
      about,
    };

    try {
      const response = await api.post(`/api/admin/client`, data);
      if (response) {
        this.props.onHide();
        this.props.loadData();
        this.setDefaultState();
      }
    } catch (error) {
      console.log(error);
    }
  }
  renderFooter(self) {
    return (
      <div className="wrap_footer">
        <div className="modal-cus__right text-right">
          <button className="btn btn-secondary" onClick={self.props.onHide}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    // console.log('chay zo day dc khong')
  }

  render() {
    let self = this;

    const client = this.props.data;
    let dataEditor = "";
    if (this.props.show) {
      const blocksFromHTML = convertFromHTML(client.about);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      dataEditor = EditorState.createWithContent(contentState);
    }
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${client.background ? client.background : '#ffff'}`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return (
      <ModalTransition>
        {this.props.show && (
          <Modal
            onClose={self.props.onHide}
            components={{
              Footer: this.renderFooter.bind(self, self),
            }}
            scrollBehavior={this.state.scrollBehaviour}
            width={"x-large"}
          >
            <form className="form" onSubmit={this.createClient.bind(this)}>
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange.bind(this)}
                      readOnly
                      value={client.name}
                      name="name"
                      className="form-control"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Website:</label>
                    <input
                      type="text"
                      onChange={this.handleInputChange.bind(this)}
                      readOnly
                      value={client.website}
                      name="website"
                      className="form-control"
                      placeholder="Enter website"
                    />
                  </div>
                </div>


                <div className="form-group row">
                  {this.props.show ? (<div className="col-lg-12 style-make-color">
                    <label>Color:</label>
                    <div className="color-style" style={styles.swatch} onClick={this.handleClick}>
                      <div style={styles.color} />
                    </div>
                  </div>) : ''}
                </div>
                <div className="form-group row">
                  <div className="col-lg-12">
                    <label>About:</label>
                    <div>
                      <Editor
                        editorState={dataEditor}
                        readOnly
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        editorStyle={{
                          border: "1px solid #F1F1F1",
                          height: "250px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}
