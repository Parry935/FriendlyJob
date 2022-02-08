import React, { useContext, useState } from "react";
import { createToast } from "../../helpers/ToastHelper";
import { UserContext } from "../../contexts/UserContext";
import { Role } from "../../helpers/Enumerations/Role";

function Technology(props) {
  const [technologyName, setTechnologyName] = useState(props.technology.name);
  const [readOnly, setReadOnly] = useState(true);
  const { user } = useContext(UserContext);

  const handleConfirmEdit = () => {
    if (technologyName.length > 0 && technologyName.trim()) {
      props.update(props.technology.id, technologyName);
      setReadOnly(true);
    } else createToast("error", "Nazwa nie może być pusta");
  };

  const handleChangeTechnologyName = (e) => {
    setTechnologyName(e.target.value);
  };

  return (
    <div>
      <input
        className="input-user-accounts-admin"
        type="text"
        placeholder="Nazwa technologii"
        value={technologyName}
        readOnly={readOnly}
        onChange={handleChangeTechnologyName}
      />
      <div>
        <div className="wrap-admin">
          <b className="title-size-change-user">Użycie technologi:</b>
          <div className="item-user-admin">
            <i className="red-user-admin">Oferty pracy - główne:</i>{" "}
            {props.technology.jobOfferCountMain}
          </div>
          <div className="item-user-admin">
            {" "}
            <i className="red-user-admin">Oferty pracy - poboczne:</i>{" "}
            {props.technology.jobOfferCountNiceToHave}
          </div>
          <div className="item-user-admin">
            <i className="red-user-admin">Oferty programistów - główne:</i>{" "}
            {props.technology.programmerOfferCountMain}
          </div>
          <div className="item-user-admin">
            <i className="red-user-admin">Oferty programistów - poboczne:</i>{" "}
            {props.technology.programmerOfferCountNiceToHave}
          </div>
        </div>
      </div>
      {user.role === Role.Admin ? (
        <div className="wrap-admin">
          <button
            className="btn-admin red-user-bg-admin"
            onClick={() => props.delete(props.technology.id)}
          >
            Usuń
          </button>
          {readOnly ? (
            <button
              className="btn-admin green-user-bg-admin"
              onClick={() => setReadOnly(false)}
            >
              Edytuj
            </button>
          ) : (
            <button
              className="btn-admin green-user-bg-admin"
              onClick={handleConfirmEdit}
            >
              Potwierdź edycje
            </button>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Technology;
