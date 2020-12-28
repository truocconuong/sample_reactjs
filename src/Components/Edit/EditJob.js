import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Network from "../../Service/Network";
import { Form } from "react-bootstrap";
import EditorCustom from "./EditorCustom";
import EditorCustomTwo from "./EditorCustomTwo";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import { connect } from "react-redux";

import "./style.css";
const api = new Network();
var timer = null;
var timerTwo = null;

class EditJob extends Component {
  constructor(props) {
    super(props);
    this.editorOne = React.createRef();
    this.editorThree = React.createRef();
    this.editorFour = React.createRef();
    this.editorFive = React.createRef();
    this.editorSix = React.createRef();

    this.scrollClient = React.createRef();

    this.state = {
      styleHeader: "card-header",
      isLoading: false,
      data: {
        title: "",
        location: "",
        locationId: "",
        type: "",
        time: "",
        salary: "",
        content: "",
        slug: "",
        jobStatus: "",
        aboutFetch: "",
        client: null,
        responsibilities: "",
        benefit: "",
        requirement: "",
        niceToHave: "",
        metaJob: "",
        titlePage: "",
        keyword: "",
        note: "",
        descJob: "",
        interviewProcess: "",
        extraBenefit: "",
        arr_skill: [],
        arr_skill_required: [],
        user: [],
      },
      val: "",
      valTwo: "",
      suggestion: [],
      suggestionTwo: [],
      listSkill: [],
      listLocation: [],
      listClient: [],
      validated: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getInitData();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    let lengthScroll = window.pageYOffset;
    if (lengthScroll > 220) {
      this.setState({
        styleHeader: "card-header style-header-job",
      });
    } else {
      this.setState({
        styleHeader: "card-header",
      });
    }
  };

  getInitData = async () => {
    try {
      const id_job = this.props.match.params.id;
      let getJob = api.get(`/api/admin/jobs/${id_job}`);
      let getListLocation = api.get(`/api/location`);
      let getListClient = api.get(`/api/all/client`);
      let getListSkill = api.get(`/api/all/skill`);
      let [dataJob, dataLocation, dataClient, dataSkill] = await Promise.all([
        getJob,
        getListLocation,
        getListClient,
        getListSkill,
      ]);
      if (dataJob && dataLocation && dataClient && dataSkill) {
        if (this._isMounted) {
          await this.setState({
            data: dataJob.data,
            listLocation: dataLocation.data.location,
            listClient: dataClient.data.clients,
            listSkill: dataSkill.data.skills,
          });
          this.editorOne.current.setContent(this.state.data.aboutFetch);
          this.editorThree.current.setContent(this.state.data.responsibilities);
          this.editorFour.current.setContent(this.state.data.requirement);
          this.editorFive.current.setContent(this.state.data.niceToHave);
          this.editorSix.current.setContent(this.state.data.benefit);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  findSkill = async (keyword) => {
    try {
      if (keyword) {
        const skill = await api.post("/api/skill/admin/search", {
          skill: keyword,
        });
        this.setState({ suggestion: skill });
      } else {
        this.setState({ suggestion: [] });
      }
    } catch (e) {
      console.log(e);
    }
  };

  findSkillTwo = async (keyword) => {
    var self = this;
    const { data } = this.state;
    try {
      if (keyword) {
        const skill = await api.post("/api/skill/admin/search", {
          skill: keyword,
        });
        /* Check Trung Skill*/
        if (data.arr_skill_required.length > 0) {
          var filteredArray = skill.filter(function (array_el) {
            return (
              data.arr_skill_required.filter(function (anotherOne_el) {
                return anotherOne_el.id == array_el.id;
              }).length == 0
            );
          });
          this.setState({ suggestionTwo: filteredArray });
        } else {
          this.setState({ suggestionTwo: skill });
        }
      } else {
        this.setState({ suggestionTwo: [] });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleSkillRequired = (e) => {
    let skill = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.findSkill(skill);
    }, 1000);
    this.setState({ val: e.target.value });
    console.log(skill);
  };

  handleSkill = (e) => {
    let skill = e.target.value;
    clearTimeout(timerTwo);
    timerTwo = setTimeout(() => {
      this.findSkillTwo(skill);
    }, 1000);
    this.setState({ valTwo: e.target.value });
  };

  // select skill required and set state
  selectSkillRequired = (suggess, index, e) => {
    const { data } = this.state;
    data.arr_skill_required.push(suggess);
    this.setState({ data: data, suggestion: [], val: "" });
  };

  // select skill and set state
  selectSkill = (suggess, index, e) => {
    const { data } = this.state;
    data.arr_skill.push(suggess);
    this.setState({ data: data, suggestionTwo: [], valTwo: "" });
  };

  // delete tag skill required
  removeTag = (position) => {
    const { data } = this.state;
    data.arr_skill_required.splice(position, 1);
    this.setState({ data: data, suggestion: [] });
  };

  // delete tag skill
  removeTagSkill = (position) => {
    const { data } = this.state;
    data.arr_skill.splice(position, 1);
    this.setState({ data: data, suggestionTwo: [] });
  };

  handleChange = (event) => {
    const { data } = this.state;
    const name = event.target.name;
    const value = event.target.value;
    data[name] = value;
    this.setState({
      data: data,
    });
  };

  handleSelectClient = (event) => {
    const { data } = this.state;
    const name = event.target.name;
    const value = event.target.value;
    data[name] = {
      id: value,
    };
    this.setState({
      data: data,
    });
  };

  handleSubmit = async (event) => {
    const form = event.currentTarget;
    let currentTargetRect = event.target.getBoundingClientRect();
    const event_offsetY = -currentTargetRect.top;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      window.scroll({
        top: event_offsetY - 1800,
        left: 0,
        behavior: "smooth",
      });
      if(this.state.data.client == null || this.state.data.client == "") {
        console.log(this.state.data.client);
        window.scrollTo({
          left: 0,
          top: this.scrollClient.current.offsetTop,
          behavior: "smooth",
        });
      }
      this.setState({ validated: true });
      return;
    }

    const { data, listLocation } = this.state;
    let arrSkill = [];
    if (data.arr_skill_required.length > 0) {
      data.arr_skill_required.map((item) => {
        arrSkill.push({ id: item.id, isRequired: true });
      });
    }
    if (data.arr_skill.length > 0) {
      data.arr_skill.map((item) => {
        arrSkill.push({ id: item.id, isRequired: false });
      });
    }
    let location = listLocation.find((item) => item.id === data.locationId);
    let content = `${location.descLocation}<p><span style="color: rgb(136, 136, 136);">${data.type}</span></p>`;
    const valueOne = this.editorOne.current.getContent();
    const valueThree = this.editorThree.current.getContent();
    const valueFour = this.editorFour.current.getContent();
    const valueFive = this.editorFive.current.getContent();
    const valueSix = this.editorSix.current.getContent();

    let self = this;
    try {
      const idJob = this.props.match.params.id;
      const dataJob = {
        title: data.title,
        content: content,
        locationId: data.locationId,
        type: data.type,
        time: data.time,
        salary: data.salary,
        jobStatus: data.jobStatus,
        keyword: data.keyword,
        note: data.note,
        titlePage: data.titlePage,
        metaJob: data.metaJob,
        clientId: Number(data.client.id) || null,
        skill: arrSkill,
        aboutFetch: valueOne || "",
        responsibilities: valueThree || "",
        requirement: valueFour || "",
        niceToHave: valueFive || "",
        benefit: valueSix || "",
        descJob: data.descJob,
        interviewProcess: data.interviewProcess,
        extraBenefit: data.extraBenefit,

      };
      this.setState({ validated: false, isLoading: true });
      // console.log(dataJob);
      const response = await api.patch(`/api/admin/jobs/${idJob}`, dataJob);
      if (response.data.success) {
        setTimeout(() => {
          self.setState({
            isLoading: false,
          });
          this.props.history.push("/job");
          toast(<CustomToast title={"Update Job Success!"} />, {
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
            pauseOnHover: true
          });
        }, 800);
      } else {
        toast(<CustomToast title={"Something went wrong please try again later!"} type="error" />, {
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
        });
      }
    } catch (err) {
      console.log(err);
      toast(<CustomToast title={"Something went wrong please try again later!"} type="error" />, {
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
      });
    }
  };

  render() {
    const { data, listLocation, listClient, validated } = this.state;
    const optLocation = listLocation.map((item) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      );
    });

    const optClient = listClient.map((item) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      );
    });

    return (
      <div className={`d-flex flex-column flex-row-fluid wrapper ${this.props.className_wrap_broad}`}>
        <div className="content d-flex flex-column flex-column-fluid p-0">
          <ToastContainer />
          <div
            className="subheader py-3 py-lg-8 subheader-transparent"
            id="kt_subheader"
          >
            <div className="container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
              <div className="d-flex align-items-center mr-1">
                <div className="d-flex align-items-baseline flex-wrap mr-5">
                  <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold my-2 p-0">
                    <li className="breadcrumb-item">
                      <NavLink to="/" className="text-muted">
                        Fetch admin
                      </NavLink>
                    </li>
                    <li className="breadcrumb-item">
                      <NavLink to="/job" className="text-muted">
                        Job
                      </NavLink>
                    </li>
                    <li className="breadcrumb-item">
                      <span
                        className="text-muted"
                        style={{ cursor: "pointer" }}
                      >
                        Edit Job
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column-fluid">
            <div className="container">
              <Form
                noValidate
                validated={validated}
                onSubmit={this.handleSubmit}
              >
                <div
                  className="card card-custom card-sticky"
                  id="kt_page_sticky_card"
                >
                  <div className={this.state.styleHeader}>
                    <div className="card-title">
                      <h3 className="card-label">
                        Form Edit Job
                        <i className="mr-2" />
                      </h3>
                    </div>
                    <div className="card-toolbar">
                      <span
                        onClick={() => this.props.history.goBack()}
                        className="btn btn-light-primary font-weight-bolder mr-2"
                      >
                        Back
                      </span>
                      <div className="btn-group">
                        <button
                          type="submit"
                          className={
                            this.state.isLoading
                              ? "btn btn-primary font-weight-bolder style-btn-kitin spinner spinner-white spinner-right"
                              : "btn btn-primary font-weight-bolder style-btn-kitin "
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">

                    <div className="row">
                      <div className="col-xl-1" />
                      <div className="col-xl-10">
                        <div className="my-5">
                          <h3 className=" text-dark font-weight-bold mb-10">
                            Job Info:
                          </h3>
                          <div className="form-group row">
                            <div className="col-lg">
                              <label>
                                Title Job{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  name="title"
                                  required
                                  type="text"
                                  value={data.title}
                                  placeholder="HN - Senior Nodejs"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-group row pt-3">
                            <div className="col-lg-6">
                              <label>
                                Salary <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  name="salary"
                                  required
                                  type="text"
                                  value={data.salary}
                                  placeholder="1000 - 1500 USD"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 padding-input-kitin">
                              <label>
                                Location <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  as="select"
                                  required
                                  name="locationId"
                                  className="form-control"
                                  value={data.locationId}
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                >
                                  <option value="">Choose Location</option>
                                  {optLocation}
                                </Form.Control>
                              </div>
                            </div>
                          </div>

                          <div className="form-group row pt-3">
                            <div className="col-lg-6">
                              <label>
                                Time <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  name="time"
                                  required
                                  type="text"
                                  value={data.time}
                                  placeholder="29/10 - 29/11/2020"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 padding-input-kitin">
                              <label>
                                Type <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  as="select"
                                  required
                                  name="type"
                                  value={data.type}
                                  className="form-control"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                >
                                  <option value="">Choose Type</option>
                                  <option value="Full time">Full time</option>
                                  <option value="Part time">Part Time</option>
                                  <option value="Freelance">Freelance</option>
                                </Form.Control>
                              </div>
                            </div>
                          </div>

                          <div className="form-group row pt-3">
                            <div className="col-lg-6">
                              <label>
                                Title Page{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  name="titlePage"
                                  required
                                  type="text"
                                  value={data.titlePage == null ? "" : data.titlePage}
                                  placeholder="Type title to show in job detail..."
                                  maxLength="100"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                />
                                <span className="form-text text-muted">
                                  &nbsp; It is used to seo the web (max 60
                                  characters)
                                </span>
                              </div>
                            </div>
                            <div className="col-lg-6 padding-input-kitin">
                              <label>
                                Desc Meta{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <div>
                                <Form.Control
                                  name="metaJob"
                                  required
                                  type="text"
                                  value={data.metaJob == null ? "" : data.metaJob}
                                  placeholder="Type meta description content..."
                                  maxLength="100"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                />
                                <span className="form-text text-muted">
                                  &nbsp; It is used to seo the web (max 60
                                  characters)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="separator separator-dashed my-10" />
                        <h3 className=" text-dark font-weight-bold mb-10">
                          Note from leader 
                        </h3>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label>Keyword</label>
                            <div>
                              <Form.Control
                                as="textarea"
                                name="keyword"
                                type="text"
                                rows="4"
                                value={data.keyword == null ? "" : data.keyword}
                                onChange={this.handleChange}
                                className="form-control-solid"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 padding-input-kitin">
                            <label>Note</label>
                            <div>
                              <Form.Control
                                as="textarea"
                                name="note"
                                type="text"
                                rows="4"
                                value={data.note}
                                onChange={this.handleChange}
                                className="form-control-solid"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-lg-6">
                            <label>Desc Job</label>
                            <div>
                              <Form.Control
                                as="textarea"
                                name="descJob"
                                type="text"
                                value={data.descJob == null ? "" : data.descJob}
                                onChange={this.handleChange}
                                rows="4"
                                className="form-control-solid"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 padding-input-kitin">
                            <label>Interview Process</label>
                            <div>
                              <Form.Control
                                as="textarea"
                                name="interviewProcess"
                                type="text"
                                rows="4"
                                value={data.interviewProcess == null ? "" : data.interviewProcess}
                                onChange={this.handleChange}
                                className="form-control-solid"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-lg-6">
                          <label>Extra benefit</label>
                          <div>
                            <Form.Control
                              as="textarea"
                              name="extraBenefit"
                              type="text"
                              rows="4"
                              value={data.extraBenefit == null ? "" : data.extraBenefit }
                              onChange={this.handleChange}
                              className="form-control-solid"
                            />
                          </div>
                          </div>
                          <div className="col-lg-6 padding-input-kitin">
                          <label>Status</label>
                          <div>
                            <Form.Control
                                  as="select"
                                  required
                                  name="jobStatus"
                                  value={data.jobStatus}
                                  className="form-control"
                                  onChange={this.handleChange}
                                  className="form-control-solid"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Close">Close</option>
                                  <option value="Archive">Archive</option>
                                </Form.Control>
                          </div>
                          </div>
                        </div>

                        <div className="separator separator-dashed my-10" />
                        <div className="my-5">
                          <h3 className=" text-dark font-weight-bold mb-10">
                            Description:
                          </h3>

                          <div className="form-group row">
                            <label className="col-md-2">About Fetch</label>
                            <div className="col-md-10">
                              <EditorCustom key={1} ref={this.editorOne} />
                            </div>
                          </div>
                          <div className="form-group row" ref={this.scrollClient}>
                            <label className="col-md-2">
                              Client <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="col-md-10">
                              <Form.Control
                                as="select"
                                required
                                name="client"
                                className="form-control"
                                value={data.client ? data.client.id : ""}
                                onChange={this.handleSelectClient}
                              >
                                <option value="">Choose Client</option>
                                {optClient}
                              </Form.Control>
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-2">Responsibilities</label>
                            <div className="col-md-10">
                              <EditorCustom key={3} ref={this.editorThree} />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-2">Requirement</label>
                            <div className="col-md-10">
                              <EditorCustom key={4} ref={this.editorFour} />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-2">Nice To Have:</label>
                            <div className="col-md-10">
                              <EditorCustom key={5} ref={this.editorFive} />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label className="col-md-2">
                              Why You'll Love Working Here:
                            </label>
                            <div className="col-md-10">
                              <EditorCustom key={6} ref={this.editorSix} />
                            </div>
                          </div>

                          <div className="form-group row">
                            <label className="col-md-2">Skill required</label>
                            <div className="col-md-10 form-group-nam">
                              <div className="kynang">
                                {data.arr_skill_required.map(
                                  function (tag, index) {
                                    return (
                                      <span className="tag-item" key={index}>
                                        <span className="tag badge-ivtx">
                                          <span>{tag.name}</span>
                                          <span
                                            className="rm-tag"
                                            onClick={this.removeTag.bind(
                                              this,
                                              index
                                            )}
                                          >
                                            <i className="la la-remove icon-nm" />
                                          </span>
                                        </span>
                                      </span>
                                    );
                                  }.bind(this)
                                )}
                              </div>
                              <div className="user-invite-container">
                                <div className="tags-input-list">
                                  <input
                                    className="tag-input kitin-input-tag"
                                    type="text"
                                    onChange={this.handleSkillRequired}
                                    value={this.state.val}
                                    placeholder="Search skill and choose"
                                  />
                                  <div
                                    className={
                                      this.state.suggestion == 0
                                        ? "list-suggess hide"
                                        : "list-suggess"
                                    }
                                  >
                                    <ul>
                                      {this.state.suggestion.map(
                                        function (suggess, index) {
                                          return (
                                            <li
                                              className="suggess-item"
                                              key={index}
                                              onClick={this.selectSkillRequired.bind(
                                                this,
                                                suggess,
                                                index
                                              )}
                                            >
                                              <div className="fullname">
                                                {suggess.name}
                                              </div>
                                            </li>
                                          );
                                        }.bind(this)
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row form-group">
                            <label className="col-md-2">Skill</label>

                            <div className="col-md-10 form-group-nam">
                              <div className="kynang">
                                {data.arr_skill.map(
                                  function (tag, index) {
                                    return (
                                      <span className="tag-item" key={index}>
                                        <span className="tag badge-ivtx">
                                          <span>{tag.name}</span>
                                          <span
                                            className="rm-tag"
                                            onClick={this.removeTagSkill.bind(
                                              this,
                                              index
                                            )}
                                          >
                                            <i className="la la-remove icon-nm" />
                                          </span>
                                        </span>
                                      </span>
                                    );
                                  }.bind(this)
                                )}
                              </div>
                              <div className="user-invite-container">
                                <div className="tags-input-list">
                                  <input
                                    className="tag-input kitin-input-tag"
                                    type="text"
                                    onChange={this.handleSkill}
                                    value={this.state.valTwo}
                                    placeholder="Search skill and choose"
                                  />
                                  <div
                                    className={
                                      this.state.suggestionTwo == 0
                                        ? "list-suggess hide"
                                        : "list-suggess"
                                    }
                                  >
                                    <ul>
                                      {this.state.suggestionTwo.map(
                                        function (suggess, index) {
                                          return (
                                            <li
                                              className="suggess-item"
                                              key={index}
                                              onClick={this.selectSkill.bind(
                                                this,
                                                suggess,
                                                index
                                              )}
                                            >
                                              <div className="fullname">
                                                {suggess.name}
                                              </div>
                                            </li>
                                          );
                                        }.bind(this)
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="separator separator-dashed my-10" />
                      </div>
                      <div className="col-xl-1" />
                    </div>
                  </div>
                </div>
              </Form>
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

export default connect(mapStateToProps)(EditJob);
