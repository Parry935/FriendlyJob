import React, { useState, useEffect, useContext } from "react";
import "./User.css";
import ProgramerOffer from "../offers/programmer-offers-components/ProgrammerOffer";
import { UserContext } from "../../contexts/UserContext";
import { Role } from "../../helpers/Enumerations/Role";
import { getJobOffersForUser } from "../../services/jobofferService";
import { getProgrammerOffersForUser } from "../../services/programmerofferService";
import { getUser } from "../../services/userService";
import Error from "../Error";
import { createToast } from "../../helpers/ToastHelper";
import JobOffer from "../offers/job-offers-components/JobOffer";
import { showLoader } from "../../helpers/LoaderHelper";
import { Link } from "react-router-dom";
import { errorHandling } from "../../helpers/ErrorHelper";

function UserOffers() {
  const queryParams = new URLSearchParams(window.location.search);
  const profileId = queryParams.get("id");

  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataUser, setDataUser] = useState();
  const [error, setError] = useState({ hasError: false, details: null });
  const { user } = useContext(UserContext);

  const getData = async () => {
    setIsLoading(true);
    if (profileId) {
      await getUser(profileId)
        .then((response) => {
          if (response.data) {
            setDataUser(response.data);
            if (response.data.role !== Role.Admin)
              getOffersForUser(response.data.id, response.data.role);
            else
              setError({
                hasError: true,
                details: 404,
              });
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

  const getOffersForUser = (userId, role) => {
    setIsLoading(true);
    if (role === Role.Programmer) {
      getProgrammerOffersForUser(userId)
        .then((response) => {
          if (
            response.data &&
            response !== undefined &&
            response.status === 200
          ) {
            setOffers(response.data);
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else if (role === Role.Company) {
      getJobOffersForUser(userId)
        .then((response) => {
          if (
            response.data &&
            response !== undefined &&
            response.status === 200
          ) {
            setOffers(response.data);
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    getData();
    return () => {
      setOffers([]);
      setDataUser(null);
    };
  }, [profileId]);

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-user">
      {isLoading ? (
        <>
          {showLoader()}
          <div className="wrap-top-user-account">
            <h2 className="title-size-change-user">Ładowanie..</h2>
          </div>
        </>
      ) : (
        <>
          <div className="wrap-top-user-account">
            <h2 className="title-size-change-user">
              {dataUser.role === Role.Programmer
                ? user.id === dataUser.id
                  ? "Moje oferty"
                  : `Oferty ${dataUser.firstName} ${dataUser.lastName}`
                : user.id === dataUser.id
                ? "Moje oferty"
                : `Oferty ${dataUser.company.name}`}
            </h2>
          </div>
          <div>
            {dataUser.role === Role.Programmer ? (
              <div>
                {offers.map((item) => (
                  <div className="item-wrap-user" key={item.id}>
                    <ProgramerOffer offer={item} />
                    <br />
                    <Link
                      className="btn-link-app"
                      to={`/programmeroffer?id=${item.id}`}
                    >
                      Zobacz szczegóły
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {offers.map((item) => (
                  <div className="item-wrap-user" key={item.id}>
                    <JobOffer offer={item} />
                    <br />
                    <Link
                      className="btn-link-app"
                      to={`/joboffer?id=${item.id}`}
                    >
                      Zobacz szczegóły
                    </Link>
                    {user.id === dataUser.id ? (
                      <Link
                        className="btn-link-app"
                        to={`/jobapplications?id=${item.id}`}
                      >
                        Zobacz aplikacje
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserOffers;
