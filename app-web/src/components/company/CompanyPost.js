import React, { useState, useContext } from "react";
import "./CompanyPost.css";
import { BsCalendar } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiTwotoneDislike,
  AiTwotoneLike,
} from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { GiCancel } from "react-icons/gi";
import { Editor } from "react-draft-wysiwyg";
import {
  convertStringToEditor,
  convertEditorToString,
} from "../../helpers/EditorHelper";
import { convertDate } from "../../helpers/DisplayConvertHelper";
import { UserContext } from "../../contexts/UserContext";
import { createToast } from "../../helpers/ToastHelper";
import { deleteOpinion, editOpinion } from "../../services/opinionService";
import {
  postLike,
  postDislike,
  deleteDislike,
  deleteLike,
} from "../../services/ratingService";
import { createReport } from "../../services/reportService";
import { Link } from "react-router-dom";
import { Role } from "../../helpers/Enumerations/Role";
import { errorHandling } from "../../helpers/ErrorHelper";
import {
  defaultImageUser,
  baseURLImageUser,
} from "../../helpers/AppConstValues";

function CompanyPost(props) {
  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [report, setReport] = useState("");
  const { user } = useContext(UserContext);
  const [editorState, setEditorState] = useState(
    convertStringToEditor(JSON.parse(props.opinion.content))
  );

  const createReportForPost = async () => {
    if (report.length !== 0) {
      await createReport(props.opinion.id, report)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            setReport("");
            setReportMode(false);
            createToast("success", "Wysłano zgłoszenie");
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else {
      createToast("error", "Brak podanego powodu");
    }
  };

  const changeReportMode = () => {
    if (reportMode === true) setReportMode(false);
    else setReportMode(true);
  };
  const reportHandler = (event) => {
    setReport(event.target.value);
  };

  const handeDeleteLike = async () => {
    await deleteLike(props.opinion.id, props.updateRatings);
  };

  const handeDeleteDislike = async () => {
    await deleteDislike(props.opinion.id, props.updateRatings);
  };

  const handePostLike = async () => {
    await postLike(props.opinion.id, props.updateRatings);
  };

  const handePostDislike = async () => {
    await postDislike(props.opinion.id, props.updateRatings);
  };

  const changeToEditMode = () => {
    setEditMode(true);
  };

  const confirmEdit = async () => {
    if (editorState.getCurrentContent().hasText()) {
      const content = convertEditorToString(editorState);
      await editOpinion(props.opinion.id, content)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            props.updateContent(props.opinion.id, content);
            setEditMode(false);
            createToast("success", "Dokonano edycji");
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else createToast("error", "Wpisz treść do opini");
  };

  const deletePost = async () => {
    await deleteOpinion(props.opinion.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          props.delete(props.opinion.id);
          createToast("success", "Poprawnie usunięto");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  return (
    <div>
      {(props.opinion.user && user.id === props.opinion.user.id) ||
      user.role === Role.Admin ? (
        <div className="flex-app">
          {editMode ? (
            <div className="wrap-space-margin-post">
              <GiConfirmed
                className="icon-like-post icon-animation-post"
                onClick={confirmEdit}
              />
            </div>
          ) : (
            <div className="wrap-space-margin-post">
              <MdEdit
                className="icon-like-post icon-animation-post"
                onClick={changeToEditMode}
              />
            </div>
          )}
          <div className="wrap-space-margin-post">
            <MdDelete
              className="icon-dislike-post icon-animation-post"
              onClick={deletePost}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="top-wrap-post">
        <img
          alt=""
          src={
            props.opinion.user && props.opinion.user.imageSrc != null
              ? `${baseURLImageUser}${props.opinion.user.imageSrc}`
              : defaultImageUser
          }
          className="img-post"
        />
        <div className="top-data-post">
          <div>
            <FaUser className="icon-post" />{" "}
            {props.opinion.user ? (
              <Link
                className="link-blue-app"
                to={`/userprofile?id=${props.opinion.user.id}`}
              >
                {props.opinion.user.firstName} {props.opinion.user.lastName}
              </Link>
            ) : (
              "Anonimowy użytkownik"
            )}
          </div>
          <div className="wrap-date-post">
            <BsCalendar className="icon-post" />{" "}
            {convertDate(props.opinion.date)}
          </div>
        </div>
      </div>
      <div className="wrap-content-post">
        {editMode ? (
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
          />
        ) : (
          <Editor
            readOnly={true}
            toolbarHidden={true}
            editorState={editorState}
          />
        )}
      </div>
      <div className="wrap-rating-post">
        <div className="item-rating-post">
          <div className="icon-animation-post">
            {props.opinion.usersIdLikes.includes(user.id) ? (
              <AiTwotoneLike
                className="icon-like-post"
                onClick={handeDeleteLike}
              />
            ) : (
              <AiOutlineLike
                className="icon-like-post"
                onClick={handePostLike}
              />
            )}
          </div>
          <div className="text-center-post">
            {props.opinion.usersIdLikes.length}
          </div>
        </div>
        <div className="item-rating-post">
          <div className="icon-animation-post">
            {props.opinion.usersIdDislikes.includes(user.id) ? (
              <AiTwotoneDislike
                className="icon-dislike-post"
                onClick={handeDeleteDislike}
              />
            ) : (
              <AiOutlineDislike
                className="icon-dislike-post"
                onClick={handePostDislike}
              />
            )}
          </div>
          <div className="text-center-post">
            {props.opinion.usersIdDislikes.length}
          </div>
        </div>
        <div className="item-rating-post">
          <div className="text-center-post icon-animation-post">
            {reportMode ? (
              <GiCancel
                className="icon-dislike-post"
                onClick={changeReportMode}
              />
            ) : (
              <GoReport
                className="icon-dislike-post"
                onClick={changeReportMode}
              />
            )}
          </div>
          <div className="text-center-post">
            {reportMode ? "Zamknij" : "Zgłoś"}
          </div>
        </div>
      </div>
      {reportMode ? (
        <>
          <div>
            <textarea
              placeholder="Podaj powód złoszenia"
              value={report}
              onChange={reportHandler}
              className="report-wrap-post"
            ></textarea>
          </div>
          <GiConfirmed
            className="icon-like-post"
            onClick={createReportForPost}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default CompanyPost;
