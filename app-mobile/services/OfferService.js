import axios from "axios";
import { getAuthHeader } from "../helpers/AuthHeader";
import qs from "qs";

export const getProgrammerOffers = async (page, programmerOfferQuery) => {
  const authHeader = await getAuthHeader();
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
    headers: authHeader,
  });
};

export const getJobOffers = async (page, jobOfferQuery) => {
  const authHeader = await getAuthHeader();
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
    headers: authHeader,
  });
};
