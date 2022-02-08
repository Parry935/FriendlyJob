import React, { useState, useContext } from "react";
import "./Account.css";
import { register } from "../../services/authenticationService";
import Switch from "@material-ui/core/Switch";
import { Redirect } from "react-router-dom";
import { createToast } from "../../helpers/ToastHelper";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { errorHandling } from "../../helpers/ErrorHelper";
import { validRegisterData } from "../../helpers/ValidatorHelper";

function Register() {
  const history = useHistory();
  const [isCompany, setIsCompany] = useState(false);

  const handleChangeSwitch = (event) => {
    setIsCompany(event.target.checked);
  };

  const [registerData, setRegisterData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    nip: "",
    password: "",
    passwordRepeat: "",
  });

  const handleChangeRegister = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  const { user } = useContext(UserContext);

  const handleRegister = async () => {
    let validationResult = validRegisterData(registerData, isCompany);

    if (validationResult) {
      if (registerData.password !== registerData.passwordRepeat) {
        createToast("error", "Hasła nie są zgodne");
      } else {
        await register(registerData)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              createToast("success", "Pomyślnie zostałeś zarejestrowany");
              history.push("/login");
            }
          })
          .catch((err) => {
            errorHandling(err);
          });
      }
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="wrap-account">
      <h2>Rejestracja</h2>
      <div>
        <Switch
          color="primary"
          checked={isCompany}
          name="isCompany"
          onChange={handleChangeSwitch}
        />
        <span>Rejestracja jako firma</span>
      </div>
      {isCompany && (
        <>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className="input-account"
            onChange={handleChangeRegister}
            placeholder="Nazwa firmy"
          />
          <input
            type="number"
            id="nip"
            name="nip"
            className="input-account"
            onChange={handleChangeRegister}
            placeholder="NIP"
          />
        </>
      )}
      <input
        type="text"
        id="email"
        name="email"
        className="input-account"
        onChange={handleChangeRegister}
        placeholder="Email"
      />
      <input
        type="text"
        id="firstName"
        name="firstName"
        className="input-account"
        onChange={handleChangeRegister}
        placeholder="Imie"
      />
      <input
        type="text"
        id="lastName"
        name="lastName"
        className="input-account"
        onChange={handleChangeRegister}
        placeholder="Nazwisko"
      />
      <input
        type="password"
        id="password"
        name="password"
        className="input-account"
        onChange={handleChangeRegister}
        placeholder="Hasło"
      />
      <input
        type="password"
        id="passwordRepeat"
        name="passwordRepeat"
        className="input-account"
        onChange={handleChangeRegister}
        placeholder="Powtórz hasło"
      />

      <button onClick={handleRegister} className="btn-sub-account">
        Zarejestruj się
      </button>
    </div>
  );
}

export default Register;
