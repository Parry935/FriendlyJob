import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";

export const getOpinions = async (companyId, paramsToApiCall) => {
  return await axios.get("opinions", {
    params: {
      company: companyId,
      sortBy: paramsToApiCall.sortType,
      page: paramsToApiCall.page,
    },
    headers: authHeader(),
  });
};

export const addOpinion = async (companyId, content, anonymous) => {
  return await axios.post(
    "opinions",
    { content: content, companyId: companyId, anonymous: anonymous },
    {
      headers: authHeader(),
    }
  );
};

export const deleteOpinion = async (id) => {
  return await axios.delete(`opinions/${id}`, {
    headers: authHeader(),
  });
};

export const editOpinion = async (id, content) => {
  return await axios.patch(
    `opinions/${id}`,
    {
      content: content,
    },
    {
      headers: authHeader(),
    }
  );
};
