import React from "react";
import JobOffer from "./JobOffer";
import "../style-offers/Offers.css";
import { useHistory } from "react-router-dom";

function JobOffers(props) {
  let history = useHistory();

  function handleClick(id) {
    history.push(`joboffer?id=${id}`);
  }

  return (
    <div className="center-flex-offers">
      {props.offers.map((item) => (
        <div
          onClick={() => handleClick(item.id)}
          className="card-offers"
          key={item.id}
        >
          <JobOffer offer={item} />
        </div>
      ))}
    </div>
  );
}

export default JobOffers;
