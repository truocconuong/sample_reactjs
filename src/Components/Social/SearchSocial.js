import React, { Component } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./SearchSocial.css";
import ItemCandidate from "./ItemCandidate";

class SearchSocial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: true,
      keyword: 'email',
    };
  }

  onChangeRadio = (event) => {
    if(event.target.value === 'email'){
      this.setState({
        placeholder: true,
        keyword: event.target.value,
      })
    } else {
      this.setState({
        placeholder: false,
        keyword: event.target.value,
      })
    }
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
                <div className="card card-custom">
                  <div className="card-header flex-wrap border-0 pb-0">
                    <div className="card-title">
                      <h3 className="card-label">Search Candidate Social</h3>
                    </div>
                  </div>
                  <div className="dkm-custom-cc">
                    <div className="row m-0">
                      <div className="col-md-6 p-0">
                        <div className="radio-inline">
                          <label className="radio">
                            <input
                              type="radio"
                              name="keyword"
                              value="email"
                              checked={this.state.keyword === "email"}
                              onChange={this.onChangeRadio}
                            />
                            <span></span>
                            Email or Phone
                          </label>
                          <label className="radio">
                            <input type="radio" 
                              name="keyword" 
                              value="keyword"
                              checked={this.state.keyword === "keyword"}
                              onChange={this.onChangeRadio} />
                            <span></span>
                            Keyword
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row m-0 mt-4">
                      <div className="col-md-6 p-0">
                        <input
                          name="title"
                          type="text"
                          className="form-control form-control-solid"
                          placeholder={
                            this.state.placeholder ? "kitinkhanh@gmail.com" : ""
                          }
                        />
                        
                      </div>
                      <div className="col-md-6">
                        <button
                          onClick={this.searchForm}
                          type="submit"
                          className="btn btn-primary mr-2"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column-fluid">
          <div className="container contain-item-candidate">
            <div className="col-md-4 p-0 custom-list-cdd">
              <ItemCandidate isChecked={true} />
              <ItemCandidate />
              <ItemCandidate />
              <ItemCandidate />
              <ItemCandidate />
              <ItemCandidate />
              <ItemCandidate />
            </div>
            <div className="col-md-8 ml-5">
              <div className="card card-custom custom-kt-card">
                <div className="card-header card-header-mobile border-0 pt-5">
                  <div className="sp-candItem__main mb-6">
                    <a
                      className="sp-candItem__avatar pull-left"
                      href="/candidates/000019a75ad911e68155feb79ce8b6d8"
                    >
                      <div className="sp-photoFiel-dkm">
                        <div className="sp-photoField__overflowWrap">
                          <div className="sp-photoField__centered">
                            <div className="sp-photoField__npLetter">D</div>
                          </div>
                          <div
                            className="sp-photoField__img-wrap"
                            style={{
                              backgroundImage:
                                'url("https://media-exp1.licdn.com/dms/image/C4E03AQHlf41e4E5z8A/profile-displayphoto-shrink_400_400/0/1561724490287?e=1616630400&v=beta&t=5-c3i_PO-q8rENDL_MHNtA9szMoHSdlkAxMReOtKo3Y")',
                            }}
                          />
                        </div>
                        <div className="sp-photoField__alert tooltip bottom alert-danger">
                          <div className="tooltip-arrow" />
                          <div className="tooltip-inner">
                            There was a problem uploading your photo
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="sp-candItem__mainBody">
                      <div className="sp-nameField">
                        <div className="sp-nameField__lineWrap">
                          <div className="sp-nameField__wrap">
                            <div className="sp-nameField__inner">
                              David Contorno
                            </div>
                            <div>
                              I am here where you are
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
 
                <div className="sp-candItem__main">
                    <div className="sp-candItem__avatar">Position:</div>
                    <div className="sp-candItem__mainBody">
                      <span>
                        Lead of Design Studio / Product Design Manager - Growth Designer
                      </span>
                    </div>
                  </div>
                  <div className="sp-candItem__main">
                    <div className="sp-candItem__avatar">Company:</div>
                    <div className="sp-candItem__mainBody">
                      <span>
                        Home Credit Vietnam
                      </span>
                    </div>
                  </div>
                  <div className="sp-candItem__main">
                    <div className="sp-candItem__avatar">Location:</div>
                    <div className="sp-candItem__mainBody">
                      <span>
                      Vietnam, Viet Nam
                      </span>
                    </div>
                  </div>
                  <div className="sp-candItem__main">
                    <div className="sp-candItem__avatar">Experience:</div>
                    <div className="sp-candItem__mainBody">
                      <span>
                      12 years exp
                      </span>
                    </div>
                  </div>

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
  };
};

export default connect(mapStateToProps)(SearchSocial);
