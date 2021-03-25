import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";

import "./style.css";

class EditorCustomThree extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
    const html = "<p></p>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    }  );
  };

  setContent(htmlContent) {
    const html = htmlContent;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState: editorState });
    }
  }

  getContent() {
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  }

  getStringdata() {
    return this.state.editorState;
  }

  render() {
    const {editorState} = this.state;
    return (
      <div className="editor_custom_three">
        <Editor
          editorState={editorState}
          wrapperClassName="editor_three_wrapper"
          editorClassName="editor_three_editor"
          toolbarHidden
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default EditorCustomThree;
