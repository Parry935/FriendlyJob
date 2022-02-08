import React, { useState, useEffect, useContext } from "react";
import ProgrammerOffer from "./ProgrammerOffer";
import "../style-offers/Offer.css";
import { FaLaptopCode, FaUserGraduate, FaHome } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { MdLanguage } from "react-icons/md";
import { RiMailSendLine } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import Error from "../../Error.js";
import {
  getProgrammerOffer,
  deleteProgrammerOffer,
} from "../../../services/programmerofferService";
import { showLoader } from "../../../helpers/LoaderHelper";
import { createToast } from "../../../helpers/ToastHelper";
import { convertStringToEditor } from "../../../helpers/EditorHelper";
import { Editor } from "draft-js";
import { Link } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { Redirect } from "react-router";
import ProgrammerAddOffer from "./ProgrammerAddOffer";
import { Role } from "../../../helpers/Enumerations/Role";
import { errorHandling } from "../../../helpers/ErrorHelper";

function ProgrammerOfferDetails() {
  const queryParams = new URLSearchParams(window.location.search);
  const offerId = queryParams.get("id");

  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ hasError: false, details: null });
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [programmerOfferData, setProgrammerOfferData] = useState();

  const updateOffer = (updatedProgrammerOffer) => {
    setProgrammerOfferData(updatedProgrammerOffer);
  };

  useEffect(() => {
    setEditMode(false);
  }, [programmerOfferData]);

  const deleteOffer = async () => {
    await deleteProgrammerOffer(programmerOfferData.id)
      .then((response) => {
        if (response !== undefined && response.status === 204) {
          setDeleteMode(true);
          createToast("success", "Pomyślnie usunięto ofertę");
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

  const editOffer = async () => {
    setEditMode(true);
  };

  useEffect(() => {
    const getOfferData = async () => {
      setIsLoading(true);
      if (offerId) {
        await getProgrammerOffer(offerId)
          .then((response) => {
            if (response.data) {
              setProgrammerOfferData(response.data);
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
    getOfferData();
    return () => {
      setProgrammerOfferData(null);
    };
  }, [offerId]);

  if (deleteMode) return <Redirect to="/" />;

  if (editMode)
    return (
      <ProgrammerAddOffer
        offer={programmerOfferData}
        updateOffer={updateOffer}
      />
    );

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="wrap-offer-add">
      {isLoading ? (
        showLoader()
      ) : (
        <div>
          <div className="margin-left-offer-details">
            <Link
              className="btn-link-app"
              to={`/userprofile?id=${programmerOfferData.user.id}`}
            >
              Zobacz profil programisty
            </Link>
          </div>
          <div className="card-offer">
            <ProgrammerOffer offer={programmerOfferData} />
          </div>
          <div className="content-offer-add">
            {programmerOfferData.technologyMain.length > 0 ? (
              <div className="wrap-margin-bottom-offer-details">
                <h3 className="title-offer-details">Technologie głowne:</h3>
                <ul>
                  {programmerOfferData.technologyMain.map((item, index) => (
                    <li className="li-offer-details" key={index}>
                      <FaLaptopCode className="icon-offer-details" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            {programmerOfferData.technologyNiceToHave.length > 0 ? (
              <div className="wrap-margin-bottom-offer-details">
                <h3 className="title-offer-details">Technologie poboczne:</h3>
                <ul>
                  {programmerOfferData.technologyNiceToHave.map(
                    (item, index) => (
                      <li className="li-offer-details" key={index}>
                        <FaLaptopCode className="icon-offer-details" /> {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              ""
            )}
            <div className="wrap-margin-bottom-offer-details">
              <h3 className="title-offer-details">Pozostłe:</h3>
              <ul>
                <li className="li-offer-details">
                  <BiTimeFive className="icon-offer-details" /> Etat -{" "}
                  {programmerOfferData.time
                    ? programmerOfferData.time
                    : "Nie określono"}
                </li>
                <li className="li-offer-details">
                  <FaUserGraduate className="icon-offer-details" />{" "}
                  Wykształcenie -{" "}
                  {programmerOfferData.education
                    ? programmerOfferData.education
                    : "Nie określono"}
                </li>
                <li className="li-offer-details">
                  <FaHome className="icon-offer-details" /> Praca zdalna -{" "}
                  {programmerOfferData.remote ? "Tak" : "Nie"}
                </li>
                <li className="li-offer-details">
                  <TiDocumentText className="icon-offer-details" /> Umowa -{" "}
                  {programmerOfferData.contracts
                    ? programmerOfferData.contracts
                    : "Nie określono"}
                </li>
                <li className="li-offer-details">
                  <MdLanguage className="icon-offer-details" /> Język angielski
                  -{" "}
                  {programmerOfferData.language
                    ? programmerOfferData.language
                    : "Nie określono"}
                </li>
              </ul>
            </div>
          </div>
          <div className="content-offer-add">
            <h3 className="title-offer-details">O programiście:</h3>
            <div className="top-border-offer-details">
              <Editor
                readOnly={true}
                toolbarHidden={true}
                editorState={convertStringToEditor(
                  JSON.parse(programmerOfferData.description)
                )}
              />
            </div>
            <div className="center-flex-offer-details">
              <div>
                <div className="content-app">
                  {user.id !== programmerOfferData.user.id ? (
                    user.role === Role.Company ? (
                      <Link
                        to={`messagesdetails?recipientId=${programmerOfferData.user.id}`}
                      >
                        <button className="btn-offer-details">
                          <RiMailSendLine className="icon-white-offer-details" />{" "}
                          Napisz do programisty
                        </button>
                      </Link>
                    ) : user.role === Role.Admin ? (
                      <>
                        <div>
                          <MdEdit
                            className="icon-green-offer-offer-details icon-offer-animation-offer-details"
                            onClick={editOffer}
                          />

                          <MdDelete
                            className="icon-red-offer-offer-details icon-offer-animation-offer-details"
                            onClick={deleteOffer}
                          />
                        </div>{" "}
                      </>
                    ) : (
                      ""
                    )
                  ) : (
                    <div>
                      <MdEdit
                        className="icon-green-offer-offer-details icon-offer-animation-offer-details"
                        onClick={editOffer}
                      />

                      <MdDelete
                        className="icon-red-offer-offer-details icon-offer-animation-offer-details"
                        onClick={deleteOffer}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgrammerOfferDetails;
