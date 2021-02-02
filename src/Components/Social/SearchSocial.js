import React, { Component } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { connect } from "react-redux";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import "./SearchSocial.css";
import LinkedIn from "./LinkedIn";
import Dribbble from "./Dribbble";
import Github from "./Github";
import Xing from "./Xing";
import StackOverflow from "./StackOverflow";
import Twitter from "./Twitter";

class SearchSocial extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}
      >
        <ToastContainer />

        <div className="content d-flex flex-column flex-column-fluid">
          <div
            className="subheader py-3 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5"></div>
              </div>

              <div className="d-flex align-items-center flex-wrap"></div>
            </div>
          </div>

          <div className="form-search">
            <div className="d-flex flex-column-fluid">
              <div className="container">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <div className="card card-custom">
                    <div className="card-header flex-wrap border-0 pb-0 cusmtom-hd-dkc">
                      <div className="card-title text-center">
                        <h2 className="card-label">Search Candidate Social</h2>
                      </div>
                    </div>
                    <div className="form-group row m-0 cs-kt-social">
                      <Nav
                        variant="pills"
                        className="nav nav-light-success nav-pills"
                      >
                        <Nav.Item>
                          <Nav.Link eventKey="first">
                            <i className="fab fa-linkedin"></i>{" "}
                            <span className="brand-social-dk">LinkedIn</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="second">
                            <i className="fab fa-dribbble"></i>{" "}
                            <span className="brand-social-dk">Dribbble</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="three">
                            <i className="fab fa-github"></i>{" "}
                            <span className="brand-social-dk">Github</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="four">
                            <i className="fab fa-xing"></i>{" "}
                            <span className="brand-social-dk">Xing</span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="five">
                            <i className="fab fa-stack-overflow"></i>
                            <span className="brand-social-dk">
                              Stack Overflow
                            </span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="six">
                            <i className="fab fa-twitter"></i>{" "}
                            <span className="brand-social-dk">Twitter</span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <div className="card-body cusmtom-kt-dkm">
                      <Tab.Content>
                        <Tab.Pane eventKey="first">
                          <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on LinkedIn</h4>
                            <LinkedIn/>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                        <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on Dribbble</h4>
                            <Dribbble/>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="three">
                        <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on Github</h4>
                            <Github />
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="four">
                        <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on Xing</h4>
                            <Xing />
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="five">
                        <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on Stack Overflow</h4>
                            <StackOverflow />
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="six">
                        <div className="row m-0 cs-kt-social">
                            <h4>Easily use Google to search profiles on Twitter</h4>
                            <Twitter />
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </div>
                </Tab.Container>
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
  };
};

export default connect(mapStateToProps)(SearchSocial);
