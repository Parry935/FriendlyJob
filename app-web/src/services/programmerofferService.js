import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";
import qs from "qs";

export const createProgrammerOffer = async (programmerOfferData) => {
  return await axios.post(
    "programmeroffers",
    {
      title: programmerOfferData.title,
      localization: programmerOfferData.localization,
      experience: programmerOfferData.experience,
      remote: programmerOfferData.remote,
      education: programmerOfferData.education,
      language: programmerOfferData.language,
      contractP: programmerOfferData.contractP,
      contractB: programmerOfferData.contractB,
      contractM: programmerOfferData.contractM,
      time: programmerOfferData.time,
      description: programmerOfferData.description,
      technologyMain: programmerOfferData.technologyMain,
      technologyNiceToHave: programmerOfferData.technologyNiceToHave,
    },
    {
      headers: authHeader(),
    }
  );
};

export const editProgrammerOffer = async (id, programmerOfferData) => {
  return await axios.put(
    `programmeroffers/${id}`,
    {
      title: programmerOfferData.title,
      localization: programmerOfferData.localization,
      experience: programmerOfferData.experience,
      remote: programmerOfferData.remote,
      education: programmerOfferData.education,
      language: programmerOfferData.language,
      contractP: programmerOfferData.contractP,
      contractB: programmerOfferData.contractB,
      contractM: programmerOfferData.contractM,
      time: programmerOfferData.time,
      description: programmerOfferData.description,
      technologyMain: programmerOfferData.technologyMain,
      technologyNiceToHave: programmerOfferData.technologyNiceToHave,
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteProgrammerOffer = async (id) => {
  return await axios.delete(`programmeroffers/${id}`, {
    headers: authHeader(),
  });
};

export const getProgrammerOffers = async (page, programmerOfferQuery) => {
  return await axios.get("programmeroffers", {
    params: {
      page: page,
      educationV: programmerOfferQuery.educationV,
      educationE: programmerOfferQuery.educationE,
      educationM: programmerOfferQuery.educationM,
      educationNS: programmerOfferQuery.educationNS,
      jobTimeFull: programmerOfferQuery.jobTimeFull,
      jobTime34: programmerOfferQuery.jobTime34,
      jobTime12: programmerOfferQuery.jobTime12,
      jobTimeNS: programmerOfferQuery.jobTimeNS,
      contractP: programmerOfferQuery.contractP,
      contractB: programmerOfferQuery.contractB,
      contractM: programmerOfferQuery.contractM,
      contractNS: programmerOfferQuery.contractNS,
      remote: programmerOfferQuery.remote,
      expFrom: programmerOfferQuery.expFrom,
      expTo: programmerOfferQuery.expTo,
      language: programmerOfferQuery.language,
      localization: programmerOfferQuery.localization,
      phrase: programmerOfferQuery.phrase,
      technologyMain: programmerOfferQuery.technologyMain,
      technologyNiceToHave: programmerOfferQuery.technologyNiceToHave,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
    headers: authHeader(),
  });
};

export const getProgrammerOffersForUser = async (id) => {
  return await axios.get(`programmeroffers/user/${id}`, {
    headers: authHeader(),
  });
};

export const getProgrammerOffer = async (id) => {
  return await axios.get(`programmeroffers/${id}`, {
    headers: authHeader(),
  });
};
