import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
class FormEditorPdf extends Component {
  onEditorStateChange = async (editorState) => {
    const props = this.props;
    if(props.editorWrite !== props.title){
      console.log('chay vao day')
      await props.setNameEditorWrite(props.title);
    }
    await props.onEditorStateChange(editorState);
  };
  render() {
    const props = this.props;
    return (
      <div
        className="form-group row"
        // onClick={() => {
        //   props.setNameEditorWrite(props.title);
        // }}
      >
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-2">
              <label className="title-form-editor">{props.title}</label>
            </div>
            <div className="col-lg-10">
              <div>
                <Editor
                  editorState={props.nameEditor}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={this.onEditorStateChange}
                  editorStyle={{
                    border: "1px solid #F1F1F1",
                    height: "200px",
                  }}
                  toolbar={{
                    colorPicker: {
                      colors: [
                        "rgb(21, 188, 197)",
                        "rgb(33, 37, 41)",
                        "rgb(97,189,109)",
                        "rgb(26,188,156)",
                        "rgb(84,172,210)",
                        "rgb(44,130,201)",
                        "rgb(147,101,184)",
                        "rgb(71,85,119)",
                        "rgb(204,204,204)",
                        "rgb(65,168,95)",
                        "rgb(0,168,133)",
                        "rgb(61,142,185)",
                        "rgb(41,105,176)",
                        "rgb(85,57,130)",
                        "rgb(40,50,78)",
                        "rgb(0,0,0)",
                        "rgb(247,218,100)",
                        "rgb(251,160,38)",
                        "rgb(235,107,86)",
                        "rgb(226,80,65)",
                        "rgb(163,143,132)",
                        "rgb(239,239,239)",
                        "rgb(255,255,255)",
                        "rgb(250,197,28)",
                        "rgb(243,121,52)",
                        "rgb(209,72,65)",
                        "rgb(184,49,47)",
                        "rgb(124,112,107)",
                        "rgb(209,213,216)",
                      ],
                    },
                    fontFamily: {
                      options: [
                        "Muli",
                        "sans-serif",
                        "Arial",
                        "Georgia",
                        "Impact",
                        "Tahoma",
                        "Times New Roman",
                        "Verdana",
                      ],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormEditorPdf;
