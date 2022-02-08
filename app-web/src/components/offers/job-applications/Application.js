import React, { useState } from "react";
import { convertStringToEditor } from "../../../helpers/EditorHelper";
import { Editor } from "react-draft-wysiwyg";
import { Link } from "react-router-dom";
import {
  deleteJobApplication,
  getFile,
} from "../../../services/jobapplicationService";
import { MdDelete } from "react-icons/md";
import { createToast } from "../../../helpers/ToastHelper";
import { convertDate } from "../../../helpers/DisplayConvertHelper";
import { errorHandling } from "../../../helpers/ErrorHelper";

function Application(props) {
  const [editorState] = useState(
    convertStringToEditor(JSON.parse(props.application.description))
  );

  const getCV = () => {
    getFile(props.application.file);
  };
  const handleDeleteApplication = async () => {
    await deleteJobApplication(props.application.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          props.delete(props.application.id);
          if (props.type === "user") createToast("info", "Usunięto aplikację");
          else createToast("info", "Odrzucono aplikację");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  return (
    <div>
      <div className="wrap-top-application">
        <i className="red-user-admin">{convertDate(props.application.date)}</i>{" "}
        <br />
        Opis programisty
      </div>
      <div className="description-wrap-application">
        <Editor
          readOnly={true}
          toolbarHidden={true}
          editorState={editorState}
        />
      </div>
      <button className="btn-application" onClick={getCV}>
        Pobierz CV
      </button>
      {props.type === "user" ? (
        <Link
          className="btn-link-app"
          to={`/joboffer?id=${props.application.jobOfferId}`}
        >
          Zobacz ofertę
        </Link>
      ) : (
        <Link
          className="btn-link-app"
          to={`/userprofile?id=${props.application.user.id}`}
        >
          Zobacz profil programisty
        </Link>
      )}
      <br />
      <button className="btn-red-application" onClick={handleDeleteApplication}>
        {props.type === "user" ? (
          <>
            <MdDelete className="icon-post" /> Usuń aplikacje{" "}
          </>
        ) : (
          <>
            {" "}
            <MdDelete className="icon-post" /> Odrzuć ofertę programisty{" "}
          </>
        )}
      </button>
    </div>
  );
}

export default Application;
