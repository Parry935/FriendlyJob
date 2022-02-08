import React from "react";
import { Link } from "react-router-dom";

function User(props) {
  return (
    <>
      <div className="wrap-user-admin">
        <div className="item-user-admin">
          <span className="red-user-admin">Email:</span> {props.user.email}
        </div>
        <div className="item-user-admin">
          {" "}
          <span className="red-user-admin">Imię i nazwisko:</span>{" "}
          {props.user.firstName} {props.user.lastName}
        </div>
        <div className="item-user-admin">
          <span className="red-user-admin">Rola:</span> {props.user.role}
        </div>
        {props.user.company && (
          <div className="item-user-admin">
            <span className="red-user-admin">Nazwa firmy:</span>{" "}
            {props.user.company.name}
          </div>
        )}
      </div>
      <Link className="btn-link-app" to={`userprofile?id=${props.user.id}`}>
        Zobacz profil
      </Link>
    </>
  );
}

export default User;
