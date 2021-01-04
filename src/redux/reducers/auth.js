let initState = {
  role: "",
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "SET_USER_ID":
      return { ...state, userId: action.payload };

    default:
      return { ...state };
  }
};

export default authReducer;
