import axios from "axios";
import { authHeader } from "../helpers/AuthHeader";
import qs from "qs";

export const createJobOffer = async (jobOfferData) => {
  return await axios.post(
    "joboffers",
    {
      title: jobOfferData.title,
      localization: jobOfferData.localization,
      salary: jobOfferData.salary,
      experience: jobOfferData.experience,
      remote: jobOfferData.remote,
      level: jobOfferData.level,
      language: jobOfferData.language,
      contractP: jobOfferData.contractP,
      contractB: jobOfferData.contractB,
      contractM: jobOfferData.contractM,
      time: jobOfferData.time,
      description: jobOfferData.description,
      technologyMain: jobOfferData.technologyMain,
      technologyNiceToHave: jobOfferData.technologyNiceToHave,
    },
    {
      headers: authHeader(),
    }
  );
};

export const editJobOffer = async (id, jobOfferData) => {
  return await axios.put(
    `joboffers/${id}`,
    {
      title: jobOfferData.title,
      localization: jobOfferData.localization,
      salary: jobOfferData.salary,
      experience: jobOfferData.experience,
      remote: jobOfferData.remote,
      level: jobOfferData.level,
      language: jobOfferData.language,
      contractP: jobOfferData.contractP,
      contractB: jobOfferData.contractB,
      contractM: jobOfferData.contractM,
      time: jobOfferData.time,
      description: jobOfferData.description,
      technologyMain: jobOfferData.technologyMain,
      technologyNiceToHave: jobOfferData.technologyNiceToHave,
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteJobOffer = async (id) => {
  return await axios.delete(`joboffers/${id}`, {
    headers: authHeader(),
  });
};

export const getJobOffers = async (page, jobOfferQuery) => {
  return await axios.get("joboffers", {
    params: {
      page: page,
      levelJ: jobOfferQuery.levelJ,
      levelM: jobOfferQuery.levelM,
      levelS: jobOfferQuery.levelS,
      jobTimeFull: jobOfferQuery.jobTimeFull,
      jobTime34: jobOfferQuery.jobTime34,
      jobTime12: jobOfferQuery.jobTime12,
      jobTimeNS: jobOfferQuery.jobTimeNS,
      contractP: jobOfferQuery.contractP,
      contractB: jobOfferQuery.contractB,
      contractM: jobOfferQuery.contractM,
      contractNS: jobOfferQuery.contractNS,
      salary: jobOfferQuery.salary,
      remote: jobOfferQuery.remote,
      expFrom: jobOfferQuery.expFrom,
      expTo: jobOfferQuery.expTo,
      language: jobOfferQuery.language,
      salaryFrom: jobOfferQuery.salaryFrom,
      salaryTo: jobOfferQuery.salaryTo,
      localization: jobOfferQuery.localization,
      phrase: jobOfferQuery.phrase,
      technologyMain: jobOfferQuery.technologyMain,
      technologyNiceToHave: jobOfferQuery.technologyNiceToHave,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
    headers: authHeader(),
  });
};

export const getJobOffersForUser = async (id) => {
  return await axios.get(`joboffers/user/${id}`, {
    headers: authHeader(),
  });
};

export const getJobOffer = async (id) => {
  return await axios.get(`joboffers/${id}`, {
    headers: authHeader(),
  });
};
