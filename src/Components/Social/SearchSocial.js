import React, { Component } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import CustomToast from "../common/CustomToast.js";
import { connect } from "react-redux";
import "./SearchSocial.css";
import ItemCandidate from "./ItemCandidate";
import Network from "../../Service/Network";
import {StageSpinner} from "react-spinners-kit";
const api = new Network();


class SearchSocial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: true,
      keyword: "email",
      title: "",
      isloadingItem: false,
      data: {},
    };
  }

  onChangeRadio = (event) => {
    if (event.target.value === "email") {
      this.setState({
        placeholder: true,
        keyword: event.target.value,
      });
    } else {
      this.setState({
        placeholder: false,
        keyword: event.target.value,
      });
    }
  };

  onChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isloadingItem: true,
    });
    let idRequest = await api.postSearchSignHire({items: [
      this.state.title
    ]})
    if(idRequest) {
      this.setState({
        isloadingItem: true,
      });
    }
    console.log("======>", idRequest);
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
                            <input
                              type="radio"
                              name="keyword"
                              value="keyword"
                              checked={this.state.keyword === "keyword"}
                              onChange={this.onChangeRadio}
                            />
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
                          value={this.state.title}
                          onChange={this.onChange}
                          className="form-control form-control-solid"
                          placeholder={
                            this.state.placeholder ? "kitinkhanh@gmail.com" : ""
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <button
                          onClick={this.onSubmit}
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
              {
                this.state.isloadingItem ? <div className="cs-loading-item-kt"><StageSpinner color="#1bc5bd" /></div> : <ItemCandidate isChecked={true} />
              }
             
            </div>
            <div className="col-md-8 ml-5">
              <div className="card card-custom item-cd-detail">
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
                            <div>I am here where you are</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ marginTop: "25px" }}>
                  <div className="sp-candItem__main">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Position:
                          </td>
                          <td className="color-content">
                            Lead of Design Studio / Product Design Manager -
                            Growth Designer
                          </td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Company:
                          </td>
                          <td className="color-content">Home Credit Vietnam</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Location:
                          </td>
                          <td className="color-content">Vietnam, Viet Nam</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em">Experience:</td>
                          <td className="color-content">12 years exp</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="sp-contact__main mt-3">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        <tr className="contacts">
                          <td className="title custom-ct-em">
                            <span className="title-ct-profile">
                              Contact Info
                            </span>
                          </td>
                          <td className="p-t" />
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Skype:
                          </td>
                          <td className="color-content">jangtrinh.efe</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Mobile Phone:
                          </td>
                          <td className="color-content">+84983714641</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em p-t-kitin">
                            Unknown Phone:
                          </td>
                          <td className="color-content">+8426180581</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title custom-ct-em">Email:</td>
                          <td className="color-content">
                            <div>
                              <div className="profile-contact break-word">
                                <span>trinhnguyengiang@gmail.com</span>
                              </div>
                              <div className="profile-contact break-word">
                                <span>jang@uxhacker.co</span>
                              </div>
                              <div className="profile-contact break-word">
                                <span>jang.trinh@efe.com.vn</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr className="contacts">
                          <td className="title tb-contact-k p-t-kitin">
                            Yahoo! Messenger:
                          </td>
                          <td className="color-content">lamchuyen2004</td>
                        </tr>
                        <tr className="contacts">
                          <td className="title tb-contact-k custom-ct-em">
                            Google Hangouts:
                          </td>
                          <td className="color-content">
                            <div>
                              <div className="profile-contact break-word">
                                <span>giang.trinh@pi.exchange.com</span>
                              </div>
                              <div className="profile-contact break-word">
                                <span>giang.tn@homecredit.vn</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="sp-contact__main pb-2 pt-2">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        <tr>
                          <td className="custom-ct-em">Social:</td>
                          <td>
                            <div className="sp-candItem__contacts">
                              <li className="btn btn-social-kitin btn-primary">
                                <i className="fa fa-phone" />
                              </li>
                              <li className="btn btn-social-kitin btn-primary">
                                <i className="far fa-envelope"></i>
                              </li>
                              <li className="btn btn-social-kitin btn-social_li">
                                <i className="fab fa-linkedin-in"></i>
                              </li>
                              <li className="btn btn-social-kitin btn-social_twitter">
                                <i className="fab fa-twitter"></i>
                              </li>
                              <li className="btn btn-social-kitin btn-social_fb custom-icon__skype">
                                <i className="fab fa-facebook-f"></i>
                              </li>
                              <li className="btn btn-social-kitin btn-social_pinterest">
                                <i className="fab fa-pinterest-p"></i>
                              </li>
                              <li className="btn btn-social-kitin btn-social_skype custom-icon__skype">
                                <i className="fab fa-skype"></i>
                              </li>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="sp-contact__main">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <tbody>
                        <tr className="contacts">
                          <td className="title custom-ct-em">
                            <span className="title-ct-profile">Profile</span>
                          </td>
                          <td className="p-t" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="sp-contact__main">
                    <div className="title-skill-dh">Skill</div>
                    <div className="sp-skillsList">
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">AJAX</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Art Direction</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Coder</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">CSS</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Design</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Designer</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Digital Photography</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Facebook</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Front-end</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Front-end Coding</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Front-end Design</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Front-end Development</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Git</div>
                      </div>
                      <div className="sp-skillsList__item">
                        <div className="sp-sk-item">Graphic Design</div>
                      </div>
                    </div>
                  </div>
                  <div className="sp-contact__main pt-4">
                    <div className="title-skill-dh">Work experience</div>
                    <div className="group-item">
                      <table className="profile-table">
                        <tbody>
                          <tr>
                            <td className="title tb-contact-k custom-ct-em">
                              Oct 2018 - current time
                            </td>
                            <td>
                              <div>
                                Lead of Design Studio / Product Design Manager -
                                Growth Designer
                              </div>
                              <div className="text-lighter">Vietnam</div>
                              <div className="text-muted">
                                <div>Home Credit Vietnam</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary collapsed">
                                  <div>
                                    Lead design projects across the entire
                                    product lifecycle and multiple product
                                    launches. I will set the vision for the user
                                    experience and create the space for others
                                    to collaborate.
                                  </div>
                                  <div>
                                    Our teams focus on listening to users, and
                                    letting their needs guide us to the best
                                    solutions. It’s important for us to know we
                                    are solving for real people and not just the
                                    loudest voice in the room.
                                  </div>
                                  <div>
                                    I partner closely with engineering, product,
                                    and business folks to find elegant but
                                    practical solutions to design challenges. I
                                    provide the thought leadership to develop
                                    the right product strategy. Together, We
                                    solve problems and come up with solutions
                                    that delight our users.
                                  </div>
                                  <div>
                                    Be autonomous. I take full ownership my
                                    work, and take responsibility for every last
                                    detail, every step of the way.
                                  </div>
                                  <div>
                                    Rapidly produce multiple concepts and
                                    prototypes; knowing when to apply
                                    pixel-perfect attention to detail, and when
                                    to make low-fi sketches and prototypes.
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td className="title custom-ct-em">
                              Apr 2017 - May 2018
                            </td>
                            <td>
                              <div>Senior Product Designer</div>
                              <div className="text-lighter">
                                Melbourne, Australia
                              </div>
                              <div className="text-muted">
                                <div>pi.exchange</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary">
                                  <div>
                                    Everything which related to DESIGN works.
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td className="title custom-ct-em">
                              Jan 2016 - current time
                            </td>
                            <td>
                              <div>Founder</div>
                              <div className="text-lighter">Vietnam</div>
                              <div className="text-muted">
                                <div>UX Hacker</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary">
                                  <div>
                                    UX hacker is a forum for Vietnamese people
                                    who have passion about UX, growth hacking in
                                    Vietnam can connect together.
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td className="title custom-ct-em">
                              Aug 2014 - Dec 2015
                            </td>
                            <td>
                              <div>Senior UI/UX Designer</div>
                              <div className="text-lighter">
                                Ho Chi Minh city
                              </div>
                              <div className="text-muted">
                                <div>WebOnyx</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary collapsed">
                                  <div>
                                    • Analyze requirements and user stories in
                                    order to derive design requirements
                                  </div>
                                  <div>
                                    • Produce creative assets such as comps,
                                    sketches, and wire-frames.
                                  </div>
                                  <div>
                                    • Provide insights and out-of-box thinking
                                    related to application product development
                                  </div>
                                  <div>
                                    • Create style guides and other design
                                    documentation
                                  </div>
                                  <div>
                                    • Review application UIs for consistency,
                                    aesthetics, and user experience
                                  </div>
                                  <div>
                                    • Pay extreme attention to details related
                                    to application product development to
                                    support a superior level of quality and
                                    brand.
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td className="title custom-ct-em">
                              Apr 2013 - Apr 2014
                            </td>
                            <td>
                              <div>Senior Web Designer</div>
                              <div className="text-lighter">
                                Da Nang, Vietnam
                              </div>
                              <div className="text-muted">
                                <div>Green Global Software Company</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary">
                                  <div>
                                    Design UI &amp; UX for website layout.
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr></tr>
                          <tr>
                            <td className="title custom-ct-em">
                              Jan 2008 - current time
                            </td>
                            <td>
                              <div>Creative Director</div>
                              <div className="text-lighter">
                                Hồ Chí Minh city
                              </div>
                              <div className="text-muted">
                                <div>EFE Technology</div>
                              </div>
                              <div className="summary-wrap">
                                <div className="summary collapsed">
                                  <div>- Creative Director</div>
                                  <div>- Technical Supervisor</div>
                                  <div>- Senior UI/UX Designer.</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="sp-contact__main pt-4">
                    <div className="title-ct-profile">Education</div>
                    <div className="group-item">
                      <table className="profile-table" style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td className="title custom-ct-em">
                              2006 - 2010
                            </td>
                            <td>
                              <div className>Multimedia</div>
                              <div className="text-lighter">
                                Bachelor's degree
                              </div>
                              <div className="text-muted">
                                <div>Singapore Informatics</div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="sp-contact__main">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <div className="pt-3 pb-2">
                        <span className="title-ct-profile">Head line</span>
                      </div>
                      <div>
                        Lead of Design Studio / Product Design Manager - Growth
                        Designer at Home Credit Vietnamiv
                      </div>
                    </table>
                  </div>

                  <div className="sp-contact__main">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <div className="pt-3 pb-2">
                        <span className="title-ct-profile">Summary</span>
                      </div>
                      <div>
                        Enthusiastic and Passionate Product Maker, Process Geek.
                      </div>
                    </table>
                  </div>

                  <div className="sp-contact__main">
                    <table
                      className="profile-table m-b"
                      style={{ width: "100%" }}
                    >
                      <div className="pt-3 pb-2">
                        <span className="title-ct-profile">Languages</span>
                      </div>
                      <div>English</div>
                      <div>Vietnamese</div>
                    </table>
                  </div>
                  <div className="bt-social-kt">
                      
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
