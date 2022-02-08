import React, { useState } from "react";
import { ProgrammerContext } from "../contexts/ProgrammerContext";

function ProgrammerProvider(props) {
  const [programmerQuery, setProgrammerQuery] = useState({
    page: 1,
    filterValues: {
      educationV: true,
      educationE: true,
      educationM: true,
      educationNS: true,
      jobTimeFull: true,
      jobTime34: true,
      jobTime12: true,
      jobTimeNS: true,
      contractP: true,
      contractB: true,
      contractM: true,
      contractNS: true,
      remote: false,
      localization: [],
      technologyMain: [],
      technologyNiceToHave: [],
      phrase: [],
      language: "",
      expFrom: "0",
      expTo: "15",
    },
  });

  return (
    <ProgrammerContext.Provider value={{ programmerQuery, setProgrammerQuery }}>
      {props.children}
    </ProgrammerContext.Provider>
  );
}

export default ProgrammerProvider;
