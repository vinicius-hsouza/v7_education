import { AuthContext } from "@/contexts/auth"
import { useContext } from "react"
import { useNavigate } from "react-router-dom";


export function SignIn() {
  const { signIn, user } = useContext(AuthContext);
  const navigate = useNavigate()


  return (
    <div>
      {user.id && (
        <p>{user.name}</p>
      )}
      <button onClick={() => { signIn(); navigate('/home') }}>Logar</button>
    </div>
  )
}