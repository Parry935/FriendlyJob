import React from "react";
import "../style-offers/Offer.css";
import { FaCity } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { BiMoney, BiTimeFive } from "react-icons/bi";
import { BsChevronDoubleUp, BsCalendar } from "react-icons/bs";
import { RiTeamFill, RiUserStarFill } from "react-icons/ri";
import {
  convertDate,
  convertExperience,
} from "../../../helpers/DisplayConvertHelper";
import {
  defaultImageUser,
  baseURLImageUser,
} from "../../../helpers/AppConstValues";

function JobOffer(props) {
  return (
    <>
      <img
        alt=""
        src={
          props.offer.company.user.imageSrc != null
            ? `${baseURLImageUser}${props.offer.company.user.imageSrc}`
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
              <RiTeamFill className="icon-offer" /> {props.offer.company.name}
            </div>
            <div className="item-offer">
              <FaCity className="icon-offer" /> {props.offer.localization}
            </div>

            <div className="item-offer">
              <BsChevronDoubleUp className="icon-offer" /> {props.offer.level}
            </div>

            <div className="item-offer">
              <BsCalendar className="icon-offer" />{" "}
              {convertDate(props.offer.date)}
            </div>
          </div>
          <div>
            {props.offer.contracts && (
              <div className="item-offer">
                <TiDocumentText className="icon-offer" />{" "}
                {props.offer.contracts}{" "}
              </div>
            )}
            {props.offer.time && (
              <div className="item-offer">
                <BiTimeFive className="icon-offer" /> {props.offer.time}{" "}
              </div>
            )}
            <div className="item-offer">
              <RiUserStarFill className="icon-offer" />{" "}
              {convertExperience(props.offer.experience)}
            </div>
            {props.offer.salary && (
              <div className="item-offer">
                <BiMoney className="icon-offer" /> {props.offer.salary} PLN{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobOffer;
