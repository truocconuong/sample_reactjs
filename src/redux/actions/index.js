export function addPaddingBroad() {
  return { type: "ADD_PADDING_BOARD" };
}
export function removePaddingBroad() {
  return { type: "REMOVE_PADDING_BOARD" };
}

//auth action
export function setRole(role){
  return {
    type: "SET_ROLE",
    payload: role
  }
}

export function setUserId(userId){
  return {
    type: "SET_USER_ID",
    payload: userId
  }
}

export function setAvatarUser(linkAvatar){
  return {
    type: "SET_AVATAR_USER",
    payload: linkAvatar
  }
}