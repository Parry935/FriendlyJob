import React, { useState, useEffect } from "react";
import "./AdminComponents.css";
import "../account/User.css";
import { getUsers } from "../../services/userService";
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiOutlineSearch,
} from "react-icons/ai";
import User from "./User";
import { showLoader } from "../../helpers/LoaderHelper";
import { errorHandling } from "../../helpers/ErrorHelper";

function Users() {
  const [isLoading, setIsLoading] = useState(true);
  const [phrase, setPhrase] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const getDataUsers = async () => {
    await getUsers(phrase, page)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setUsers(response.data);
          } else {
            setUsers([]);
            if (page > 1) {
              setPage(page - 1);
            }
          }
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
  };

  const handlePhrase = (e) => {
    setPhrase(e.target.value);
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    getDataUsers();
    return () => {
      setUsers([]);
    };
  }, [page, phrase]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return (
    <div className="main-wrap-user">
      <div className="wrap-top-user-account">
        <h2 className="title-size-change-user">Baza użytkowników</h2>
      </div>
      {isLoading ? (
        showLoader()
      ) : (
        <>
          <AiOutlineSearch className="icon-users-admin" />
          <input
            className="input-user-accounts-admin"
            type="text"
            placeholder="Szukaj po frazie..."
            value={phrase}
            onChange={handlePhrase}
          />
          <div>
            {users.map((item) => (
              <div className="item-wrap-user" key={item.id}>
                <User user={item} />
              </div>
            ))}
          </div>
          <div className="pagination-app">
            <div className="pagination-app-left" onClick={previousPage}>
              <AiFillCaretLeft />
            </div>
            <div className="pagination-app-page-position">{page}</div>
            <div className="pagination-app-right" onClick={nextPage}>
              <AiFillCaretRight />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;
