import { editorTemplate } from "./AppConstValues";

export function convertStringToEditorState(content) {
  let editorState = editorTemplate;
  editorState = editorState.replace("MESSAGE", content);

  return editorState;
}

export function convertEditorStateToString(stateString) {
  let stateJSON = JSON.parse(stateString);

  let content = "";

  stateJSON.blocks.forEach((item) => {
    content = content.concat(item.text + " ");
  });

  return content;
}
