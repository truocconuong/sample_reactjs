let initState = {
  className_wrap_broad: "pl_100",
};

const uiReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_PADDING_BOARD":
      return { ...state, className_wrap_broad: "pl_232" };
    case "REMOVE_PADDING_BOARD":
      return { ...state, className_wrap_broad: "pl_100" };
    default:
      return { ...state };
  }
};

export default uiReducer;
