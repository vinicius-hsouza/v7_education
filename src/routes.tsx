import { useContext } from "react";
import { AuthContext } from "./contexts/auth";
import { Navigate, Route, Routes as RoutesRR } from "react-router-dom";
import { Home } from "./screens/home";
import { SignIn } from "./screens/sign-in";

/* =======================
   PRIVATE ROUTE
======================= */
export function PrivateRoute({ children }: { children: JSX.Element }) {
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

/* =======================
   INDEX ROUTE (DECISORA)
======================= */
function IndexRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/sign-in" replace />;
}

/* =======================
   ROUTES
======================= */
export function Routes() {
  return (
    <RoutesRR>
      {/* rota raiz decide */}
      <Route path="/" element={<IndexRoute />} />

      {/* login */}
      <Route path="/sign-in" element={<SignIn />} />

      {/* home protegida */}
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
