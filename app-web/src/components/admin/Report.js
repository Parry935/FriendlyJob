import React, { useState } from "react";
import { convertStringToEditor } from "../../helpers/EditorHelper";
import { Editor } from "react-draft-wysiwyg";
import { convertDate } from "../../helpers/DisplayConvertHelper";
import { Link } from "react-router-dom";
import { deleteReport } from "../../services/reportService";
import { createToast } from "../../helpers/ToastHelper";
import { deleteOpinion } from "../../services/opinionService";
import { errorHandling } from "../../helpers/ErrorHelper";

function Report(props) {
  const [editorState] = useState(
    convertStringToEditor(JSON.parse(props.report.opinion.content))
  );

  const handleDelteReport = async () => {
    await deleteReport(props.report.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          props.search();
          createToast("info", "Usunięto zgłoszenie");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  const handleDelteReportAndOpinion = async () => {
    await deleteOpinion(props.report.opinion.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          props.search();
          createToast("info", "Usunięto opinie");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  return (
    <div>
      <div className="wrap-admin">
        <b className="blue-user-admin">
          Opinia dla{" "}
          <Link
            className="link-blue-app"
            to={`companyopinions?id=${props.report.opinion.company.id}`}
          >
            {props.report.opinion.company.name}
          </Link>
          - {convertDate(props.report.opinion.date)}
        </b>
        <Editor
          readOnly={true}
          toolbarHidden={true}
          editorState={editorState}
        />
        {props.report.opinion.anonymous ? (
          <i className="red-user-admin">
            Opinia została dodana anonimowo przez użytkownika
          </i>
        ) : (
          ""
        )}
        <div className="link-report-admin">
          <Link
            className="btn-link-app"
            to={`userprofile?id=${props.report.opinion.user.id}`}
          >
            Zobacz profil użytkownika
          </Link>
        </div>
      </div>
      <div className="wrap-admin">
        <b className="red-user-admin">
          Zgłoszenie - {convertDate(props.report.date)}
        </b>
        <div className="item-report-admin">{props.report.reason}</div>
        <div className="link-report-admin">
          <Link
            className="btn-link-app"
            to={`userprofile?id=${props.report.user.id}`}
          >
            Zobacz profil użytkownika
          </Link>
        </div>
      </div>
      <br />
      <div className="wrap-admin">
        <button className="btn-lock-report-user" onClick={handleDelteReport}>
          Usuń zgłoszenie
        </button>
        <button
          className="btn-lock-report-user"
          onClick={handleDelteReportAndOpinion}
        >
          Usuń opinie i zgłoszenie
        </button>
      </div>
    </div>
  );
}

export default Report;
