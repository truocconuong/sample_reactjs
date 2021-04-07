let initState = {
  className_wrap_broad: "pl_0",
};

// if (window.innerWidth >= 768) {
//   initState = {
//     className_wrap_broad: "pl_100",
//   };
// }

const uiReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_PADDING_BOARD":
      return { ...state, className_wrap_broad: "pl_232" };
    case "REMOVE_PADDING_BOARD":
      return { ...state, className_wrap_broad: "pl_100" };
    case "RESPONSIVE_PADDING_BOARD":
      return { ...state, className_wrap_broad: "pl_0" };
    default:
      return { ...state };
  }
};

export default uiReducer;
