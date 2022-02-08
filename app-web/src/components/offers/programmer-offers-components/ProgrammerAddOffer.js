import React, { useState, useEffect } from "react";
import "../style-offers/AddOffer.css";
import "../style-offers/Filter.css";
import Switch from "@material-ui/core/Switch";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import {
  convertEditorToString,
  convertStringToEditor,
} from "../../../helpers/EditorHelper";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IoIosCreate, IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { validProgrammerOffer } from "../../../helpers/ValidatorHelper";
import { createToast } from "../../../helpers/ToastHelper";
import {
  createProgrammerOffer,
  editProgrammerOffer,
} from "../../../services/programmerofferService";
import { Redirect } from "react-router";
import SuggestionsList from "../../helpers/SuggestionsList";
import {
  educationType,
  languageDegree,
  jobTimeDegree,
  contractType,
} from "../../../helpers/Enumerations/OfferEnumerations";
import { errorHandling } from "../../../helpers/ErrorHelper";

function ProgrammerAddOffer(props) {
  const [redirect, setRedirect] = useState(null);

  const [addOfferValue, setAddOfferValue] = useState({
    title: "",
    localization: "",
    experience: "0",
    education: educationType[0],
    language: languageDegree[0],
    jobtime: jobTimeDegree[0],
    contractP: true,
    contractB: true,
    contractM: true,
    checkedRemote: false,
  });

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [technologyMain, setTechnologyMain] = useState([]);
  const [technologyNiceToHave, setTechnologyNiceToHave] = useState([]);

  const initState = () => {
    if (props.offer) {
      setAddOfferValue({
        title: props.offer.title,
        localization: props.offer.localization,
        experience: props.offer.experience,
        education: props.offer.education,
        language: props.offer.language,
        jobtime: props.offer.time,
        contractP: props.offer.contracts.includes(contractType[0]),
        contractB: props.offer.contracts.includes(contractType[1]),
        contractM: props.offer.contracts.includes(contractType[2]),
        checkedRemote: props.offer.remote,
      });

      setEditorState(
        convertStringToEditor(JSON.parse(props.offer.description))
      );
      setTechnologyMain(props.offer.technologyMain);
      setTechnologyNiceToHave(props.offer.technologyNiceToHave);
    }
  };

  useEffect(() => {
    initState();
  }, []);

  const handleChangeOffer = (event) => {
    setAddOfferValue({
      ...addOfferValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeSwitch = (event) => {
    setAddOfferValue({
      ...addOfferValue,
      [event.target.name]: event.target.checked,
    });
  };

  const [technologyMainRef, setTechnologyMainRef] = useState("");
  const [sugestionsTechnologyMain, setSugestionsTechnologyMain] = useState(
    false
  );

  const technologyMainRefChange = (event) => {
    setTechnologyMainRef(event.target.value);
    setSugestionsTechnologyMain(true);
  };

  const addTechnologyMain = () => {
    if (technologyMainRef !== "" && technologyMainRef.trim()) {
      setTechnologyMain((technologyMain) => [
        ...technologyMain,
        technologyMainRef,
      ]);
      setTechnologyMainRef("");
    }
  };

  const removeTechnologyMain = (index) => {
    technologyMain.splice(index, 1);
    setTechnologyMain((technologyMain) => [...technologyMain]);
  };

  const [technologyNiceToHaveRef, setTechnologyNiceToHaveRef] = useState("");
  const [
    sugestionsTechnologyNiceToHave,
    setSugestionsTechnologyNiceToHave,
  ] = useState(false);

  const technologyNiceToHaveRefChange = (event) => {
    setTechnologyNiceToHaveRef(event.target.value);
    setSugestionsTechnologyNiceToHave(true);
  };

  const addTechnologyNiceToHave = () => {
    if (technologyNiceToHaveRef !== "" && technologyNiceToHaveRef.trim()) {
      setTechnologyNiceToHave((technologyNiceToHave) => [
        ...technologyNiceToHave,
        technologyNiceToHaveRef,
      ]);
      setTechnologyNiceToHaveRef("");
    }
  };

  const removeTechnologyNiceToHave = (index) => {
    technologyNiceToHave.splice(index, 1);
    setTechnologyNiceToHave((technologyNiceToHave) => [
      ...technologyNiceToHave,
    ]);
  };

  const crateDataToSend = () => {
    let dateToSend = {
      title: addOfferValue.title,
      localization: addOfferValue.localization,
      experience: addOfferValue.experience,
      remote: addOfferValue.checkedRemote,
      education: addOfferValue.education,
      language: addOfferValue.language,
      time: addOfferValue.jobtime,
      contractP: addOfferValue.contractP,
      contractB: addOfferValue.contractB,
      contractM: addOfferValue.contractM,
      technologyMain: technologyMain,
      technologyNiceToHave: technologyNiceToHave,
      description: convertEditorToString(editorState),
    };

    return dateToSend;
  };

  const editOffer = async () => {
    let dateToSend = crateDataToSend();
    if (editorState.getCurrentContent().hasText()) {
      if (validProgrammerOffer(dateToSend)) {
        editProgrammerOffer(props.offer.id, dateToSend)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              props.updateOffer(response.data);
              createToast("success", "Pomyślnie zmodyfikowano ofertę");
            }
          })
          .catch((err) => {
            errorHandling(err);
          });
      }
    } else {
      createToast("error", "Nie podano informacji o sobie");
    }
  };

  const createOffer = async () => {
    let dateToSend = crateDataToSend();

    if (editorState.getCurrentContent().hasText()) {
      if (validProgrammerOffer(dateToSend)) {
        createProgrammerOffer(dateToSend)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              setRedirect(response.data.id);
              createToast("success", "Pomyślnie stworzono ofertę");
            }
          })
          .catch((err) => {
            errorHandling(err);
          });
      }
    } else {
      createToast("error", "Nie podano informacji o sobie");
    }
  };

  if (redirect) {
    return <Redirect to={`/programmeroffer?id=${redirect}`} />;
  }

  return (
    <div className="wrap-offer-add">
      <div className="content-offer-add">
        {props.offer ? (
          <h2 className="title-offer-add">Edytuj ofetre</h2>
        ) : (
          <h2 className="title-offer-add">Utwórz ofetre</h2>
        )}
        <div className="flex-wrap-add">
          <div>
            <input
              type="text"
              name="title"
              className="input-filter"
              placeholder="Tytuł"
              value={addOfferValue.title}
              onChange={handleChangeOffer}
            />
          </div>
          <div>
            <input
              type="text"
              name="localization"
              className="input-filter"
              placeholder="Miasto"
              value={addOfferValue.localization}
              onChange={handleChangeOffer}
            />
          </div>
          <div className="wrap-margin-filter">
            <label htmlFor="resultExperience">
              Doświadczenie zawodowe (w latach)
            </label>
            <br />
            <input
              type="range"
              id="experience"
              name="experience"
              step="0.5"
              min="0"
              max="15"
              value={addOfferValue.experience}
              onChange={handleChangeOffer}
            />
            <br />
            <input
              className="input-smaller-filter"
              type="number"
              id="resultExperience"
              name="resultExperience"
              value={addOfferValue.experience}
              readOnly
            />
          </div>
          <div>
            <Switch
              color="primary"
              checked={addOfferValue.checkedRemote}
              name="checkedRemote"
              onChange={handleChangeSwitch}
            />
            <span>Praca zdalna</span>
          </div>
          <div className="wrap-top-offer-add">
            <div className="wrap-margine-right-offer-add">
              <div className="wrap-margin-top-offer-add">
                <label htmlFor="education">Wykształcenie </label>
                <br />
                <div className="dropdownlist-item-add">
                  <select
                    className="input-smaller-filter"
                    name="education"
                    id="education"
                    onChange={handleChangeOffer}
                    value={addOfferValue.education}
                  >
                    {educationType.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="wrap-margin-top-offer-add">
                <label htmlFor="jobtime">Etat </label>
                <br />
                <div className="dropdownlist-item-add">
                  <select
                    className="input-smaller-filter"
                    name="jobtime"
                    id="jobtime"
                    onChange={handleChangeOffer}
                    value={addOfferValue.jobtime}
                  >
                    {jobTimeDegree.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className="wrap-margin-top-offer-add">
                <label htmlFor="language">Poziom j.angielsiego </label>
                <br />
                <div className="dropdownlist-item-add">
                  <select
                    className="input-smaller-filter"
                    name="language"
                    id="language"
                    onChange={handleChangeOffer}
                    value={addOfferValue.language}
                  >
                    {languageDegree.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-offer-add">
        <h3 className="title-offer-add">Rodzaj umowy</h3>
        <div>
          <Switch
            color="primary"
            checked={addOfferValue.contractP}
            name="contractP"
            onChange={handleChangeSwitch}
          />
          <span>O pracę</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={addOfferValue.contractB}
            name="contractB"
            onChange={handleChangeSwitch}
          />
          <span>B2B</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={addOfferValue.contractM}
            name="contractM"
            onChange={handleChangeSwitch}
          />
          <span>Zlecenie</span>
        </div>
      </div>
      <div className="content-offer-add">
        <h3 className="title-offer-add">Główne technologie</h3>
        <div>
          <input
            autoComplete="off"
            type="text"
            name="technologyMain"
            className="input-filter"
            placeholder="Dodaj technologie"
            value={technologyMainRef}
            onChange={technologyMainRefChange}
          />

          {sugestionsTechnologyMain ? (
            <SuggestionsList
              setDisplaySuggestions={setSugestionsTechnologyMain}
              value={technologyMainRef}
              setValue={setTechnologyMainRef}
            />
          ) : (
            ""
          )}

          <IoIosAddCircle
            className="btn-add-filter"
            onClick={addTechnologyMain}
          />
        </div>
        <div>
          <ul className="ul-filter">
            {technologyMain.map((item, index) => (
              <li key={index} className="li-offer-add">
                {item}{" "}
                <IoIosRemoveCircle
                  className="btn-remove-filter"
                  onClick={() => removeTechnologyMain(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="content-offer-add">
        <h3 className="title-offer-add">Technologie poboczne</h3>
        <div>
          <input
            autoComplete="off"
            type="text"
            name="technologyNiceToHave"
            className="input-filter"
            placeholder="Dodaj technologie"
            value={technologyNiceToHaveRef}
            onChange={technologyNiceToHaveRefChange}
          />

          {sugestionsTechnologyNiceToHave ? (
            <SuggestionsList
              setDisplaySuggestions={setSugestionsTechnologyNiceToHave}
              value={technologyNiceToHaveRef}
              setValue={setTechnologyNiceToHaveRef}
            />
          ) : (
            ""
          )}

          <IoIosAddCircle
            className="btn-add-filter"
            onClick={addTechnologyNiceToHave}
          />
        </div>
        <div>
          <ul className="ul-filter">
            {technologyNiceToHave.map((item, index) => (
              <li key={index} className="li-offer-add">
                {item}{" "}
                <IoIosRemoveCircle
                  className="btn-remove-filter"
                  onClick={() => removeTechnologyNiceToHave(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="content-offer-add">
        <h3 className="title-offer-add">O tobie:</h3>
        <div className="top-border-offer-add">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
          />
        </div>
        <div className="center-flex-offer-add">
          <div>
            <div className="center-app">
              {props.offer ? (
                <button className="btn-offer-add" onClick={editOffer}>
                  <IoIosCreate className="icon-white-offer-add" /> Potwierdź
                  edycje
                </button>
              ) : (
                <button className="btn-offer-add" onClick={createOffer}>
                  <IoIosCreate className="icon-white-offer-add" /> Zapisz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgrammerAddOffer;
