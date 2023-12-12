import axios from 'axios'
const apiURL = import.meta.env.VITE_API_URL

export const login = async ({ commit }, { email, password }) => {
    try {
        const response = await axios.post(`${apiURL}/login`, 
        { END_USER_EMAIL: email, 
        END_USER_PASSWORD: password });

        if(response && response.data.ACTIVE_STATUS_ID === 1) {
            const userData = {
                isAuthenticated: true,
                userID: response.data.END_USER_ID,
                userFirstName: response.data.END_USER_FIRST_NAME,
                userEmail: response.data.END_USER_EMAIL,
                userRole: response.data.USER_ROLE_NAME,
            }
            commit('SET_STATE', userData)
            return userData;
        } else {
            console.error('Credentials not valid.')
        };

    } catch(error) {
        console.error('API request failed:', error);
    }
}

export const logout = ({ commit }) => {
    commit('LOGOUT')
}

