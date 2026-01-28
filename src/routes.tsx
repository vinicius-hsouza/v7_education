import { useContext } from "react";
import { AuthContext } from "./contexts/auth";
import { Navigate, Route, Routes as RoutesRR } from 'react-router-dom';
import { Home } from "./screens/home";
import { SignIn } from "./screens/sign-in";

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


export function Routes() {
  return (<RoutesRR>
    <Route path="/sign-in" element={<SignIn />} />

    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    />
  </RoutesRR>)
}