import React, { useState, useEffect, useRef, useContext } from "react";
import "./JobApplication.css";
import "../../account/User.css";
import Error from "../../Error";
import { showLoader } from "../../../helpers/LoaderHelper";
import { getUser } from "../../../services/userService";
import { createToast } from "../../../helpers/ToastHelper";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { UserContext } from "../../../contexts/UserContext";
import { getJobApplicationsForUser } from "../../../services/jobapplicationService";
import Application from "./Application";
import { errorHandling } from "../../../helpers/ErrorHelper";

function UserJobApplications() {
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("id");

  const didMount = useRef(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ hasError: false, details: null });
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const getData = async () => {
    setIsLoading(true);
    if (userId) {
      await getUser(userId)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            if (response.data) {
              if (response.data.id === user.id) getApplications(userId);
              else {
                setError({
                  hasError: true,
                  details: 403,
                });
              }
            } else {
              createToast("error", "Nie znaleziono użytkownika");
              setError({
                hasError: true,
                details: 404,
              });
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
    } else {
      setError({
        hasError: true,
        details: 404,
      });
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const getApplications = async (id) => {
    setIsLoading(true);
    await getJobApplicationsForUser(id, page)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setJobApplications(response.data);
          } else {
            if (page > 1) {
              setPage(page - 1);
              createToast("info", "Brak aplikacji do pobrania");
            }
          }
        }
      })
      .catch((err) => {
        errorHandling(err);
      });
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleDeleteApplication = (id) => {
    const applicationsToFilter = [...jobApplications];
    var newApplications = applicationsToFilter.filter((item) => item.id !== id);
    setJobApplications(newApplications);
  };

  useEffect(() => {
    getData();
    return () => {
      setJobApplications([]);
    };
  }, []);

  useEffect(() => {
    if (didMount.current) getApplications(userId);
    else didMount.current = true;
  }, [page]);

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-user">
      <div className="wrap-top-user-account">
        <h2 className="title-size-change-user">Moje aplikacje</h2>
      </div>
      {isLoading ? (
        showLoader()
      ) : (
        <>
          {jobApplications.map((item) => (
            <div className="item-wrap-user" key={item.id}>
              <Application
                application={item}
                delete={handleDeleteApplication}
                type={"user"}
              />
            </div>
          ))}

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

export default UserJobApplications;
