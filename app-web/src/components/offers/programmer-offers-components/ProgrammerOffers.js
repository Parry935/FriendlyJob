import React from "react";
import ProgrammerOffer from "./ProgrammerOffer";
import "../style-offers/Offers.css";
import { useHistory } from "react-router-dom";

function ProgrammerOffers(props) {
  let history = useHistory();

  function handleClick(id) {
    history.push(`programmeroffer?id=${id}`);
  }
  return (
    <div className="center-flex-offers">
      {props.offers.map((item) => (
        <div
          onClick={() => handleClick(item.id)}
          className="card-offers"
          key={item.id}
        >
          <ProgrammerOffer offer={item} />
        </div>
      ))}
    </div>
  );
}

export default ProgrammerOffers;
