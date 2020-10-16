import React, { Component } from "react";
import EditorCustom from './EditorCustom.jsx';
import EditorCustomTwo from './EditorCustomTwo.jsx';
import { Form, Button } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Icon } from "@iconify/react";
import { ToastContainer, toast } from 'react-toastify';
import deleteOutline from "@iconify/icons-typcn/delete-outline";
import "./style.css";

import Network from "../../Service/Network";
const api = new Network();
var timer = null;
var timerTwo = null;
var aboutFetch = `<p><span style="color: rgb(21, 188, 197);"><strong> 1. INSTRUCTION</strong></span></p><p><strong>a. About Fetch:</strong></p>
<p>Fetch Technology Vietnam is a comprehensive global provider of HR and Talent Acquisition Services, focusing primarily in the technology fields. Founded in 2016, Fetch Technology Vietnam helps foreign companies of all types and sizes reach their potential by providing the talent and support to efficiently build and scale a high-performing, distributed workforce in Vietnam.</p>
<p>Our mission is to offer Vietnam’s most talented technologists a platform to connect with some of the world’s leading tech companies and build their expertise on a global scale. Over 4 years, Fetch has built a good reputation and is trusted by many Vietnamese and foreign companies; And Fetch will continue its good work to bridge the divide between the World and the Vietnam Tech sector.</p>`;
var aboutClient = `<p><strong>b. About Client:</strong></p>`;
var responsibiltties = `<p><span style="color: rgb(21, 188, 197);"><strong>2. RESPONSIBILITIES</strong></span></p>`;
var why = `<p><span style="color: rgb(21, 188, 197);"><strong>4. WHY YOU‘LL LOVE WORKING HERE</strong></span></p>`;
var required = `<p><span style="color: rgb(21, 188, 197);"><strong>3. REQUIREMENT</strong></span></p>`;
export default class PostJob extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeE = this.handleChangeE.bind(this);
    this.findSkill = this.findSkill.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.selectTag = this.selectTag.bind(this);

    this.handleChangeETwo = this.handleChangeETwo.bind(this);
    this.findSkillTwo = this.findSkillTwo.bind(this);
    this.removeTagTwo = this.removeTagTwo.bind(this);
    this.selectTagTwo = this.selectTagTwo.bind(this);

    this.getListSkill = this.getListSkill.bind(this);
    this.setTagSkill = this.setTagSkill.bind(this);

    this.editorOne = React.createRef();
    this.editorTwo = React.createRef();
    this.editorThree = React.createRef();
    this.editorFour = React.createRef();
    this.editorFive = React.createRef();
    this.editorSix = React.createRef();

    this.state = {
      validated: false,
      tags: [], //skill
      tagsTwo: [],
      val: "",
      valTwo: "",
      suggestion: [],
      suggestionTwo: [],
      listSkill: [],
      title: "",
      location: "",
      type: "",
      time: "",
      salary: ""
    };
  }

  async findSkill(keyword) {
    try {
      if (keyword) {
        const arraySkill = this.state.listSkill.filter(function (item) {
          return item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        })
        // const skill = await api.post("/api/skill/admin/search", { skill: keyword });
        this.setState({ suggestion: arraySkill });
      } else {
        this.setState({ suggestion: [] });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async findSkillTwo(keyword) {
    var self = this;
    try {
      if (keyword) {
        const arraySkill = this.state.listSkill.filter(function (item) {
          return item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
        })
        // const skill = await api.post("/api/skill/admin/search", { skill: keyword });
        /* Check Trung Skill*/
        if(this.state.tags.length>0){
          var filteredArray  = arraySkill.filter(function(array_el){
            return self.state.tags.filter(function(anotherOne_el){
               return anotherOne_el.id == array_el.id;
            }).length == 0
          });
          console.log("=====>",filteredArray);
         this.setState({ suggestionTwo: filteredArray });

        }else{
          this.setState({ suggestionTwo: arraySkill });
        }
      } else {
        this.setState({ suggestionTwo: [] });
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleChangeE(event) {
    let skill = event.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.findSkill(skill);
    }, 100);
    this.setState({ val: event.target.value });
    console.log(skill);
  }

  handleChangeETwo(event) {
    let skill = event.target.value;
    clearTimeout(timerTwo);
    timerTwo = setTimeout(() => {
      this.findSkillTwo(skill);
    }, 100);
    this.setState({ valTwo: event.target.value });
  }


  selectTag(suggess, index, e) {
    var current_tag = this.state.tags;
    current_tag.push({ id: suggess.id, name: suggess.name });
    this.setState({ tags: current_tag, suggestion: [], val: "" });
  }

  selectTagTwo(suggess, index, e) {
    var current_tag_two = this.state.tagsTwo;
    current_tag_two.push({ id: suggess.id, name: suggess.name });
    this.setState({ tagsTwo: current_tag_two, suggestionTwo: [], valTwo: "" });
  }

  removeTag(position) {
    this.state.tags.splice(position, 1);
    this.setState({ tags: this.state.tags, suggestion: [] });
  }

  removeTagTwo(position) {
    this.state.tagsTwo.splice(position, 1);
    this.setState({ tagsTwo: this.state.tagsTwo, suggestionTwo: [] });
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  async handleSubmit(event) {
    const form = event.currentTarget;
    let currentTargetRect = event.target.getBoundingClientRect();
    const event_offsetY = -currentTargetRect.top;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      window.scroll({
        top: event_offsetY - 1800,
        left: 0,
        behavior: 'smooth',
      });
      this.setState({ validated: true });
      return;
    }
    var array_skill = [];
    if (this.state.tags.length > 0) {
      this.state.tags.map((item) => {
        array_skill.push(item.id);
      })
    }
    if (this.state.tagsTwo.length > 0) {
      this.state.tagsTwo.map((item) => {
        array_skill.push(item.id);
      })
    }
    console.log(array_skill);

    let content = "";
    switch (this.state.location) {
      case "1": {
        content = `<p>FETCH - FETCH Cầu Giấy, 3rd Floor, Dai Phat Building - Lane 82, Duy Tan Street, Dich Vong Hau ward, Cau Giay District, Ha Noi City</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "2": {
        content = `<p>FETCH - FETCH Hồ Bá Phấn, 42B Ho Ba Phan Street, Phuoc Long A Ward, District 9, Ho Chi Minh City</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "3": {
        content = `<p>FETCH - FETCH Điện Biên Phủ, 3rd Floor, 194 Golden Building - 473 Dien Bien Phu Street, Ward 25, Binh Thanh District, Ho Chi Minh City</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "4": {
        content = `<p>FETCH - Up Co-working Space - Hai Ba Trung District, 7th Floor, Hanoi Creative City Building - 1 Luong Yen Street, Hai Ba Trung District, Ha Noi City</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "5": {
        content = `<p>FETCH  - FETCH HCM/HN</p><p>- Ho Chi Minh: 3rd Floor, 194 Golden Building - 473 Dien Bien Phu Street, Ward 25, Binh Thanh District.</p><p>- Ha Noi: 3rd Floor, Dai Phat Building - Lane 82, Duy Tan Street, Dich Vong Hau Ward, Cau Giay District</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "6": {
        content = `<p>FETCH - 364 Cong Hoa Street, Tan Binh District, Ho Chi Minh City</p><p><span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
        break;
      }
      case "7": {
        content = `<p>FETCH - Onsite, Singapore, <span style="color: rgb(136, 136, 136);">${this.state.type}</span></p>`
      }
    }
    let dataDesc = '';
    const valueOne = this.editorOne.current.getContent(); //About FETCH
    const valueTwo = this.editorTwo.current.getContent(); //About Client
    const valueThree = this.editorThree.current.getContent(); //RESPONSIBILITIES:
    const valueFour = this.editorFour.current.getContent(); //REQUIREMENT:
    const valueFive = this.editorFive.current.getContent(); //NICE TO HAVE:
    const valueSix = this.editorSix.current.getContent(); //WHY YOU‘LL LOVE WORKING HERE:
    let total = valueOne + valueTwo + valueThree + valueFour + valueFive + valueSix;
    dataDesc = `<div>${total}</div>`

    try {
      const data = {
        title: this.state.title || "",
        content: content,
        location: this.state.location,
        type: this.state.type || "",
        time: this.state.time || "",
        salary: this.state.salary || "",
        enable: true,
        aboutFetch: valueOne || "",
        aboutClient: valueTwo || "",
        responsibilities: valueThree || "",
        requirement: valueFour || "",
        niceToHave: valueFive || "",
        why: valueSix || "",
        candidates: [],
        required: this.state.tags,
        notRequired: this.state.tagsTwo,
        skills: array_skill
      }
      this.setState({ validated: false });
      console.log(data);
      const response = await api.post("/jobs", data);
      if (response) {
        this.setState({
          tags: [],
          tagsTwo: [],
          title: "",
          location: "",
          type: "",
          time: "",
          salary: ""
        })
        toast.success("Post Job Success!", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        toast.error("Something went wrong please try again later!", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong please try again later!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  async getListSkill() {
    try {
      const response = await api.get('/skills');
      console.log(response);
      this.setState({
        listSkill: response
      })
    } catch (err) {
      console.log(err);
    }
  }

  setTagSkill = async () => {
    let cata = await this.refs.editorFour.getContent();
    var temp_tag = [];
    var allSkill = this.state.listSkill;
    for (let i = 0; i < allSkill.length; i++) {
      if (cata.toLowerCase().indexOf(allSkill[i].name.toLowerCase()) !== -1) {
        temp_tag.push(allSkill[i]);
      }
      if (temp_tag.length === 10) break;
    }
    this.setState({
      tags: temp_tag
    })
  }

  setTagSkillNotRequired = async () => {
    var self = this;
    let cata = await this.refs.editorFive.getContent();
    var temp_tag_two = [];
    var allSkill = this.state.listSkill;
    for (let i = 0; i < allSkill.length; i++) {
      if (cata.toLowerCase().indexOf(allSkill[i].name.toLowerCase()) !== -1) {
        temp_tag_two.push(allSkill[i]);
      }
      if (temp_tag_two.length === 5) break;
    }
    // Check Trung Skill
    if (this.state.tags.length > 0) {
      var filteredArray = temp_tag_two.filter(function (array_el) {
        return self.state.tags.filter(function (anotherOne_el) {
          return anotherOne_el.id == array_el.id;
        }).length == 0
      });
      this.setState({
        tagsTwo: filteredArray
      })

    } else {
      this.setState({
        tagsTwo: temp_tag_two
      })
    }
  }

  componentDidMount() {
    this.getListSkill();
    this.editorOne.current.setContent(aboutFetch);
    this.editorTwo.current.setContent(aboutClient);
    this.editorThree.current.setContent(responsibiltties);
    this.editorFour.current.setContent(required);
    this.editorSix.current.setContent(why);
  }

  render() {
    return (
      <div className="main-content" id="panel" style={{ background: '#f8f9fe' }}>
        <ToastContainer />
        <h3 style={{ paddingTop: "30px", textAlign: "center" }}>
          Post Job To Fetch Tech
        </h3>
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <div className="container" style={{ paddingTop: "30px" }}>
            <div className="row">
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Title: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Form.Control
                  name="title"
                  required
                  type="text"
                  placeholder="HN - Senior Nodejs"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="row" style={{ paddingTop: "20px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Address: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Form.Control
                  as="select"
                  required
                  name="location"
                  className="form-control"
                  value={this.state.location}
                  onChange={this.handleChange}
                >
                  <option value="">Choose address</option>
                  <option value="1">
                    Hà Nội
                  </option>
                  <option value="2">
                    Hồ Chí Minh - (Hồ Bá Phấn)
                  </option>
                  <option value="3">
                    Hồ Chí Minh - (Điện Biên Phủ)
                  </option>
                  <option value="5edf78a9-b099-4a6d-a043-4c951524a45c">
                    Onsite - Singapore
                  </option>
                  <option value="12303b56-0409-4de4-8737-0bd46c8963a0">
                    Fetch HCM/HN
                  </option>
                  <option value="7d2ea7d4-32c1-4618-b579-bfb91341c6e5">
                    Up Co-working Space - Hai Ba Trung District
                  </option>
                  <option value="bf250c19-1440-4937-be97-4cbe3b7b3055">
                    364 Cong Hoa Street, Tan Binh District, Ho Chi Minh City
                  </option>

                </Form.Control>
              </div>
            </div>

            <div className="row" style={{ paddingTop: "20px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Salary: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Form.Control
                  name="salary"
                  required
                  type="text"
                  value={this.state.salary}
                  placeholder="1000 - 1500 USD"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="row" style={{ paddingTop: "20px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Deadline: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Form.Control
                  name="time"
                  value={this.state.time}
                  required
                  type="text"
                  placeholder="30/03 - 30/4/2020"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="row" style={{ paddingTop: "20px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Type: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Form.Control
                  as="select"
                  value={this.state.type}
                  required
                  name="type"
                  className="form-control"
                  onChange={this.handleChange}
                >
                  <option value="">Choose type</option>
                  <option value="Full time">Full time</option>
                  <option value="Part time">Part time</option>
                  <option value="Freelance">Freelance</option>
                </Form.Control>
              </div>
            </div>

            {/* <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Description: <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <div className="col-md-10">
                <Editor
                  editorState={this.state.editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  editorStyle={{
                    border: "1px solid #F1F1F1",
                    height: "200px",
                    paddingLeft: "10px"
                  }}
                  onEditorStateChange={this.onEditorStateChange}
                />
              </div>
            </div> */}
            <div className="row" style={{ paddingTop: "30px", fontSize: "20px", paddingLeft: '15px' }}>Description:</div>
            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  INTRODUCTION:<br /> About FETCH
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustom key={1} ref={this.editorOne} />
              </div>
            </div>
            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  INTRODUCTION:<br />About Client
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustom key={2} ref={this.editorTwo} />
              </div>
            </div>
            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  RESPONSIBILITIES:
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustom key={3} ref={this.editorThree} />
              </div>
            </div>

            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  REQUIREMENT:
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustomTwo key={4} ref={this.editorFour} handleTagSkill={this.setTagSkill} />
              </div>
            </div>
            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  NICE TO HAVE:
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustomTwo key={5} ref={this.editorFive} handleTagSkill={this.setTagSkillNotRequired} />
              </div>
            </div>



            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "16px" }}>
                  WHY YOU‘LL LOVE WORKING HERE:
                </Form.Label>
              </div>
              <div className="col-md-10">
                <EditorCustom key={6} ref={this.editorSix} />
              </div>
            </div>



            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Skill required:
                </Form.Label>
              </div>
              <div className="col-md-10 form-group form-group-nam">
                <div className="kynang">
                  {this.state.tags.map(
                    function (tag, index) {
                      return (
                        <span className="tag-item" key={index}>
                          <span className="tag badge-ivtx">
                            <span>{tag.name}</span>
                            <span
                              className="rm-tag"
                              onClick={this.removeTag.bind(this, index)}
                            >
                              <Icon
                                icon={deleteOutline}
                              />
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
                      onChange={this.handleChangeE}
                      onKeyDown={this.keyPressedE}
                      value={this.state.val}
                      onBlur={this.handleFocusE}
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
                                onClick={this.selectTag.bind(
                                  this,
                                  suggess,
                                  index
                                )}
                              >
                                <div className="fullname">{suggess.name}</div>
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

            <div className="row" style={{ paddingTop: "30px" }}>
              <div className="col-md-2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Skill:
                </Form.Label>
              </div>
              <div className="col-md-10 form-group form-group-nam">
                <div className="kynang">
                  {this.state.tagsTwo.map(
                    function (tag, index) {
                      return (
                        <span className="tag-item" key={index}>
                          <span className="tag badge-ivtx">
                            <span>{tag.name}</span>
                            <span
                              className="rm-tag"
                              onClick={this.removeTagTwo.bind(this, index)}
                            >
                              <Icon
                                icon={deleteOutline}
                              />
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
                      onChange={this.handleChangeETwo}
                      value={this.state.valTwo}
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
                                onClick={this.selectTagTwo.bind(
                                  this,
                                  suggess,
                                  index
                                )}
                              >
                                <div className="fullname">{suggess.name}</div>
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
            <div className="row" style={{ padding: '50px 0' }}>
              <Button variant="info" type="submit" style={{ width: '150px', margin: 'auto', cursor: 'pointer' }}>Post</Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
