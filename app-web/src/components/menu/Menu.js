import "./Menu.css";
import { FaRegRegistered } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import NavigationBar from "./NavigationBar";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import React, { useContext } from "react";
import { logout } from "../../services/authenticationService";
import { useHistory } from "react-router-dom";
import { createToast } from "../../helpers/ToastHelper";
import UserNavigationBar from "./UserNavigationBar";

function Menu() {
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  const logoutAction = () => {
    if (user !== null) {
      logout(setUser);
      history.push("/login");
      createToast("success", "Pomyślnie wylogowano");
    }
  };

  if (user) {
    return (
      <div className="navbar-top-menu">
        <div className="items-menu">
          <NavigationBar />
        </div>
        <div className="account-menu">
          <div className="items-acc-menu">
            <FiUser className="icon-menu" /> {user.firstName}
            <div className="hidden-acc-menu">
              <UserNavigationBar />
            </div>
          </div>
          <div className="link-logout-menu" onClick={logoutAction}>
            <AiOutlineLogout className="icon-menu" /> Wyloguj
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar-top-menu">
      <div className="link-acc-menu">
        <Link to="/" replace>
          Strona główna
        </Link>
      </div>
      <div className="account">
        <div className="link-acc-menu">
          <Link to="/login" replace>
            <AiOutlineLogin className="icon-menu" /> Logowanie
          </Link>
        </div>
        <div className="link-acc-menu">
          <Link to="/register" replace>
            <FaRegRegistered className="icon-menu" /> Rejestracja
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
