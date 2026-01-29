import { useContext } from "react";
import { Navigate, Route, Routes as RoutesRR } from "react-router-dom";
import { AuthContext } from "@/contexts/auth";
import { Home } from "@/screens/home";
import { SignIn } from "@/screens/sign-in";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

function IndexRoute() {
  const { user } = useContext(AuthContext);
  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/sign-in" replace />
  );
}

export function Routes() {
  return (
    <RoutesRR>
      <Route path="/" element={<IndexRoute />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </RoutesRR>
  );
}
