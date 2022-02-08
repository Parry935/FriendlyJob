import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";

export const getCompany = async (companyId) => {
  return await axios.get(`account/company/${companyId}`, {
    headers: authHeader(),
    "content-type": "multipart/form-data",
  });
};

export const getUser = async (userId) => {
  return await axios.get(`account/${userId}`, {
    headers: authHeader(),
  });
};

export const deleteImage = async (id) => {
  return await axios.delete(`account/image/${id}`, {
    headers: authHeader(),
  });
};

export const updateImage = async (id, fileToSend) => {
  return await axios.post(`account/image/${id}`, fileToSend, {
    headers: authHeader(),
    "content-type": "multipart/form-data",
  });
};

export const updateUser = async (id, dataUser) => {
  return await axios.patch(
    `account/${id}`,
    {
      firstName: dataUser.firstName,
      lastName: dataUser.lastName,
      description: dataUser.description,
      company: dataUser.company
        ? {
            NIP: dataUser.company.nip,
            name: dataUser.company.name,
          }
        : null,
    },
    {
      headers: authHeader(),
    }
  );
};

export const updatePassword = async (id, password) => {
  return await axios.patch(
    `account/password/${id}`,
    { newPassword: password },
    {
      headers: authHeader(),
    }
  );
};

export const getUsers = async (phrase, page) => {
  return await axios.get("account", {
    params: {
      phrase: phrase,
      page: page,
    },
    headers: authHeader(),
  });
};

export const updateLock = async (id) => {
  return await axios.patch(`account/lock/${id}`, null, {
    headers: authHeader(),
  });
};
