import React, { useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { JobContext } from "../contexts/JobContext";
import { ProgrammerContext } from "../contexts/ProgrammerContext";
import { getCurrentUser } from "../services/UserService";

function AppProvider(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    getCurrentUser().then((res) => {
      setUser(res);
    });
  }, []);

  const [jobQuery, setJobQuery] = useState({
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
  });

  const [programmerQuery, setProgrammerQuery] = useState({
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
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <JobContext.Provider value={{ jobQuery, setJobQuery }}>
        <ProgrammerContext.Provider
          value={{ programmerQuery, setProgrammerQuery }}
        >
          {props.children}
        </ProgrammerContext.Provider>
      </JobContext.Provider>
    </UserContext.Provider>
  );
}

export default AppProvider;
