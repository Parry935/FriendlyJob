import React, { useState, useEffect, useContext } from "react";
import "../style-offers/Main.css";
import JobOffers from "./JobOffers";
import JobFilter from "./JobFilter";
import { BsSearch } from "react-icons/bs";
import { HiFilter } from "react-icons/hi";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { showLoader } from "../../../helpers/LoaderHelper";
import { getJobOffers } from "../../../services/jobofferService";
import { createToast } from "../../../helpers/ToastHelper";
import { JobContext } from "../../../contexts/JobContext";
import { errorHandling } from "../../../helpers/ErrorHelper";

function JobMain() {
  const [jobOffers, setJobOffers] = useState([]);
  const [filter, setFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { jobQuery, setJobQuery } = useContext(JobContext);

  const previousPage = () => {
    if (jobQuery.page > 1) {
      setJobQuery({
        ...jobQuery,
        page: jobQuery.page - 1,
      });
    }
  };

  const nextPage = () => {
    setJobQuery({ ...jobQuery, page: jobQuery.page + 1 });
  };

  const changeFilter = () => {
    if (filter === true) setFilter(false);
    else setFilter(true);
  };

  const handleSearch = async () => {
    if (jobQuery.page === 1) searchOfferts();
    else setJobQuery({ ...jobQuery, page: 1 });
  };

  const searchOfferts = async () => {
    setIsLoading(true);
    await getJobOffers(jobQuery.page, jobQuery.filterValues)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          setJobOffers(response.data);
          if (response.data.length <= 0) {
            if (jobQuery.page > 1) {
              createToast("info", "Brak ofert do pobrania");
              setJobQuery({
                ...jobQuery,
                page: jobQuery.page - 1,
              });
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
    searchOfferts();
    return () => {
      setJobOffers([]);
    };
  }, [jobQuery.page]);

  return (
    <div>
      <div
        className={
          filter
            ? "filter-panel-main fp-active-main"
            : "filter-panel-main fp-inactive-main"
        }
      >
        <JobFilter />
      </div>
      <div>
        <div className="center-app">
          <div>
            <BsSearch
              className="search-i-main inactive-main"
              onClick={handleSearch}
            />
          </div>
          <div>
            <HiFilter
              className={
                filter
                  ? "filter-i-main active-main"
                  : "filter-i-main inactive-main"
              }
              onClick={changeFilter}
            />
          </div>
        </div>

        {isLoading ? (
          showLoader()
        ) : (
          <div className="wrap-offers-main">
            <JobOffers offers={jobOffers} />
          </div>
        )}
        <div className="center-app">
          <div className="pagination-app">
            <div className="pagination-app-left" onClick={previousPage}>
              <AiFillCaretLeft />
            </div>
            <div className="pagination-app-page-position">{jobQuery.page}</div>
            <div className="pagination-app-right" onClick={nextPage}>
              <AiFillCaretRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobMain;
