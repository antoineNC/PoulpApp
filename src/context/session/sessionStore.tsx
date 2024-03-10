export const initialSession: SessionType = { connected: false };
export const sessionReducer = (
  prevState: SessionType,
  action: SessionActionType
): SessionType => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        token: action.session.token,
        connected: true,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        connected: true,
        token: action.session.token,
        user: action.session.user,
      };
    case "SIGN_OUT":
      return {
        connected: false,
      };
    default:
      return prevState;
  }
};
