import React, { useState, useEffect } from "react";
import { showLoader } from "../../helpers/LoaderHelper";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { createToast } from "../../helpers/ToastHelper";
import Report from "./Report";
import { getReports } from "../../services/reportService";
import { errorHandling } from "../../helpers/ErrorHelper";

function Reports() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const handleSearch = () => {
    getDataReports();
  };

  const getDataReports = async () => {
    setIsLoading(true);
    await getReports(page)
      .then((response) => {
        if (response !== undefined && response.status === 200) {
          if (response.data.length > 0) {
            setReports(response.data);
          } else {
            setReports([]);
            if (page > 1) {
              setPage(page - 1);
              createToast("info", "Brak zgłoszeń do pobrania");
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
    getDataReports();
    return () => {
      setReports([]);
    };
  }, [page]);

  return (
    <div>
      <div className="main-wrap-user">
        <div className="wrap-top-user-account">
          <h2 className="title-size-change-user">Zgłoszenia</h2>
        </div>
        {isLoading ? (
          showLoader()
        ) : (
          <>
            <div>
              {reports.map((item) => (
                <div className="item-wrap-user" key={item.id}>
                  <Report report={item} search={handleSearch} />
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
    </div>
  );
}

export default Reports;
