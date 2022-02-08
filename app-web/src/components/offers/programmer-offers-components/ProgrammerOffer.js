import React from "react";
import "../style-offers/Offer.css";
import { FaCity } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { RiUserStarFill } from "react-icons/ri";
import {
  convertDate,
  convertExperience,
} from "../../../helpers/DisplayConvertHelper";
import {
  defaultImageUser,
  baseURLImageUser,
} from "../../../helpers/AppConstValues";

function ProgrammerOffer(props) {
  const technology = props.offer.technologyMain.slice(0, 3);

  return (
    <>
      <img
        alt=""
        src={
          props.offer.user.imageSrc != null
            ? `${baseURLImageUser}${props.offer.user.imageSrc}`
            : defaultImageUser
        }
        className="img-offer"
      />
      <div className="content-offer">
        <div>
          <h3 className="title-offer">{props.offer.title}</h3>
        </div>
        <div className="flex-offer">
          <div className="wrap-offer">
            <div className="item-offer">
              <FaCity className="icon-offer" /> {props.offer.localization}
            </div>
            <div className="item-offer">
              <RiUserStarFill className="icon-offer" />{" "}
              {convertExperience(props.offer.experience)}
            </div>
            <div className="item-offer">
              <BsCalendar className="icon-offer" />{" "}
              {convertDate(props.offer.date)}
            </div>
          </div>
          <div>
            {technology.map((item, index) => (
              <div className="item-offer" key={index}>
                <FaLaptopCode className="icon-offer" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgrammerOffer;
