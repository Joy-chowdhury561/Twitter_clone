import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
export default function ProtectedRoute({ children }) {
  const { isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="fixed left-[50%] top-[50%] bottom-[50%]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
