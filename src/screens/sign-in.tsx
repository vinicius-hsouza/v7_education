import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignIn() {
  const { signIn, signUp } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);

      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">
          {isRegister ? "Criar conta" : "Entrar"}
        </h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Carregando..."
            : isRegister
              ? "Criar conta"
              : "Entrar"}
        </Button>

        <button
          className="w-full text-sm text-muted-foreground"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Já tenho conta"
            : "Ainda não tenho conta"}
        </button>
      </div>
    </div>
  );
}
