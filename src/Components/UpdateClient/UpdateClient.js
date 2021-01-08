import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Network from '../../Service/Network';
import Fbloader from '../libs/PageLoader/fbloader';
import _ from 'lodash'
import { Redirect } from 'react-router-dom';
import { rulesAddAndUpdateClient } from '../../utils/rule';
import Validator from '../../utils/validator';
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast";
import { SketchPicker ,ChromePicker } from 'react-color'
import reactCSS from 'reactcss'

const api = new Network();

class UpdateClient extends Component {
  constructor(props) {
    super();
    this.state = {
      scrollBehaviour: "inside",
      isOpen: true,
      name: '',
      website: '',
      about: '',
      background : '',
      editorAbout: EditorState.createEmpty(),
      redirectToClient: false,
      errors: {}
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


  async updateClient(e) {
    e.preventDefault();
    const errors = this.validator.validate(this.state);
    this.setState({
      errors: errors,
    });

    if (this.isEmpty(errors)) {
      const { name, website, about ,background } = this.state
      const data = {
        name, website, about , background
      }
      try {
        const response = await api.patch(`/api/admin/client/${this.props.id}`, data);
        if (response) {
            toast(<CustomToast title={"Update client successed !"} />, {
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
          this.redirectToClient();
        }

      } catch (error) {
        console.log(error)
      }
    }
  }
  async getData() {
    const { id } = this.props;

    let self = this;
    self.setState({
      isLoading: true,
    });

    const response = await api.get(`/api/client/${id}`)
    if (response) {
      const data = response.data.client;
      if(!data.background){
        data.background = '#ffff'
      }
      const blocksFromHTML = convertFromHTML(data.about);
      const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      data.editorAbout = EditorState.createWithContent(content)
      const dataUpdate = _.assign(this.state, data);
      this.setState(dataUpdate)
    }


    setTimeout(() => {
      self.setState({
        isLoading: false
      })
    }, 1200)

  }

  redirectToClient = () => {
    this.setState({ redirectToClient: true })
  }

  componentDidMount() {
    this.getData();
  }

  isEmpty(obj) {
    // check obj empty
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  render() {
    const self = this;
    const { editorAbout, errors } = this.state

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
      <div
        className={`d-flex flex-column flex-row-fluid wrapper  ${this.props.className_wrap_broad}`}
      >
        <ToastContainer closeOnClick autoClose={1000} rtl={false} />
        {this.state.redirectToClient ? <Redirect to="/client" /> : ''}
        <div className="content d-flex flex-column flex-column-fluid">
          {this.state.isLoading ? <Fbloader /> : null}

          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
             
              <div className="d-flex align-items-center mr-1">
             
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                
                </div>
               
              </div>
           
              <div className="d-flex align-items-center flex-wrap"></div>
             
            </div>
          </div>
          <div className="d-flex flex-column-fluid">
            <div className="container">
              <div className="card card-custom">
                <div className="card-header flex-wrap border-0 pt-6 pb-0">
                  <div className="card-title">
                    <h3 className="card-label">
                      Update client
                    
                    </h3>
                  </div>
                  <div className="card-toolbar">
                    <div className="dropdown dropdown-inline mr-2">
                    
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <form className="form" onSubmit={this.updateClient.bind(this)}>
                    <div className="card-body">
                      <div className="form-group row">
                        <div className="col-lg-6">
                          <label>Name:</label>
                          <input type="text" value={this.state.name} onChange={this.handleInputChange.bind(this)} name="name" className={
                            errors.name
                              ? "form-control is-invalid"
                              : "form-control"
                          } placeholder="Enter name" />
                        </div>
                        <div className="col-lg-6">
                          <label>Website:</label>
                          <input type="text" value={this.state.website} onChange={this.handleInputChange.bind(this)} name="website" className={
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
                                colorPicker: { colors: ['rgb(21, 188, 197)', 'rgb(33, 37, 41)' , 'rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'], },
                                fontFamily: {
                                  options: ['Muli', 'sans-serif', 'Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer card-footer-cus">
                      <div className="modal-cus__right text-right">
                        <button type="submit" className="btn btn-primary mr-2">Save</button>
                        <button type="reset" className="btn btn-secondary" onClick={() => {
                          this.redirectToClient();
                        }}>Cancel</button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
    id: ownProps.match.params.id
  };
};

export default connect(mapStateToProps)(UpdateClient);
