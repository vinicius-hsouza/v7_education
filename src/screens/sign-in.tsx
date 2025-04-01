import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/auth"
import { useContext } from "react"
import { useNavigate } from "react-router-dom";


export function SignIn() {
  const { signIn, user } = useContext(AuthContext);
  const navigate = useNavigate()


  return (
    <div className="flex flex-1 items-center justify-center flex-col h-screen">
      <h1>Bem vindo ao MY Cash</h1>
      <Button onClick={() => { signIn(); navigate('/home') }}> Entrar com o Google</Button>
    </div>
  )
}