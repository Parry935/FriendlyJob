import React, { useState, useEffect, useRef } from "react";
import "./CompanyOpinions.css";
import CompanyPost from "./CompanyPost";
import { FaEnvelope } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Error from "../Error";
import { createToast } from "../../helpers/ToastHelper";
import { showLoader } from "../../helpers/LoaderHelper";
import { Link } from "react-router-dom";
import { convertEditorToString } from "../../helpers/EditorHelper";
import { getCompany } from "../../services/userService";
import { getOpinions, addOpinion } from "../../services/opinionService";
import Switch from "@material-ui/core/Switch";
import { errorHandling } from "../../helpers/ErrorHelper";
import { defaultImageUser, baseURLImageUser } from "../../helpers/AppConstValues";

function CompanyOpinions() {
  const [anonymous, setAnonymous] = useState(false);

  const handleAnonymous = (event) => {
    setAnonymous(event.target.checked);
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [company, setCompany] = useState();
  const [opinions, setOpinions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ hasError: false, details: null });
  const [paramsToApiCall, setParamsToApiCall] = useState({
    sortType: "datedesc",
    page: 1,
  });
  const didMount = useRef(false);

  const queryParams = new URLSearchParams(window.location.search);
  const companyId = queryParams.get("id");

  const updateOpinionRatings = (id, ratingsForOpinion) => {
    const opinionsToEdit = [...opinions];

    opinionsToEdit[
      opinionsToEdit.findIndex((item) => item.id === id)
    ].usersIdLikes = ratingsForOpinion.usersIdLikes;

    opinionsToEdit[
      opinionsToEdit.findIndex((item) => item.id === id)
    ].usersIdDislikes = ratingsForOpinion.usersIdDislikes;

    setOpinions(opinionsToEdit);
  };

  const updateOpinionContent = (id, newContent) => {
    const opinionsToEdit = [...opinions];

    opinionsToEdit[
      opinionsToEdit.findIndex((item) => item.id === id)
    ].content = newContent;

    setOpinions(opinionsToEdit);
  };

  const deleteOpinion = (id) => {
    const opinionsToFilter = [...opinions];
    var newOpinions = opinionsToFilter.filter((item) => item.id !== id);
    setOpinions(newOpinions);
  };

  const previousPage = () => {
    if (paramsToApiCall.page > 1) {
      setParamsToApiCall({
        ...paramsToApiCall,
        page: paramsToApiCall.page - 1,
      });
    }
  };

  const nextPage = () => {
    setParamsToApiCall({ ...paramsToApiCall, page: paramsToApiCall.page + 1 });
  };

  const getCompanyAction = async () => {
    setIsLoading(true);
    if (companyId) {
      await getCompany(companyId)
        .then((response) => {
          if (response.data) {
            setCompany(response.data);
            getOpinionsForCompany();
          } else {
            createToast("error", "Nie znaleziono firmy");
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

  const getOpinionsForCompany = async () => {
    setIsLoading(true);
    await getOpinions(companyId, paramsToApiCall)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setOpinions(response.data);
        } else {
          if (paramsToApiCall.page > 1) {
            setParamsToApiCall({
              ...paramsToApiCall,
              page: paramsToApiCall.page - 1,
            });
            createToast("info", "Brak opini o firmie do pobrania");
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
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    getCompanyAction();
    return () => {
      setOpinions([]);
      setCompany(null);
    };
  }, []);

  useEffect(() => {
    if (didMount.current) getOpinionsForCompany();
    else didMount.current = true;
  }, [paramsToApiCall]);

  const addPost = async () => {
    if (editorState.getCurrentContent().hasText()) {
      const content = convertEditorToString(editorState);
      await addOpinion(companyId, content, anonymous)
        .then((response) => {
          if (response.data) {
            setOpinions((opinions) => [...opinions, response.data]);
            const editor = EditorState.push(
              editorState,
              ContentState.createFromText("")
            );
            setEditorState(editor);
            createToast("success", "Dodano opinię");
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else createToast("error", "Wpisz treść do opini");
  };

  const sortOpinions = (event) => {
    setParamsToApiCall({ page: 1, sortType: event.target.value });
  };

  if (error.hasError && !isLoading) return <Error details={error.details} />;

  return (
    <div className="main-wrap-opinions">
      {isLoading ? (
        showLoader()
      ) : (
        <>
          <div className="item-opinions">
            <div className="top-wrap-opinions">
              {" "}
              <img
                alt=""
                src={
                  company.user && company.user.imageSrc
                    ? `${baseURLImageUser}${company.user.imageSrc}`
                    : defaultImageUser
                }
                className="img-opinions"
              />
              <div>
                <h3 className="top-title-opinions">
                  Opinie o{" "}
                  <Link
                    className="link-blue-app"
                    to={`/userprofile?id=${company.user.id}`}
                  >
                    {company.name}
                  </Link>
                </h3>{" "}
                <div className="send-wrap-opinions">
                  <Link to={`/messagesdetails?recipientId=${company.user.id}`}>
                    <FaEnvelope className="icon-envelope-opinions" />
                  </Link>{" "}
                  Wyślij wiadomość
                </div>
              </div>
            </div>
          </div>
          {opinions.map((item) => (
            <div className="item-opinions" key={item.id}>
              <CompanyPost
                opinion={item}
                delete={deleteOpinion}
                updateContent={updateOpinionContent}
                updateRatings={updateOpinionRatings}
              />
            </div>
          ))}
          <div className="item-opinions">
            <div className="center-opinions">
              <div>
                <div className="center-opinions margin-top-opinions">
                  <select
                    className="input-sort-options"
                    name="sortOpinions"
                    id="sortOpinions"
                    onChange={sortOpinions}
                    value={paramsToApiCall.sortType}
                  >
                    <option value="datedesc">Sortuj po dacie malejąco</option>
                    <option value="dateasc">Sortuj po dacie rosnąco</option>
                    <option value="likes">Sortuj po lajkach</option>
                    <option value="dislikes">Sortuj po dislajkach</option>
                  </select>
                </div>
                <div>
                  <div className="pagination-app">
                    <div className="pagination-app-left" onClick={previousPage}>
                      <AiFillCaretLeft />
                    </div>
                    <div className="pagination-app-page-position">
                      {paramsToApiCall.page}
                    </div>
                    <div className="pagination-app-right" onClick={nextPage}>
                      <AiFillCaretRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item-opinions">
            <div className="wrap-add-post-opinions">
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
              />
            </div>
            <div className="center-opinions">
              <button onClick={addPost} className="btn-post-add-opinions">
                <IoMdAddCircle className="icon-add-opinions" />
                Dodaj opinie
              </button>
            </div>
            <div>
              <Switch
                color="secondary"
                checked={anonymous}
                name="anonymous"
                onChange={handleAnonymous}
              />
              <span>Dodaj opinie anonimowo</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CompanyOpinions;
