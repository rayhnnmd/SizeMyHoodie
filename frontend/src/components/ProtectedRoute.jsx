import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // If loading, you might want to show a spinner. 
    // However, AuthProvider prevents children rendering until loading is done,
    // so this check is here just in case logic changes later.
    if (loading) return null;

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    return children;
}
