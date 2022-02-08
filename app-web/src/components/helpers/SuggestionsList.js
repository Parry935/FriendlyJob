import React, { useState, useEffect } from "react";
import { getTechnologies } from "../../services/technologiesService";
import "./SuggestionsList.css";
import { errorHandling } from "../../helpers/ErrorHelper";

function SuggestionsList(props) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (props.value.length > 0) {
      getTechnologies(5, true, props.value)
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            let suggestionsFormServer = response.data.map((item) => item.name);
            setSuggestions(suggestionsFormServer);
          }
        })
        .catch((err) => {
          errorHandling(err);
        });
    } else {
      setSuggestions([]);
    }
  }, [props.value]);

  const onClick = (e) => {
    props.setDisplaySuggestions(false);
    props.setValue(e.target.innerText);
  };

  return (
    <ul className="suggestion-wrap">
      {suggestions.map((item, index) => (
        <li className="suggestion-item" key={index} onClick={onClick}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default SuggestionsList;
