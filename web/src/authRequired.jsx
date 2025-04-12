// src/authRequired.jsx
import { Navigate } from "react-router";

const authRequired = (Component) => {
    const AuthenticatedComponent = (props) => {
        const token = localStorage.getItem("jwt-token");

        if (!token) {
            return <Navigate to="/" />;
        }

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default authRequired;
