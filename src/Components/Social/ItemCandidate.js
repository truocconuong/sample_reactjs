import React, { Component } from "react";

export default class ItemCandidate extends Component {
  render() {
    return (
      <div
        className={
          this.props.isChecked
            ? "card card-custom gutter-b-kitin sp-candItem_checked"
            : "card card-custom gutter-b-kitin"
        }
      >
        <div className="card-header card-header-mobile border-0 pt-5">
          <div className="sp-candItem__main">
            <a
              className="sp-candItem__avatar pull-left"
              href="/candidates/000019a75ad911e68155feb79ce8b6d8"
            >
              <div className="sp-photoField sp-photoField_sm">
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
                    <div className="sp-nameField__inner">David Contorno</div>
                  </div>
                </div>
              </div>
              <div className="sp-candItem__subName">
                Founder at E Powered Benefits
              </div>
              <div>
                <span className="sp-candItem__city">
                  Mooresville, North Carolina, United States
                </span>
              </div>
              <div>23 years exp</div>
            </div>
          </div>
          <div className="sp-candItem__main">
            <div className="sp-candItem__avatar"></div>
            <div className="sp-candItem__mainBody">
            
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
            </div>
          </div>
          <div className="sp-candItem__main">
            <div className="sp-candItem__avatar">Prev</div>
            <div className="sp-candItem__mainBody">
            <span>Regional Practice Leader - Employee Benefits at The Hilb Group, President at Lake Norman Benefits</span>
            </div>
          </div>
          <div className="sp-candItem__main">
            <div className="sp-candItem__avatar">Prev</div>
            <div className="sp-candItem__mainBody">
            <span>Account Management, Affordable Care Act, Brokers, Budgeting, Budgets, Business Development, Cold Calling, Customer Retention, Customer Service, Disability Insurance</span>
            </div>
          </div>
        
        </div>
      </div>
    );
  }
}
