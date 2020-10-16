import React from 'react';
import PostJob from "./Components/PostJob/PostJob";
import EditJob from "./Components/EditJob/EditJob";
import Job from "./Components/Admin-panel/Job";
import Candidate from "./Components/Admin-panel/Candidate";
import JobDetail from './Components/Admin-panel/JobDetail/JobDetail'
import CandidateDetail from './Components/Admin-panel/CandidateDetail/CandidateDetail'
import Trello from './Components/Trello/Trello';
import Data from './Components/DataCandidate/Data';

// import Login from "./Components/Login/LoginAdmin";
const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Job/>
  },
  {
    path: "/job",
    exact: true,
    main: () => <Job/>
  },
  {
    path: "/candidate",
    exact: true,
    main: () => <Candidate/>
  },
  {
    path: "/post-job",
    exact: true,
    main: () => <PostJob/>
  },
  {
    path: "/edit-job/:id",
    exact: true,
    main: (props) => < EditJob {...props}/>
  },
  {
    path: "/job-detail/:id",
    exact: true,
    main: JobDetail
  },
  {
    path: "/candidate-detail/:id",
    exact: true,
    main: CandidateDetail
  },
  {
    path: "/trello",
    exact: true,
    main: () => <Trello/>
  },
  {
    path: "/data",
    exact: true,
    main: () => <Data/>
  },
];

export default routes;
