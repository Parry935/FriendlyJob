import React from "react";
import { MdError } from "react-icons/md";
import "./Error.css";

function Error(props) {
  const errorMessage = () => {
    if (props.details !== undefined && props.details != null) {
      if (props.details === 404) return "Status 404 - Nie znaleziono strony";
      else if (props.details === 403) return "Status 403 - Brak uprawnień";
      else if (props.details === 401) return "Status 401 - Brak autoryzacji";
      else if (props.details === 400) return "Status 400 - Błędne żądanie";
      else if (props.details === 500) return "Status 500 - Błąd serwera";
      else return "Nie znaleziono strony";
    } else return "Nie znaleziono strony";
  };

  return (
    <div className="center-absolute-app">
      <div className="card-error">
        <h1>
          <MdError className="icon-error" />
          {errorMessage()}
        </h1>
      </div>
    </div>
  );
}

export default Error;
