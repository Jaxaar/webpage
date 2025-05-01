// import { history } from "../components/SetHistory";
import useToken from "./useToken";
// import { sha256 } from "js-sha256";


export const handleSignOut = () => {
    const { removeToken } = useToken()
    console.log("You've been logged out")
    // Clear the user session or token
    sessionStorage.removeItem('user');
    removeToken()
    // history.navigate('/login')
    // Redirect to the login page
};

export const hashPassword = (password, email) => {
    // return sha256(password + email + "*salt*")
}