import { AuthContext } from "@/contexts/auth"
import { useContext } from "react"

export function Home() {
  const { user } = useContext(AuthContext)
  return (

    <p>home: {user.name}</p>
  )
}