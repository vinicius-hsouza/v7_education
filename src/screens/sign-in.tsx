import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/auth"
import { useContext } from "react"


export function SignIn() {
  const { signIn } = useContext(AuthContext);


  return (
    <div className="flex flex-1 items-center justify-center flex-col h-screen">
      <h1>Bem vindo ao MY Cash</h1>
      <Button onClick={signIn}> Entrar com o Google</Button>
    </div>
  )
}