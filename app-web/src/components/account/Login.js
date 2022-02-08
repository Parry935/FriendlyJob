import React, { useContext, useState } from "react";
import "./Account.css";
import { login } from "../../services/authenticationService";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { createToast } from "../../helpers/ToastHelper";

function Login() {
  const [loginData, setLogiData] = useState({
    email: "",
    password: "",
  });

  const { user, setUser } = useContext(UserContext);

  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = async () => {
    if (loginData.email.length === 0 || loginData.password.length === 0) {
      createToast("error", "Email i hasło muszą być wypełnione");
    } else {
      await login(loginData.email, loginData.password, setUser);
    }
  };

  const handleChangeLogin = (event) => {
    setLogiData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="wrap-account">
      <h2>Logowanie</h2>
      <input
        type="text"
        id="email"
        name="email"
        required
        className="input-account"
        onChange={handleChangeLogin}
        placeholder="Email"
      />
      <input
        type="password"
        id="password"
        name="password"
        required
        className="input-account"
        onChange={handleChangeLogin}
        placeholder="Hasło"
      />
      <button onClick={handleLogin} className="btn-sub-account">
        Zaloguj się
      </button>
    </div>
  );
}

export default Login;
