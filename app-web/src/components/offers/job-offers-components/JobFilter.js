import React from "react";
import "../style-offers/Filter.css";
import Switch from "@material-ui/core/Switch";
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import { useState, useRef, useEffect, useContext } from "react";
import { JobContext } from "../../../contexts/JobContext";
import SuggestionsList from "../../helpers/SuggestionsList";
import { languageDegree } from "../../../helpers/Enumerations/OfferEnumerations";

function JobFilter() {
  const { jobQuery, setJobQuery } = useContext(JobContext);

  const [filterSwitch, setFilterSwitch] = useState({
    checkedLevelJ: jobQuery.filterValues.levelJ,
    checkedLevelM: jobQuery.filterValues.levelM,
    checkedLevelS: jobQuery.filterValues.levelS,
    checkedJobTimeFull: jobQuery.filterValues.jobTimeFull,
    checkedJobTime34: jobQuery.filterValues.jobTime34,
    checkedJobTime12: jobQuery.filterValues.jobTime12,
    checkedJobTimeNotSpecified: jobQuery.filterValues.jobTimeNS,
    checkedContractP: jobQuery.filterValues.contractP,
    checkedContractB: jobQuery.filterValues.contractB,
    checkedContractZ: jobQuery.filterValues.contractM,
    checkedContractNotSpecified: jobQuery.filterValues.contractNS,
    checkedSalary: jobQuery.filterValues.salary,
    checkedRemote: jobQuery.filterValues.remote,
  });

  const handleChangeSwitch = (event) => {
    setFilterSwitch({
      ...filterSwitch,
      [event.target.name]: event.target.checked,
    });
  };

  const [experience, setExperience] = useState({
    experienceFrom: jobQuery.filterValues.expFrom,
    experienceTo: jobQuery.filterValues.expTo,
  });

  const handleChangeExperience = (event) => {
    setExperience({
      ...experience,
      [event.target.name]: event.target.value,
    });
  };

  const [language, setLanguage] = useState(jobQuery.filterValues.language);

  const languageChange = (event) => {
    setLanguage(event.target.value);
  };

  const [salary, setSalary] = useState({
    salaryFrom: jobQuery.filterValues.salaryFrom,
    salaryTo: jobQuery.filterValues.salaryTo,
  });

  const handleChangeSalary = (event) => {
    setSalary({
      ...salary,
      [event.target.name]: event.target.value,
    });
  };

  const localizationRef = useRef();
  const [localization, setLocalization] = useState(
    jobQuery.filterValues.localization
  );

  const addLocalization = () => {
    if (
      localizationRef.current.value !== "" &&
      localizationRef.current.value.trim()
    ) {
      setLocalization((localization) => [
        ...localization,
        localizationRef.current.value,
      ]);
    }
  };

  const removeLocalization = (index) => {
    localization.splice(index, 1);
    setLocalization((localization) => [...localization]);
  };

  const [technologyMainRef, setTechnologyMainRef] = useState("");
  const [sugestionsTechnologyMain, setSugestionsTechnologyMain] = useState(
    false
  );
  const [technologyMain, setTechnologyMain] = useState(
    jobQuery.filterValues.technologyMain
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
    jobQuery.filterValues.technologyNiceToHave
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

  const phraseRef = useRef();
  const [phrase, setPhrase] = useState(jobQuery.filterValues.phrase);

  const addPhrase = () => {
    if (phraseRef.current.value !== "" && phraseRef.current.value.trim()) {
      setPhrase((phrase) => [...phrase, phraseRef.current.value]);
    }
  };

  const removePhrase = (index) => {
    phrase.splice(index, 1);
    setPhrase((phrase) => [...phrase]);
  };

  const handleFilter = () => {
    setJobQuery({
      ...jobQuery,
      filterValues: {
        levelJ: filterSwitch.checkedLevelJ,
        levelM: filterSwitch.checkedLevelM,
        levelS: filterSwitch.checkedLevelS,
        jobTimeFull: filterSwitch.checkedJobTimeFull,
        jobTime34: filterSwitch.checkedJobTime34,
        jobTime12: filterSwitch.checkedJobTime12,
        jobTimeNS: filterSwitch.checkedJobTimeNotSpecified,
        contractP: filterSwitch.checkedContractP,
        contractB: filterSwitch.checkedContractB,
        contractM: filterSwitch.checkedContractZ,
        contractNS: filterSwitch.checkedContractNotSpecified,
        salary: filterSwitch.checkedSalary,
        remote: filterSwitch.checkedRemote,
        expFrom: experience.experienceFrom,
        expTo: experience.experienceTo,
        language: language,
        salaryFrom: salary.salaryFrom,
        salaryTo: salary.salaryTo,
        localization: localization,
        technologyMain: technologyMain,
        technologyNiceToHave: technologyNiceToHave,
        phrase: phrase,
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
    salary,
    phrase,
    experience,
    language,
  ]);

  return (
    <div className="center-flex-filter">
      <div className="card-filter">
        <h3>Poziom</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedLevelJ}
            name="checkedLevelJ"
            onChange={handleChangeSwitch}
          />
          <span>Junior</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedLevelM}
            name="checkedLevelM"
            onChange={handleChangeSwitch}
          />
          <span>Mid</span>
        </div>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedLevelS}
            name="checkedLevelS"
            onChange={handleChangeSwitch}
          />
          <span>Senior</span>
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
        <h3>Zarobki</h3>
        <div>
          <Switch
            color="primary"
            checked={filterSwitch.checkedSalary}
            name="checkedSalary"
            onChange={handleChangeSwitch}
          />
          <span>Oferty tylko z zarobkami</span>
        </div>
        <div>
          <input
            type="number"
            name="salaryFrom"
            min="0"
            onChange={handleChangeSalary}
            value={salary.salaryFrom}
            className="input-filter"
            placeholder="Zarobki od (w PLN)"
          />
        </div>
        <div>
          <input
            type="number"
            name="salaryTo"
            min="0"
            onChange={handleChangeSalary}
            value={salary.salaryTo}
            className="input-filter"
            placeholder="Zarobki do (w PLN)"
          />
        </div>
      </div>
      <div className="card-filter">
        <h3>Główne technologie</h3>
        <div className="wrap-relative-offer">
          <input
            autoComplete="off"
            type="text"
            name="technologyMain"
            className="input-filter"
            placeholder="Dodaj technologie"
            value={technologyMainRef}
            onChange={technologyMainRefChange}
          />
          <IoIosAddCircle
            className="btn-add-filter"
            onClick={addTechnologyMain}
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
        <div className="wrap-relative-offer">
          <input
            autoComplete="off"
            type="text"
            name="technologyNiceToHave"
            className="input-filter"
            placeholder="Dodaj technologie"
            value={technologyNiceToHaveRef}
            onChange={technologyNiceToHaveRefChange}
          />
          <IoIosAddCircle
            className="btn-add-filter"
            onClick={addTechnologyNiceToHave}
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
            onClick={addLocalization}
          />
        </div>
        <div>
          <ul className="ul-filter">
            {localization.map((item, index) => (
              <li key={index} className="li-filter">
                {item}{" "}
                <IoIosRemoveCircle
                  className="btn-remove-filter"
                  onClick={() => removeLocalization(index)}
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
          <label htmlFor="language">Max poziom j.angielsiego </label>
          <select
            className="input-smaller-filter"
            name="language"
            id="language"
            onChange={languageChange}
            value={language}
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

export default JobFilter;
