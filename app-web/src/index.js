import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { baseURLServer } from "./helpers/AppConstValues"

//define axios
axios.defaults.baseURL = baseURLServer;
axios.defaults.headers.post["Content-Type"] = "application/json";

//define toast
toast.configure();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
