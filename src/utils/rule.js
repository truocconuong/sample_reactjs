const rulesAddUser = [
  {
    field: "emailUser",
    method: "isEmpty",
    validWhen: false,
    message: "Email is required.",
  },
  {
    field: "emailUser",
    method: "isEmail",
    validWhen: true,
    message: "Email is not valid.",
  },
  {
    field: "password",
    method: "isEmpty",
    validWhen: false,
    message: "Password is required.",
  },
  {
    field: "password",
    method: "isLength",
    validWhen: true,
    option: { min: 8, max: 16 },
    message: "Password is not valid.",
  },
  {
    field: "name",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },

  {
    field: "roleId",
    method: "isEmpty",
    validWhen: false,
    message: "Role is required.",
  },
];

const rulesAddTask = [
  {
    field: "title",
    method: "isEmpty",
    validWhen: false,
    message: "Title is required.",
  },
  {
    field: "content",
    method: "isEmpty",
    validWhen: false,
    message: "Content is required.",
  },
  {
    field: "startDate",
    method: "isEmpty",
    validWhen: false,
    message: "Start Date is required.",
  },
  {
    field: "dueDate",
    method: "isEmpty",
    validWhen: false,
    message: "Due Date is required.",
  },
  {
    field: "status",
    method: "isEmpty",
    validWhen: false,
    message: "Status is required.",
  },
];

const rulesAddUserNotDirector = [
  {
    field: "emailUser",
    method: "isEmpty",
    validWhen: false,
    message: "Email is required.",
  },
  {
    field: "emailUser",
    method: "isEmail",
    validWhen: true,
    message: "Email is not valid.",
  },
  {
    field: "password",
    method: "isEmpty",
    validWhen: false,
    message: "Password is required.",
  },
  {
    field: "password",
    method: "isLength",
    validWhen: true,
    option: { min: 8, max: 16 },
    message: "Password is not valid.",
  },
  {
    field: "name",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  {
    field: "roleId",
    method: "isEmpty",
    validWhen: false,
    message: "Role is required.",
  },
];

const rulesAddTeam = [
  {
    field: "name",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  {
    field: "idLeader",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
];
const rulesEditUser = [
  {
    field: "emailUserEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Email is required.",
  },
  {
    field: "emailUserEdit",
    method: "isEmail",
    validWhen: true,
    message: "Email is not valid.",
  },
  // {
  //   field: "passwordEdit",
  //   method: "isEmpty",
  //   validWhen: false,
  //   message: "Password is required.",
  // },
  // {
  //   field: "passwordEdit",
  //   method: "isLength",
  //   validWhen: true,
  //   option: { min: 8, max: 16 },
  //   message: "Password is not valid.",
  // },
  {
    field: "nameEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  {
    field: "roleIdEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Role is required.",
  },
];
const rulesEditUserNotDirector = [
  {
    field: "emailUserEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Email is required.",
  },
  {
    field: "emailUserEdit",
    method: "isEmail",
    validWhen: true,
    message: "Email is not valid.",
  },
  {
    field: "nameEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  {
    field: "roleIdEdit",
    method: "isEmpty",
    validWhen: false,
    message: "Role is required.",
  },
];

const rulesAddAndUpdateClient = [
  {
    field: "name",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  {
    field: "website",
    method: "isEmpty",
    validWhen: false,
    message: "Website is required.",
  },
];

const rulesCreateNewTask = [
  {
    field: "teamMemberId",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  // {
  //   field: "contentTask",
  //   method: "isEmpty",
  //   validWhen: false,
  //   message: "Task is required.",
  // },
];
const rulesEditTask = [
  {
    field: "userId",
    method: "isEmpty",
    validWhen: false,
    message: "Name is required.",
  },
  // {
  //   field: "content",
  //   method: "isEmpty",
  //   validWhen: false,
  //   message: "Task is required.",
  // },
];
const rulesCreateNewCard = [
  {
    field: "phone",
    method: "isEmpty",
    validWhen: false,
    option: { min: 8, max: 11 },
    message: "phone is required.",
  },
  {
    field: "email",
    method: "isEmpty",
    validWhen: false,
    message: "email is required.",
  },
  {
    field: "email",
    method: "isEmail",
    validWhen: true,
    message: "email is required.",
  },
  {
    field: "approachDate",
    method: "isEmpty",
    validWhen: false,
    message: "approachDate is required.",
  },
  {
    field: "noteApproach",
    method: "isEmpty",
    validWhen: false,
    message: "linkCv is required.",
  },
  {
    field: "nameJob",
    method: "isEmpty",
    validWhen: false,
    message: "nameJob is required.",
  },
  {
    field: "laneId",
    method: "isEmpty",
    validWhen: false,
    message: "laneId is required.",
  },
  {
    field: "social",
    method: "isEmpty",
    validWhen: false,
    message: "laneId is required.",
  },
];

const rulesCreateInterview = [
  {
    field: "jobName",
    method: "isEmpty",
    validWhen: false,
    message: "Job name is required.",
  },
  {
    field: "type",
    method: "isEmpty",
    validWhen: false,
    message: "Type is required.",
  },
  {
    field: "candidateId",
    method: "isEmpty",
    validWhen: false,
    message: "candidate name is required.",
  },
  {
    field: "password",
    method: "isLength",
    option: { max: 10 },
    validWhen: true,
    message: "candidate name is required.",
  },
];

const rulesUpdateInterview = [
  {
    field: "jobName",
    method: "isEmpty",
    validWhen: false,
    message: "Job name is required.",
  },
  {
    field: "candidateId",
    method: "isEmpty",
    validWhen: false,
    message: "candidate name is required.",
  },
  {
    field: "location",
    method: "isEmpty",
    validWhen: false,
    message: "location is required.",
  },
  {
    field: "password",
    method: "isLength",
    option: { max: 10 },
    validWhen: true,
    message: "candidate name is required.",
  },
];

const rulesCreateCardInterview = [
  {
    field: "type",
    method: "isEmpty",
    validWhen: false,
    message: "type is required.",
  },
];

const rulesUpdateConfig = [
  {
    field: "APPID",
    method: "isEmpty",
    validWhen: false,
    message: "APPID is required.",
  },
  {
    field: "APP_SECRET_KEY_BITLY",
    method: "isEmpty",
    validWhen: false,
    message: "APP_SECRET_KEY_BITLY is required.",
  },
  {
    field: "CLUSTER",
    method: "isEmpty",
    validWhen: false,
    message: "CLUSTER is required.",
  },
  {
    field: "DRIVER_ACCOUNT",
    method: "isEmpty",
    validWhen: false,
    message: "DRIVER_ACCOUNT is required.",
  },
  {
    field: "DRIVER_FOLDER_CV",
    method: "isEmpty",
    validWhen: false,
    message: "DRIVER_FOLDER_CV is required.",
  },
  {
    field: "DRIVER_TOKEN",
    method: "isEmpty",
    validWhen: false,
    message: "DRIVER_TOKEN is required.",
  },
  {
    field: "KEY",
    method: "isEmpty",
    validWhen: false,
    message: "KEY is required.",
  },
  {
    field: "SECRET",
    method: "isEmpty",
    validWhen: false,
    message: "SECRET is required.",
  },
  {
    field: "ZOOM_ID",
    method: "isEmpty",
    validWhen: false,
    message: "ZOOM_ID is required.",
  },
  {
    field: "ZOOM_TOKEN",
    method: "isEmpty",
    validWhen: false,
    message: "ZOOM_TOKEN is required.",
  },
];
const rulesCaculatorSalary = [
  {
    field: "salary",
    method: "isEmpty",
    validWhen: false,
    message: "salary is required.",
  },
  {
    field: "insuraneMoney",
    method: "isEmpty",
    validWhen: false,
    message: "insuraneMoney is required.",
  },
];
export {
  rulesAddUser,
  rulesEditUser,
  rulesAddTeam,
  rulesAddAndUpdateClient,
  rulesCreateNewTask,
  rulesEditTask,
  rulesCreateNewCard,
  rulesAddUserNotDirector,
  rulesCreateInterview,
  rulesUpdateInterview,
  rulesCreateCardInterview,
  rulesEditUserNotDirector,
  rulesUpdateConfig,
  rulesCaculatorSalary,
  rulesAddTask,
};
