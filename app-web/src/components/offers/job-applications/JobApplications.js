import React, { useState, useEffect, useRef, useContext } from "react";
import "./JobApplication.css";
import "../../account/User.css";
import Error from "../../Error";
import { showLoader } from "../../../helpers/LoaderHelper";
import { getJobOffer } from "../../../services/jobofferService";
import { createToast } from "../../../helpers/ToastHelper";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { UserContext } from "../../../contexts/UserContext";
import { getJobApplicationsForJobOffer } from "../../../services/jobapplicationService";
import Application from "./Application";
import { errorHandling } from "../../../helpers/ErrorHelper";

function JobApplications() {
  const queryParams = new URLSearchParams(window.location.search);
  const jobOfferId = queryParams.get("id");

  const didMount = useRef(false);
  const [jobApplications, setJobApplications] = useState([]);
  const [jobOffer, setJobOffer] = useState();
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
    if (jobOfferId) {
      await getJobOffer(jobOfferId)
        .then((response) => {
          if (response.data) {
            setJobOffer(response.data);
            if (response.data.company.user.id === user.id)
              getApplications(jobOfferId);
            else {
              setError({
                hasError: true,
                details: 403,
              });
            }
          } else {
            createToast("error", "Nie znaleziono oferty");
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

  const getApplications = async (id) => {
    setIsLoading(true);
    await getJobApplicationsForJobOffer(id, page)
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
      setJobOffer(null);
    };
  }, []);

  useEffect(() => {
    if (didMount.current) getApplications(jobOfferId);
    else didMount.current = true;
  }, [page]);

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-user">
      {isLoading ? (
        <>
          {showLoader()}
          <div className="wrap-top-user-account">
            <h2 className="title-size-change-user">Ładowanie...</h2>
          </div>
        </>
      ) : (
        <>
          <div className="wrap-top-user-account">
            <h2 className="title-size-change-user">
              Aplikacje dla ofetry {jobOffer.title}
            </h2>
          </div>
          {jobApplications.map((item) => (
            <div className="item-wrap-user" key={item.id}>
              <Application
                application={item}
                delete={handleDeleteApplication}
                type={"joboffer"}
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

export default JobApplications;
