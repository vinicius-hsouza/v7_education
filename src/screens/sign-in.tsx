import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import { Button } from "@/components/ui/button";

export function SignIn() {
  const { signIn } = useContext(AuthContext);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">
        Bem-vindo ao MY Cash
      </h1>

      <Button onClick={signIn}>
        Entrar com Google
      </Button>
    </div>
  );
}
