import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Network from "../../Service/Network";
import { EditorState, convertToRaw, ContentState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { getSelectedBlock } from "draftjs-utils";
import slugify from "slugify";
import { toast } from "react-toastify";
import CustomToast from "../common/CustomToast";

import "./blog.css";

const api = new Network();
const html = "<p></p>";
const contentBlock = htmlToDraft(html);
const contentState = ContentState.createFromBlockArray(
  contentBlock.contentBlocks
);

function NewBlog(props) {
  const [styleHeader, setStyleHeader] = useState("card-header");
  const [isDisableSave, setIsDisableSave] = useState(false);
  const [requireTitle, setRequireTitle] = useState(false);
  const [requireDraft, setRequireDraft] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );
  const [title, setTitle] = useState("");
  const handleScroll = () => {
    let lengthScroll = window.pageYOffset;
    if (lengthScroll > 220) {
      setStyleHeader("card-header style-header-job");
    } else {
      setStyleHeader("card-header");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const getContent = () => {
    return draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    ).replaceAll(/\r?\n|\r/g, "");
  };

  const getStringdata = () => {
    return editorState;
  };
  const onSave = async () => {
    // console.log(convertToRaw(editorState.getCurrentContent()));
    setRequireTitle(false);
    setRequireDraft(false);
    if (title === "") {
      setRequireTitle(true);
      return;
    }
    let content = getContent();
    if (content === "<p></p>") {
      setRequireDraft(true);
      return;
    }
    console.log(content);
    console.log(convertToRaw(editorState.getCurrentContent()));
    let firstPara = convertToRaw(editorState.getCurrentContent()).blocks.find(
      (e) => e.text.replaceAll(" ", "") !== ""
    );
    if (firstPara) {
      firstPara = firstPara.text;
    } else {
      firstPara = "";
    }
    // find img src
    let m,
      urls = [], // luu link anh
      str = getContent() + "",
      rex = /<img.*?src="(.*?)"[^\>]+>/g;

    while ((m = rex.exec(str))) {
      urls.push(m[1]);
    }
    try {
      let data = {
        title: title,
        content: content,
        img: JSON.stringify(urls),
        firstPara: firstPara,
        slug: slugify(title.toLowerCase()),
      };
      console.log(data);
      const response = await api.post(`/api/blog`, data);
      if (response) {
        // console.log(response.data);
        setIsDisableSave(true);
        toast(<CustomToast title={"Post Success!"} />, {
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
    } catch (error) {
      console.log("err while post blog");
    }
  };

  const callbackImgUpload = (file) => {
    return new Promise((resolve, reject) => {
      try {
        let file_size = file.size;
        if (file_size > 3145728) {
          reject(false);
        }
        var formData = new FormData();
        formData.append("imageBlog", file);
        const request_header = api.getHeaderUpload();
        const request_server = api.domain;
        var self = this;
        const config = {
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            self.setState({ uploadProcess: percentCompleted });
          },
        };
        config.headers = request_header.headers;
        // this.setState({ loadingUpload: true });
        axios
          .post(request_server + "/api/upload/blog-image", formData, config)
          .then((res) => {
            if (res) {
              console.log(request_server + "/" + res.data.data.link);
              resolve({
                data: { link: request_server + "/" + res.data.data.link },
              });
            } else {
              //   this.setState({ loadingUpload: false });
            }
          })
          .catch((err) => {
            console.log(err);
            // this.setState({ loadingUpload: false });
            reject(false);
          });
      } catch (e) {
        console.log(e);
        reject(false);
      }
    });
  };

  const handlePastedText = (text, html, editorState, onChange) => {
    const selectedBlock = getSelectedBlock(editorState);
    if (selectedBlock && selectedBlock.type === "code") {
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        text,
        editorState.getCurrentInlineStyle()
      );
      onChange(
        EditorState.push(editorState, contentState, "insert-characters")
      );
      return true;
    }
    return false;
  };

  return (
    <div
      className={`d-flex flex-column flex-row-fluid wrapper ${props.className_wrap_broad}`}
    >
      <div className="content d-flex flex-column flex-column-fluid p-0">
        {/* <ToastContainer /> */}
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
                    <NavLink to="/list-blog" className="text-muted">
                      Blog
                    </NavLink>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-muted" style={{ cursor: "pointer" }}>
                      Create Blog
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column-fluid">
          <div className="container">
            <div
              className="card card-custom card-sticky"
              id="kt_page_sticky_card"
            >
              <div className={styleHeader}>
                <div className="card-title">
                  <h3 className="card-label">
                    Create New Blog
                    <i className="mr-2" />
                  </h3>
                </div>
                <div className="card-toolbar">
                  <span
                    onClick={() => props.history.push("/list-blog")}
                    className="btn btn-light-primary font-weight-bolder mr-2"
                  >
                    Back
                  </span>
                  <div className="btn-group">
                    <button
                      disabled={isDisableSave}
                      type="button"
                      onClick={onSave}
                      className={
                        // this.state.isLoading
                        false
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
                      <div className="form-group row">
                        <div className="col-lg">
                          <label>
                            Title <span style={{ color: "red" }}>*</span>
                          </label>
                          <div>
                            <input
                              name="title"
                              required
                              type="text"
                              value={title}
                              placeholder="Title"
                              onChange={(e) => setTitle(e.target.value)}
                              className={`form-control ${
                                requireTitle ? "is-invalid" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <Editor
                        handlePastedText={handlePastedText}
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName={`editorClassName ${
                          requireDraft ? "require_draft" : ""
                        }`}
                        editorStyle={{}}
                        onEditorStateChange={setEditorState}
                        stripPastedStyles={true}
                        toolbar={{
                          options: [
                            "inline",
                            "blockType",
                            "list",
                            "link",
                            "emoji",
                            "image",
                            "history",
                          ],

                          blockType: {
                            inDropdown: true,
                            options: ["Normal", "H2", "Blockquote", "Code"],
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                          },
                          image: {
                            // icon: image,
                            className: undefined,
                            component: undefined,
                            popupClassName: undefined,
                            urlEnabled: false,
                            uploadEnabled: true,
                            alignmentEnabled: false,
                            uploadCallback: callbackImgUpload,
                            previewImage: true,
                            inputAccept:
                              "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                            alt: { present: false, mandatory: false },
                            defaultSize: {
                              height: "auto",
                              width: "auto",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-xl-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state, ownProps) => {
  return {
    className_wrap_broad: state.ui.className_wrap_broad,
    history: ownProps.history,
  };
};

export default connect(mapStateToProps)(NewBlog);
