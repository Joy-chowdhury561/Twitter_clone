import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

const AuthRoute = ({ children, requireAuth = true }) => {
  const [authState, setAuthState] = useState({ loading: true, authenticated: false });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/getme", {
          credentials: "include",
        });

        const data = await res.json()

        if (!isMounted) return;

        setAuthState({
          loading: false,
          authenticated: res.ok && Boolean(data?.user),
        });
      } catch (error) {
          setAuthState({ loading: false, authenticated: false });
        if (!isMounted) 
            return console.log("internal server error",error);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !authState.authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAuth && authState.authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
