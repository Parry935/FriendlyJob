import React, { useState, useEffect, useContext } from "react";
import "./Messages.css";
import Message from "./Message";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { createToast } from "../../helpers/ToastHelper";
import { Link } from "react-router-dom";
import { showLoader } from "../../helpers/LoaderHelper";
import { UserContext } from "../../contexts/UserContext";
import { getConversations } from "../../services/messageService";
import { ConversationsPageContext } from "../../contexts/ConversationsPageContext";
import { errorHandling } from "../../helpers/ErrorHelper";

function Messages() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { conversationsPage, setConversationsPage } = useContext(
    ConversationsPageContext
  );

  const previousPage = () => {
    if (conversationsPage > 1) {
      setConversationsPage(conversationsPage - 1);
    }
  };

  const nextPage = () => {
    setConversationsPage(conversationsPage + 1);
  };

  const getMesages = async () => {
    setIsLoading(true);
    await getConversations(conversationsPage)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setData(response.data);
          } else {
            if (conversationsPage > 1) {
              setConversationsPage(conversationsPage - 1);
              createToast("info", "Brak wiadmości do pobrania");
            }
          }
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    getMesages();
    return () => {
      setData([]);
    };
  }, [conversationsPage]);

  return (
    <div className="main-wrap-messages">
      <div className="wrap-top-messages">
        <h2 className="title-size-change-messages">Wiadomości</h2>
      </div>
      <div className="wrap-messages">
        {isLoading
          ? showLoader()
          : data.map((item, index) => (
              <Link
                to={`/messagesdetails?recipientId=${item.user.id}`}
                key={index}
              >
                <div
                  className={
                    !item.readed && user.id === item.recipientId
                      ? "item-green-messages"
                      : "item-messages"
                  }
                >
                  {!item.readed && user.id === item.recipientId ? (
                    <i>Wiadmość nie odczytana</i>
                  ) : (
                    ""
                  )}
                  <Message type="basic" message={item} />
                </div>
              </Link>
            ))}
      </div>
      {!isLoading ? (
        <div className="pagination-app">
          <div className="pagination-app-left" onClick={previousPage}>
            <AiFillCaretLeft />
          </div>
          <div className="pagination-app-page-position">
            {conversationsPage}
          </div>
          <div className="pagination-app-right" onClick={nextPage}>
            <AiFillCaretRight />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Messages;
