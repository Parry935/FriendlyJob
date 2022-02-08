import React from "react";
import "../style-offers/Filter.css";
import Switch from "@material-ui/core/Switch";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { useState, useRef, useEffect, useContext } from "react";
import { ProgrammerContext } from "../../../contexts/ProgrammerContext";
import SuggestionsList from "../../helpers/SuggestionsList";
import { languageDegree } from "../../../helpers/Enumerations/OfferEnumerations";

function ProgrammerFilter() {
  const { programmerQuery, setProgrammerQuery } = useContext(ProgrammerContext);

  const [experience, setExperience] = useState({
    experienceFrom: programmerQuery.filterValues.expFrom,
    experienceTo: programmerQuery.filterValues.expTo,
  });

  const handleChangeExperience = (event) => {
    setExperience({
      ...experience,
      [event.target.name]: event.target.value,
    });
  };

  const [language, setLanguage] = useState(
    programmerQuery.filterValues.language
  );

  const languageChange = (event) => {
    setLanguage(event.target.value);
  };

  const [filterSwitch, setFilterSwitch] = useState({
    checkedW1: programmerQuery.filterValues.educationV,
    checkedW2: programmerQuery.filterValues.educationE,
    checkedW3: programmerQuery.filterValues.educationM,
    checkedW4: programmerQuery.filterValues.educationNS,
    checkedJobTimeFull: programmerQuery.filterValues.jobTimeFull,
    checkedJobTime34: programmerQuery.filterValues.jobTime34,
    checkedJobTime12: programmerQuery.filterValues.jobTime12,
    checkedJobTimeNotSpecified: programmerQuery.filterValues.jobTimeNS,
    checkedContractP: programmerQuery.filterValues.contractP,
    checkedContractB: programmerQuery.filterValues.contractB,
    checkedContractZ: programmerQuery.filterValues.contractM,
    checkedContractNotSpecified: programmerQuery.filterValues.contractNS,
    checkedRemote: programmerQuery.filterValues.remote,
  });

  const handleChangeSwitch = (event) => {
    setFilterSwitch({
      ...filterSwitch,
      [event.target.name]: event.target.checked,
    });
  };

  const phraseRef = useRef();
  const [phrase, setPhrase] = useState(programmerQuery.filterValues.phrase);

  const addPhrase = () => {
    if (phraseRef.current.value !== "" && phraseRef.current.value.trim()) {
      setPhrase((phrase) => [...phrase, phraseRef.current.value]);
    }
  };

  const removePhrase = (index) => {
    phrase.splice(index, 1);
    setPhrase((phrase) => [...phrase]);
  };

  const localizationRef = useRef();
  const [localization, setLocaliztaion] = useState(
    programmerQuery.filterValues.localization
  );

  const addLocaliztaion = () => {
    if (
      localizationRef.current.value !== "" &&
      localizationRef.current.value.trim()
    ) {
      setLocaliztaion((localization) => [
        ...localization,
        localizationRef.current.value,
      ]);
    }
  };

  const removeLocaliztaion = (index) => {
    localization.splice(index, 1);
    setLocaliztaion((localization) => [...localization]);
  };

  const [technologyMainRef, setTechnologyMainRef] = useState("");
  const [sugestionsTechnologyMain, setSugestionsTechnologyMain] = useState(
    false
  );
  const [technologyMain, setTechnologyMain] = useState(
    programmerQuery.filterValues.technologyMain
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
  const [technologyNiceToHave, setTechnologyNiceToHave] = useState(
    programmerQuery.filterValues.technologyNiceToHave
  );

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

  const handleFilter = () => {
    setProgrammerQuery({
      ...programmerQuery,
      filterValues: {
        educationV: filterSwitch.checkedW1,
        educationE: filterSwitch.checkedW2,
        educationM: filterSwitch.checkedW3,
        educationNS: filterSwitch.checkedW4,
        jobTimeFull: filterSwitch.checkedJobTimeFull,
        jobTime34: filterSwitch.checkedJobTime34,
        jobTime12: filterSwitch.checkedJobTime12,
        jobTimeNS: filterSwitch.checkedJobTimeNotSpecified,
        contractP: filterSwitch.checkedContractP,
        contractB: filterSwitch.checkedContractB,
        contractM: filterSwitch.checkedContractZ,
        contractNS: filterSwitch.checkedContractNotSpecified,
        remote: filterSwitch.checkedRemote,
        localization: localization,
        technologyMain: technologyMain,
        technologyNiceToHave: technologyNiceToHave,
        phrase: phrase,
        language: language,
        expFrom: experience.experienceFrom,
        expTo: experience.experienceTo,
      },
    });
  };

  useEffect(() => {
    handleFilter();
  }, [
    filterSwitch,
    localization,
    technologyMain,
    technologyNiceToHave,
    phrase,
    language,
    experience,
  ]);

  return (
    <div className="center-flex-filter">
      <div className="card-filter">
        <h3>Główne technologie</h3>
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
              <li key={index} className="li-filter">
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
      <div className="card-filter">
        <h3>Mile widziane technologie</h3>
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
              <li key={index} className="li-filter">
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
      <div className="card-filter">
        <h3>Lokalizacja</h3>
        <div>
          <input
            type="text"
            name="localization"
            className="input-filter"
            ref={localizationRef}
            placeholder="Dodaj localizacje"
          />
          <IoIosAddCircle
            className="btn-add-filter"
            onClick={addLocaliztaion}
          />
        </div>
        <div>
          <ul className="ul-filter">
            {localization.map((item, index) => (
              <li key={index} className="li-filter">
                {item}{" "}
                <IoIosRemoveCircle
                  className="btn-remove-filter"
                  onClick={() => removeLocaliztaion(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card-filter">
        <h3>Fraza</h3>
        <div>
          <input
            type="text"
            name="phrase"
            className="input-filter"
            ref={phraseRef}
            placeholder="Dodaj frazę"
          />
          <IoIosAddCircle className="btn-add-filter" onClick={addPhrase} />
        </div>
        <div>
          <ul className="ul-filter">
            {phrase.map((item, index) => (
              <li key={index} className="li-filter">
                {item}{" "}
                <IoIosRemoveCircle
                  className="btn-remove-filter"
                  onClick={() => removePhrase(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card-filter">
        <h3>Wykształcenie</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedW1}
            name="checkedW1"
            onChange={handleChangeSwitch}
          />
          <span>Zawodowe</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedW2}
            name="checkedW2"
            onChange={handleChangeSwitch}
          />
          <span>Inżynier/licencjat</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedW3}
            name="checkedW3"
            onChange={handleChangeSwitch}
          />
          <span>Magister</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedW4}
            name="checkedW4"
            onChange={handleChangeSwitch}
          />
          <span>Brak</span>
        </div>
      </div>
      <div className="card-filter">
        <h3>Etat</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedJobTimeFull}
            name="checkedJobTimeFull"
            onChange={handleChangeSwitch}
          />
          <span>Pełny etat</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedJobTime34}
            name="checkedJobTime34"
            onChange={handleChangeSwitch}
          />
          <span>3/4 Etatu</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedJobTime12}
            name="checkedJobTime12"
            onChange={handleChangeSwitch}
          />
          <span>1/2 Etatu</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedJobTimeNotSpecified}
            name="checkedJobTimeNotSpecified"
            onChange={handleChangeSwitch}
          />
          <span>Nie określono</span>
        </div>
      </div>
      <div className="card-filter">
        <h3>Umowa</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedContractP}
            name="checkedContractP"
            onChange={handleChangeSwitch}
          />
          <span>O pracę</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedContractB}
            name="checkedContractB"
            onChange={handleChangeSwitch}
          />
          <span>B2B</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedContractZ}
            name="checkedContractZ"
            onChange={handleChangeSwitch}
          />
          <span>Zlecenie</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedContractNotSpecified}
            name="checkedContractNotSpecified"
            onChange={handleChangeSwitch}
          />
          <span>Nie określono</span>
        </div>
      </div>
      <div className="card-filter">
        <h3>Doświadczenie zawodowe</h3>
        <div className="wrap-margin-filter">
          <div>
            <label htmlFor="resultExperienceFrom">Od (w latach)</label>
            <br />
            <input
              type="range"
              id="experienceFrom"
              name="experienceFrom"
              step="0.5"
              min="0"
              max="15"
              value={experience.experienceFrom}
              onChange={handleChangeExperience}
            />
            <br />
            <input
              className="input-smaller-filter"
              type="number"
              id="resultExperienceFrom"
              name="resultExperienceFrom"
              value={experience.experienceFrom}
              readOnly
            />
          </div>
          <div className="wrap-margin-filter">
            <label htmlFor="resultExperienceTo">Do (w latach)</label>
            <br />
            <input
              type="range"
              id="experienceTo"
              name="experienceTo"
              step="0.5"
              min="0"
              max="15"
              value={experience.experienceTo}
              onChange={handleChangeExperience}
            />
            <br />
            <input
              className="input-smaller-filter"
              type="number"
              id="resultExperienceTo"
              name="resultExperienceTo"
              value={experience.experienceTo}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="card-filter">
        <h3>Inne</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedRemote}
            name="checkedRemote"
            onChange={handleChangeSwitch}
          />
          <span>Praca zdalna</span>
        </div>
        <div className="wrap-margin-filter">
          <label htmlFor="language">Min. poziom j.angielsiego </label>
          <select
            className="input-smaller-filter"
            name="language"
            id="language"
            value={language}
            onChange={languageChange}
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
  );
}

export default ProgrammerFilter;
