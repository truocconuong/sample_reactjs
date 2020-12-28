import React from 'react';
import EditJob from "./Components/Edit/EditJob";
import Job from "./Components/Table/Job.js";
import AddJob from "./Components/Edit/AddJob";
import Candidate from "./Components/Table/Candidate.js";
import JobDetail from './Components/PageDetail/JobDetail';
import Trello from './Components/Dnd/Broad.js';
import Client from './Components/Table/Client';
import UpdateClient from './Components/UpdateClient/UpdateClient';
import UserTeam from './Components/Table/UserTeam';
import Dashboard from './Components/Table/Dashboard';
import Profile from './Components/Table/ProfileDetail/Profile.js';
import Interview from './Components/Table/Interview/Interview';
import UpdateInterview from './Components/Table/Interview/UpdateInterview';
import Setting from './Components/Table/Setting.js';
import SearchCandidate from './Components/Table/SearchCandidate';
import PreviewCandidate from './Components/Table/PreviewCandidate';
import RefinedPdf from './Components/Table/RefinedPdf';

const routes = [
  {
    path: "/",
    exact: true,
    main: (props) => <Dashboard {...props}/>
  },
  {
    path: "/job",
    exact: true,
    main: (props) => <Job {...props} />
  },
  {
    path: "/candidate",
    exact: true,
    main: () => <Candidate />
  },
  {
    path: "/add-job",
    exact: true,
    main: (props) => <AddJob {...props} />
  },
  {
    path: "/edit-job/:id",
    exact: true,
    main: (props) => < EditJob {...props} />
  },
  {
    path: "/job-detail/:id",
    exact: true,
    main: JobDetail
  },
  {
    path: "/board",
    exact: true,
    main: () => <Trello />
  },
  {

    path: "/users",
    exact: true,
    main: (props) => <UserTeam {...props} />
  }, {

    path: "/client",
    exact: true,
    main: () => <Client />
  },
  {
    path: "/edit-client/:id",
    exact: true,
    main: (props) => < UpdateClient {...props} />
  },
  {
    path: "/dashboard",
    exact: true,
    main: () => <Dashboard />
  },
  {
    path: "/interview",
    exact: true,
    main: () => <Interview />
  },

  {
    path: "/profile/:id",
    exact: true,
    main: (props) => <Profile {...props} />
  },
  {
    path: "/interview/:id",
    exact: true,
    main: (props) => <UpdateInterview {...props} />
  },
  {
    path: "/setting",
    exact: true,
    main: (props) => <Setting {...props}/>
  },
  {
    path: "/search",
    exact: true,
    main: () => <SearchCandidate />
  },
  {
    path: "/preview/candidate/:candidateId/job/:jobId",
    exact: true,
    main: (props) => < PreviewCandidate {...props} />
  },

  {
    path: "/refine/candidate/:candidateId/job/:jobId",
    exact: true,
    main: (props) => < RefinedPdf {...props} />
  },

];

export default routes;
