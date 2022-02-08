import React, { useState, useEffect, useContext } from "react";
import "../style-offers/Main.css";
import ProgrammerOffers from "./ProgrammerOffers";
import ProgrammerFilter from "./ProgrammerFilter";
import { BsSearch } from "react-icons/bs";
import { HiFilter } from "react-icons/hi";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { showLoader } from "../../../helpers/LoaderHelper";
import { getProgrammerOffers } from "../../../services/programmerofferService";
import { createToast } from "../../../helpers/ToastHelper";
import { ProgrammerContext } from "../../../contexts/ProgrammerContext";
import { errorHandling } from "../../../helpers/ErrorHelper";

function ProgrammerMain() {
  const [programmerOffers, setProgrammerOffers] = useState([]);
  const [filter, setFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { programmerQuery, setProgrammerQuery } = useContext(ProgrammerContext);

  const previousPage = () => {
    if (programmerQuery.page > 1) {
      setProgrammerQuery({
        ...programmerQuery,
        page: programmerQuery.page - 1,
      });
    }
  };

  const nextPage = () => {
    setProgrammerQuery({ ...programmerQuery, page: programmerQuery.page + 1 });
  };

  const changeFilter = () => {
    if (filter === true) setFilter(false);
    else setFilter(true);
  };

  const handleSearch = async () => {
    if (programmerQuery.page === 1) searchOfferts();
    else setProgrammerQuery({ ...programmerQuery, page: 1 });
  };

  const searchOfferts = async () => {
    setIsLoading(true);
    await getProgrammerOffers(
      programmerQuery.page,
      programmerQuery.filterValues
    )
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          setProgrammerOffers(response.data);
          if (response.data.length <= 0) {
            if (programmerQuery.page > 1) {
              createToast("info", "Brak ofert do pobrania");
              setProgrammerQuery({
                ...programmerQuery,
                page: programmerQuery.page - 1,
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
      setProgrammerOffers([]);
    };
  }, [programmerQuery.page]);

  return (
    <div>
      <div
        className={
          filter
            ? "filter-panel-main fp-active-main"
            : "filter-panel-main fp-inactive-main"
        }
      >
        <ProgrammerFilter />
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
            <ProgrammerOffers offers={programmerOffers} />
          </div>
        )}
        <div className="center-app">
          <div className="pagination-app">
            <div className="pagination-app-left" onClick={previousPage}>
              <AiFillCaretLeft />
            </div>
            <div className="pagination-app-page-position">
              {programmerQuery.page}
            </div>
            <div className="pagination-app-right" onClick={nextPage}>
              <AiFillCaretRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgrammerMain;
