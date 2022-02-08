import React, { useState } from "react";
import { JobContext } from "../contexts/JobContext";

function JobProvider(props) {
  const [jobQuery, setJobQuery] = useState({
    page: 1,
    filterValues: {
      levelJ: true,
      levelM: true,
      levelS: true,
      jobTimeFull: true,
      jobTime34: true,
      jobTime12: true,
      jobTimeNS: true,
      contractP: true,
      contractB: true,
      contractM: true,
      contractNS: true,
      salary: false,
      remote: false,
      expFrom: "0",
      expTo: "15",
      language: "",
      salaryFrom: "",
      salaryTo: "",
      localization: [],
      technologyMain: [],
      technologyNiceToHave: [],
      phrase: [],
    },
  });

  return (
    <JobContext.Provider value={{ jobQuery, setJobQuery }}>
      {props.children}
    </JobContext.Provider>
  );
}

export default JobProvider;
