import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";
import { createToast } from "../helpers/ToastHelper";
import { errorHandling } from "../helpers/ErrorHelper";

export const login = async (email, password, setUser) => {
  return await axios
    .post("account/login", {
      email: email,
      password: password,
    })
    .then((response) => {
      if (response.data) {
        localStorage.setItem("token", response.data);
        return axios.get("account/currentUser", {
          headers: authHeader(),
        });
      }
    })
    .then((response) => {
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        createToast("success", "Pomyślna weryfikacja");
      }
    })
    .catch((err) => {
      errorHandling(err);
    });
};

export const logout = (setUser) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

export const register = async (registerData) => {
  return await axios.post("account/register", {
    email: registerData.email,
    firstName: registerData.firstName,
    lastName: registerData.lastName,
    password: registerData.password,
    nip: registerData.nip,
    companyName: registerData.companyName,
  });
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
