import Menu from "./components/menu/Menu";
import Home from "./components/Home";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import JobMain from "./components/offers/job-offers-components/JobMain";
import JobOfferDetails from "./components/offers/job-offers-components/JobOfferDetails";
import ProgrammerMain from "./components/offers/programmer-offers-components/ProgrammerMain";
import ProgrammerOfferDetails from "./components/offers/programmer-offers-components/ProgrammerOfferDetails";
import ProgrammerAddOffer from "./components/offers/programmer-offers-components/ProgrammerAddOffer";
import CompanyOpinions from "./components/company/CompanyOpinions";
import UserOffers from "./components/account/UserOffers";
import Messages from "./components/account/Messages";
import MessageDetails from "./components/account/MessageDetails";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "./providers/AppProvider";
import ProgrammerProvider from "./providers/ProgrammerProvider";
import React from "react";
import { PrivateRoute } from "./components/PrivateRoute";
import { Role } from "./helpers/Enumerations/Role";
import UserProfile from "./components/account/UserProfile";
import Error from "./components/Error";
import JobProvider from "./providers/JobProvider";
import JobApplications from "./components/offers/job-applications/JobApplications";
import UserJobApplications from "./components/offers/job-applications/UserJobApplications";
import Users from "./components/admin/Users";
import Reports from "./components/admin/Reports";
import JobAddOffer from "./components/offers/job-offers-components/JobAddOffer";
import Technologies from "./components/admin/Technologies";

function App() {
  return (
    <div>
      <AppProvider>
        <ProgrammerProvider>
          <JobProvider>
            <Menu />
            <div className="content-app">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <PrivateRoute
                  path="/joboffers"
                  component={JobMain}
                  roles={[Role.Admin, Role.Programmer, Role.Company]}
                />
                <PrivateRoute
                  path="/programmeroffers"
                  component={ProgrammerMain}
                  roles={[Role.Admin, Role.Programmer, Role.Company]}
                />
                <PrivateRoute
                  path="/jobapplications"
                  component={JobApplications}
                  roles={[Role.Company]}
                />
                <PrivateRoute
                  path="/userjobapplications"
                  component={UserJobApplications}
                  roles={[Role.Programmer]}
                />
                <PrivateRoute
                  path="/joboffer"
                  component={JobOfferDetails}
                  roles={[Role.Admin, Role.Programmer, Role.Company]}
                />
                <PrivateRoute
                  path="/programmeroffer"
                  component={ProgrammerOfferDetails}
                  roles={[Role.Admin, Role.Programmer, Role.Company]}
                />
                <PrivateRoute
                  path="/jobadd"
                  component={JobAddOffer}
                  roles={[Role.Company]}
                />
                <PrivateRoute
                  path="/programmeradd"
                  component={ProgrammerAddOffer}
                  roles={[Role.Programmer]}
                />
                <PrivateRoute
                  path="/companyopinions"
                  component={CompanyOpinions}
                  roles={[Role.Admin, Role.Programmer]}
                />
                <PrivateRoute
                  path="/useroffers"
                  component={UserOffers}
                  roles={[Role.Company, Role.Programmer, Role.Admin]}
                />
                <PrivateRoute
                  path="/users"
                  component={Users}
                  roles={[Role.Admin]}
                />
                <PrivateRoute
                  path="/reports"
                  component={Reports}
                  roles={[Role.Admin]}
                />
                <PrivateRoute
                  path="/technologies"
                  component={Technologies}
                  roles={[Role.Company, Role.Programmer, Role.Admin]}
                />
                <PrivateRoute
                  path="/messagesdetails"
                  component={MessageDetails}
                />
                <PrivateRoute path="/mymessages" component={Messages} />
                <PrivateRoute path="/userprofile" component={UserProfile} />
                <Route path="*" component={Error} />
              </Switch>
            </div>
          </JobProvider>
        </ProgrammerProvider>
      </AppProvider>
    </div>
  );
}

export default App;
