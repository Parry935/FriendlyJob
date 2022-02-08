import React, { useState, useEffect, useContext } from "react";
import "./Messages.css";
import "../company/CompanyOpinions.css";
import Message from "./Message";
import { FiSend } from "react-icons/fi";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import { createToast } from "../../helpers/ToastHelper";
import Error from "../Error";
import { UserContext } from "../../contexts/UserContext";
import { showLoader } from "../../helpers/LoaderHelper";
import { convertEditorToString } from "../../helpers/EditorHelper";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getUser } from "../../services/userService";
import { createMessage, getMesages } from "../../services/messageService";
import { errorHandling } from "../../helpers/ErrorHelper";

function MessageDetails() {
  const [data, setData] = useState([]);
  const [error, setError] = useState({ hasError: false, details: null });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [recipient, setRecipient] = useState();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const queryParams = new URLSearchParams(window.location.search);
  const recipientId = queryParams.get("recipientId");

  const handleUpdateMessages = (id) => {
    const messagesData = [...data];
    var newMessages = messagesData.filter((item) => item.id !== id);
    setData(newMessages);
  };

  const handleSendMessage = async () => {
    if (editorState.getCurrentContent().hasText()) {
      const content = convertEditorToString(editorState);

      await createMessage(content, recipientId, user.id)
        .then((response) => {
          if (response.data) {
            setData((data) => [response.data, ...data]);
            const editor = EditorState.push(
              editorState,
              ContentState.createFromText("")
            );
            setEditorState(editor);
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else createToast("error", "Wpisz treść do wiadomości");
  };

  const getData = async () => {
    setIsLoading(true);
    if (recipientId) {
      await getUser(recipientId)
        .then((response) => {
          if (response.data) {
            setRecipient(response.data);
            getMessagesData();
          } else {
            createToast("error", "Nie znaleziono użytkownika");
            setError({
              hasError: true,
              details: 404,
            });
          }
        })
        .catch((err) => {
          errorHandling(err);
          setError({
            hasError: true,
            details: err.response ? err.response.status : null,
          });
        });
    } else {
      setError({
        hasError: true,
        details: 404,
      });
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const getMessagesData = async () => {
    await getMesages(recipientId, user.id)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setData(response.data);
          } else {
            createToast("info", "Brak wiadmości z użytkownikiem");
          }
        }
      })
      .catch((err) => {
        errorHandling(err);
        setError({
          hasError: true,
          details: err.response ? err.response.status : null,
        });
      });
  };

  useEffect(() => {
    getData();
    return () => {
      setData([]);
    };
  }, []);

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-details-messages">
      {isLoading ? (
        showLoader()
      ) : (
        <>
          <div className="wrap-send-messages">
            <div className="wrap-new-messages">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
              />
            </div>
            <div className="center-app">
              <button className="btn-new-messages" onClick={handleSendMessage}>
                <FiSend className="icon-new-messages" />
                Wyślij wiadomość
              </button>
            </div>
          </div>
          {data.map((item, index) => (
            <div key={index}>
              {item.recipientId === user.id ? (
                <div className="item-card-right-messages">
                  <Message type="right" message={item} recipient={recipient} />
                </div>
              ) : (
                <div className="iitem-card-left-messages">
                  <Message
                    type="left"
                    message={item}
                    recipient={recipient}
                    updateMessages={handleUpdateMessages}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <div className="wrap-top-messages">
        <h2 className="title-size-change-messages">
          {!recipient
            ? "Ładowanie..."
            : recipient.company
            ? recipient.company.name
            : `${recipient.firstName} ${recipient.lastName}`}
        </h2>
      </div>
    </div>
  );
}

export default MessageDetails;
