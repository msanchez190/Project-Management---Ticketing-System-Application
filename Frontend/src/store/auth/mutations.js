
export const SET_STATE = (state, payload)  => {
    state.isAuthenticated = payload.isAuthenticated;
    state.userID = payload.userID;
    state.userFirstName = payload.userFirstName;
    state.userEmail = payload.userEmail;
    state.userRole = payload.userRole;
}

export const LOGOUT = (state) => {
    state.isAuthenticated = false;
    state.userID = '';
    state.userFirstName = '';
    state.userEmail ='';
    state.userRole = '';
}

