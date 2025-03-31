import { useContext } from "react";
import { AuthContext } from "./contexts/auth";
import { Navigate, Route, Routes as RoutesRR } from 'react-router-dom';
import { Home } from "./screens/home";
import { SignIn } from "./screens/sign-in";

export function Routes() {
  const { user } = useContext(AuthContext)

  if (!user?.id) {
    return (
      <RoutesRR>
        <Route path="*" element={<Navigate to="/sign-in" />} />
        <Route path="/" element={<Navigate to="/sign-in" />} />
        <Route path="/sign-in" element={<SignIn />} />
      </RoutesRR>
    )
  }

  return (
    <RoutesRR>
      <Route path="*" element={<Navigate to="/home" />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
    </RoutesRR>
  )
}