import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


export default class EditorConvertToHTML extends Component {
  constructor(props) {
    super(props);
    this.setContent = this.setContent.bind(this);
    const html = '<p></p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  setContent(htmlContent){
    const html = htmlContent;
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState:editorState})
    }
  }

  getContent(){
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  getStringdata(){
    return this.state.editorState;
  }


  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
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
    );
  }
}