import React from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import "./NavigationBar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Role } from "../../helpers/Enumerations/Role";

function UserNavigationBar() {
  const { user } = useContext(UserContext);

  const navigationUser = [
    { text: "Mój profil", link: `/userprofile?id=${user.id}` },
    { text: "Moje oferty", link: `/useroffers?id=${user.id}` },
    { text: "Moje widomości", link: "/mymessages" },
  ];

  const navigationAdmin = [
    { text: "Baza użytowników", link: "/users" },
    { text: "Zgłoszenia", link: "/reports" },
    { text: "Mój profil", link: `/userprofile?id=${user.id}` },
    { text: "Moje widomości", link: "/mymessages" },
  ];

  return (
    <div>
      <ul>
        {user.role === Role.Admin
          ? navigationAdmin.map((item, index) => (
              <Link to={item.link} key={index}>
                <div className="nav-elem">
                  <li>
                    <BsArrowReturnRight /> {item.text}
                  </li>
                </div>
              </Link>
            ))
          : navigationUser.map((item, index) => (
              <Link to={item.link} key={index}>
                <div className="nav-elem">
                  <li>
                    <BsArrowReturnRight /> {item.text}
                  </li>
                </div>
              </Link>
            ))}

        {user.role === Role.Programmer ? (
          <Link to={`/userjobapplications?id=${user.id}`}>
            <div className="nav-elem">
              <li>
                <BsArrowReturnRight /> Moje aplikacje
              </li>
            </div>
          </Link>
        ) : (
          ""
        )}
      </ul>
    </div>
  );
}

export default UserNavigationBar;
