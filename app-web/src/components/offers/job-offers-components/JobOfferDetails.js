import React, { useState, useEffect, useContext } from "react";
import JobOffer from "./JobOffer";
import "../style-offers/OfferDetails.css";
import { HiUpload } from "react-icons/hi";
import { FaLaptopCode, FaHome } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { MdLanguage } from "react-icons/md";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Error from "../../Error.js";
import { getJobOffer, deleteJobOffer } from "../../../services/jobofferService";
import { showLoader } from "../../../helpers/LoaderHelper";
import { createToast } from "../../../helpers/ToastHelper";
import {
  convertStringToEditor,
  convertEditorToString,
} from "../../../helpers/EditorHelper";
import { Editor } from "react-draft-wysiwyg";
import { UserContext } from "../../../contexts/UserContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { Redirect } from "react-router";
import JobAddOffer from "./JobAddOffer";
import { createJobApplication } from "../../../services/jobapplicationService";
import { Link } from "react-router-dom";
import { Role } from "../../../helpers/Enumerations/Role";
import { errorHandling } from "../../../helpers/ErrorHelper";

function JobOfferDetails() {
  const queryParams = new URLSearchParams(window.location.search);
  const offerId = queryParams.get("id");

  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ hasError: false, details: null });
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [jobOfferData, setJobOfferData] = useState();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const updateOffer = (updatedJobOffer) => {
    setJobOfferData(updatedJobOffer);
  };

  useEffect(() => {
    setEditMode(false);
  }, [jobOfferData]);

  const [file, setFile] = useState();

  const chooseFile = (event) => {
    setFile(event.target.files[0]);
  };

  const sendJobApplication = async () => {
    if (editorState.getCurrentContent().hasText()) {
      if (file) {
        if (!file.name.match(/.(pdf)$/i)) {
          createToast("error", "CV musi być w formacie pdf");
        } else {
          const content = convertEditorToString(editorState);
          const fileToSend = new FormData();
          fileToSend.append("file", file);

          await createJobApplication(content, fileToSend, offerId, user.id)
            .then(() => {
              const editor = EditorState.push(
                editorState,
                ContentState.createFromText("")
              );
              setFile("");
              setEditorState(editor);
            })
            .catch((err) => {
              errorHandling(err);
            });
        }
      } else {
        createToast("error", "Nie wybrano CV");
      }
    } else {
      createToast("error", "Dodaj opis do aplikacji");
    }
  };

  const deleteOffer = async () => {
    await deleteJobOffer(jobOfferData.id)
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
        await getJobOffer(offerId)
          .then((response) => {
            if (response.data) {
              setJobOfferData(response.data);
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
      setJobOfferData(null);
    };
  }, [offerId]);

  if (deleteMode) return <Redirect to="/" />;

  if (editMode)
    return <JobAddOffer offer={jobOfferData} updateOffer={updateOffer} />;

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
              to={`/userprofile?id=${jobOfferData.company.user.id}`}
            >
              Zobacz profil firmy
            </Link>
          </div>
          <div className="card-offer">
            <JobOffer offer={jobOfferData} />
          </div>
          <div className="content-offer-add">
            {jobOfferData.technologyMain.length > 0 ? (
              <div className="wrap-margin-bottom-offer-details">
                <h3 className="title-offer-details">Technologie głowne:</h3>
                <ul>
                  {jobOfferData.technologyMain.map((item, index) => (
                    <li className="li-offer-details" key={index}>
                      <FaLaptopCode className="icon-offer-details" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            {jobOfferData.technologyNiceToHave.length > 0 ? (
              <div className="wrap-margin-bottom-offer-details">
                <h3 className="title-offer-details">
                  Technologie mile widziane:
                </h3>
                <ul>
                  {jobOfferData.technologyNiceToHave.map((item, index) => (
                    <li className="li-offer-details" key={index}>
                      <FaLaptopCode className="icon-offer-details" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}
            <div className="wrap-margin-bottom-offer-details">
              <h3 className="title-offer-details">Pozostłe:</h3>
              <ul>
                <li className="li-offer-details">
                  <FaHome className="icon-offer-details" /> Praca zdalna -{" "}
                  {jobOfferData.remote ? "Tak" : "Nie"}
                </li>
                <li className="li-offer-details">
                  <MdLanguage className="icon-offer-details" /> Język angielski
                  -{" "}
                  {jobOfferData.language
                    ? jobOfferData.language
                    : "Nie określono"}
                </li>
              </ul>
            </div>
          </div>
          <div className="content-offer-add">
            <h3 className="title-offer-details">Szczegóły oferty:</h3>
            <div className="top-border-offer-details">
              <Editor
                readOnly={true}
                toolbarHidden={true}
                editorState={convertStringToEditor(
                  JSON.parse(jobOfferData.description)
                )}
              />
            </div>

            <div className="center-flex-offer-details">
              {user.id !== jobOfferData.company.user.id ? (
                user.role === Role.Programmer ? (
                  <div>
                    <h3 className="title-offer-details">
                      Dodaj opis do aplikacji:
                    </h3>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                    />
                    <div className="content-app">
                      <label
                        className="file-offer-details"
                        htmlFor="upload-cv-offer-details"
                      >
                        <HiUpload className="icon-white-offer-details" />{" "}
                        {file ? file.name : "Wybierz swoje CV"}
                      </label>
                      <input
                        type="file"
                        name="cv"
                        id="upload-cv-offer-details"
                        onChange={chooseFile}
                      />
                    </div>
                    <div className="content-app">
                      <button
                        className="btn-offer-details"
                        onClick={sendJobApplication}
                      >
                        <FiSend className="icon-white-offer-details" /> Aplikuj
                      </button>
                    </div>
                  </div>
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
      )}
    </div>
  );
}

export default JobOfferDetails;
