import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";

export const createReport = async (id, reason) => {
  return await axios.post(
    "reports",
    {
      reason: reason,
      opinionId: id,
    },
    {
      headers: authHeader(),
    }
  );
};

export const getReports = async (page) => {
  return await axios.get("reports", {
    params: {
      page: page,
    },
    headers: authHeader(),
  });
};

export const deleteReport = async (id) => {
  return await axios.delete(`reports/${id}`, {
    headers: authHeader(),
  });
};
