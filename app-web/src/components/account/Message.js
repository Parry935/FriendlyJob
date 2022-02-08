import React, { useContext } from "react";
import "./Messages.css";
import { BsCalendar } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { convertDate } from "../../helpers/DisplayConvertHelper";
import { UserContext } from "../../contexts/UserContext";
import { Editor } from "react-draft-wysiwyg";
import { convertStringToEditor } from "../../helpers/EditorHelper";
import { Link } from "react-router-dom";
import { deleteMessage } from "../../services/messageService";
import { createToast } from "../../helpers/ToastHelper";
import { errorHandling } from "../../helpers/ErrorHelper";
import {
  defaultImageUser,
  baseURLImageUser,
} from "../../helpers/AppConstValues";

function Message(props) {
  const messageContent = props.message.lastContent
    ? props.message.lastContent
    : props.message.content;

  const { user } = useContext(UserContext);

  const handleDeleteMessage = async () => {
    await deleteMessage(props.message.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          props.updateMessages(props.message.id);
          createToast("success", "Poprawnie usunięto");
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };
  return (
    <div>
      {props.type === "left" ? (
        <>
          <div className="left-messages">
            <MdDelete
              className="icon-delete-app"
              onClick={handleDeleteMessage}
            />
          </div>
          <div className="left-messages">
            <div className="top-data-messages">
              <div>
                <FaUser className="icon-messages" />{" "}
                <Link
                  className="link-blue-app"
                  to={`/userprofile?id=${user.id}`}
                >
                  {user.company
                    ? user.company.name
                    : `${user.firstName} ${user.lastName}`}
                </Link>
              </div>
              <div className="wrap-date-message">
                <BsCalendar className="icon-messages" />{" "}
                {convertDate(props.message.date)}
              </div>
            </div>
            <img
              alt=""
              src={
                user.imageSrc != null
                  ? `${baseURLImageUser}${user.imageSrc}`
                  : defaultImageUser
              }
              className="img-left-messagess"
            />
          </div>
        </>
      ) : props.type === "basic" ? (
        <div className="center-messages">
          <img
            alt=""
            src={
              props.message.user.imageSrc != null
                ? `${baseURLImageUser}${props.message.user.imageSrc}`
                : defaultImageUser
            }
            className="img-messages"
          />
          <div className="top-data-messages">
            <div>
              <FaUser className="icon-messages" />{" "}
              {props.message.user.company != null
                ? props.message.user.company.name
                : `${props.message.user.firstName} ${props.message.user.lastName}`}
            </div>
            <div className="wrap-date-message">
              <BsCalendar className="icon-messages" />{" "}
              {convertDate(props.message.date)}
            </div>
          </div>
        </div>
      ) : (
        <div className="center-messages">
          <img
            alt=""
            src={
              props.recipient.imageSrc != null
                ? `${baseURLImageUser}${props.recipient.imageSrc}`
                : defaultImageUser
            }
            className="img-messages"
          />
          <div className="top-data-messages">
            <div>
              <FaUser className="icon-messages" />{" "}
              <Link
                className="link-blue-app"
                to={`/userprofile?id=${props.recipient.id}`}
              >
                {props.recipient.company
                  ? props.recipient.company.name
                  : `${props.recipient.firstName} ${props.recipient.lastName}`}
              </Link>
            </div>
            <div className="wrap-date-message">
              <BsCalendar className="icon-messages" />{" "}
              {convertDate(props.message.date)}
            </div>
          </div>
        </div>
      )}
      {props.type === "basic" ? (
        <div className="wrap-content-last-content-messages">
          {props.message.recipientId === props.message.user.id ? (
            <div className="i-wrap-item-messages">
              <i>Ty:</i>
            </div>
          ) : (
            ""
          )}
          <Editor
            readOnly={true}
            toolbarHidden={true}
            editorState={convertStringToEditor(JSON.parse(messageContent))}
          />
        </div>
      ) : (
        <div className="wrap-content-messages">
          <Editor
            readOnly={true}
            toolbarHidden={true}
            editorState={convertStringToEditor(JSON.parse(messageContent))}
          />
        </div>
      )}
    </div>
  );
}

export default Message;
