import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";
import { createToast } from "../helpers/ToastHelper";

export const createJobApplication = async (
  description,
  file,
  offerId,
  userId
) => {
  return await axios
    .post(
      "jobapplications",
      {
        description: description,
        offerId: offerId,
        userId: userId,
      },
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        addFileToJobApplication(file, response.data);
      }
    });
};

const addFileToJobApplication = async (file, id) => {
  await axios
    .post(`jobapplications/file/${id}`, file, {
      headers: authHeader(),
      "content-type": "multipart/form-data",
    })
    .then((response) => {
      if (response !== undefined && response.status === 200)
        createToast("success", "Pomyślnie wysłano aplikacje");
    });
};

export const getFile = async (fileName) => {
  return await axios
    .get("jobapplications/file", {
      params: {
        fileName: fileName,
      },
      headers: authHeader(),
      responseType: "blob",
    })
    .then((response) => {
      if (response !== undefined && response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "CV.pdf");
        document.body.appendChild(link);
        link.click();
      }
    });
};

export const getJobApplicationsForJobOffer = async (offerId, page) => {
  return await axios.get("jobapplications", {
    params: {
      jobOfferId: offerId,
      page: page,
    },
    headers: authHeader(),
  });
};

export const getJobApplicationsForUser = async (userId, page) => {
  return await axios.get("jobapplications", {
    params: {
      userId: userId,
      page: page,
    },
    headers: authHeader(),
  });
};

export const deleteJobApplication = async (id) => {
  return await axios.delete(`jobapplications/${id}`, {
    headers: authHeader(),
  });
};
