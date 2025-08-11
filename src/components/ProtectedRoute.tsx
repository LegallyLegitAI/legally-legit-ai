import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, loading } = useSession();
  const location = useLocation();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!session) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}
