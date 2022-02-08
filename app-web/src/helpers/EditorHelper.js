import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export function convertEditorToString(editor) {
  try {
    const contentState = editor.getCurrentContent();
    const content = JSON.stringify(convertToRaw(contentState));
    return content;
  } catch (e) {}
}

export function convertStringToEditor(content) {
  try {
    const editorContent = EditorState.createWithContent(
      convertFromRaw(content)
    );
    return editorContent;
  } catch (e) {}
}
