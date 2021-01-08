import React, { Component } from "react";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "./../style.css";
import Network from "../../../Service/Network";
import { rulesAddAndUpdateClient } from "../../../utils/rule";
import Validator from "../../../utils/validator";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../../common/CustomToast";
import { SketchPicker ,ChromePicker } from 'react-color'
import reactCSS from 'reactcss'

const api = new Network();



export default class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBehaviour: "inside",
      isOpen: true,
      name: '',
      website: '',
      about: '',
      displayColorPicker: false,
      background: '#f0f0f0',
      errors: {},
      editorAbout: EditorState.createEmpty(),
    };
    this.validator = new Validator(rulesAddAndUpdateClient);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ background: color.hex })
  };
  setDefaultState = () => {
    this.setState({
      scrollBehaviour: "inside",
      isOpen: true,
      name: '',
      website: '',
      about: '',
      editorAbout: EditorState.createEmpty(),
    })
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorAbout: editorState,
      about: draftToHtml(convertToRaw(editorState.getCurrentContent()))
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

    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });
    if (this.isEmpty(errors)) {
      const { name, website, about , background } = this.state
      const data = {
        name, website, about,background
      }
      try {
        const response = await api.post(`/api/admin/client`, data);
        if (response) {
          toast(<CustomToast title={"Create client successed !"} />, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            className: "toast_login",
            closeButton: false,
            hideProgressBar: true,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            transition: Zoom,
          });
          this.props.onHide();
          this.props.loadData();
          this.setDefaultState();
        }

      } catch (error) {
        console.log(error)
      }
    }
  }

  componentWillUnmount() {
    // console.log('chay zo day dc khong')
  }
  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  render() {
    let self = this;
    const { editorAbout } = this.state;
    const data = this.props.data;
    const errors = this.state.errors;
    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `${this.state.background}`,
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
            scrollBehavior={this.state.scrollBehaviour}
            width={"x-large"}
          >
            <ToastContainer closeOnClick autoClose={1000} rtl={false} />
            <form className="form" onSubmit={this.createClient.bind(this)}>
              <div className="card-body card-body-new-client">
                <div className="form-group row">
                  <div className="col-lg-6">
                    <label>Name:</label>
                    <input type="text" onChange={this.handleInputChange.bind(this)} name="name" className={
                      errors.name
                        ? "form-control is-invalid"
                        : "form-control"
                    } placeholder="Enter name" />
                  </div>
                  <div className="col-lg-6">
                    <label>Website:</label>
                    <input type="text" onChange={this.handleInputChange.bind(this)} name="website" className={
                      errors.website
                        ? "form-control is-invalid"
                        : "form-control"
                    } placeholder="Enter website" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-12 style-make-color">
                    <label>Color:</label>
                    <div className="color-style" style={styles.swatch} onClick={this.handleClick}>
                      <div style={styles.color} />
                    </div>
                    {this.state.displayColorPicker ? <div style={styles.popover}>
                      <div style={styles.cover} onClick={this.handleClose} />
                      <ChromePicker color={this.state.background} onChange={this.handleChange} />
                    </div> : null}
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-12">
                    <label>About:</label>
                    <div>
                      <Editor
                        editorState={editorAbout}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        editorStyle={{ border: "1px solid #F1F1F1", height: "250px" }}
                        toolbar={{
                          colorPicker: {
                            colors: ['rgb(21, 188, 197)', 'rgb(33, 37, 41)', 'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                              'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                              'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                              'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                              'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                              'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                          },
                          fontFamily: {
                            options: ['Muli', 'sans-serif', 'Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-cus__right text-right">
                  <button type="submit" className="btn btn-primary mr-2">Save</button>
                  <button type="reset" className="btn btn-secondary" onClick={() => {
                    self.props.onHide(false)
                  }}>Cancel</button>
                </div>
              </div>

            </form>
          </Modal>
        )}
      </ModalTransition>
    );
  }
}
