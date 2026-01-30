import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignIn() {
  const { signIn, signUp } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading(true);
      setError(null);

      if (isRegister) {
        if (!name) {
          setError("Informe seu nome");
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1656D4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-white">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-4xl font-semibold">MC</span>
          </div>

          <h1 className="text-2xl font-semibold mb-1">
            {isRegister ? "Create account" : "Welcome back"}
          </h1>

          <p className="text-white/80 text-sm text-center">
            {isRegister
              ? "Create an account to manage your finances"
              : "Sign in to manage your finances"}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {isRegister && (
            <div className="space-y-1">
              <Label className="text-white">Name</Label>
              <Input
                className="h-14 rounded-2xl text-base"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-white">Email Address</Label>
            <Input
              type="email"
              className="h-14 rounded-2xl text-base"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-white">Password</Label>
            <Input
              type="password"
              className="h-14 rounded-2xl text-base"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-200 text-center">{error}</p>
          )}

          {!isRegister && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-white/80 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            className="w-full h-14 rounded-2xl bg-white text-[#1656D4] text-base font-semibold hover:bg-white/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isRegister
                ? "Sign Up"
                : "Log In"}
          </Button>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-center text-sm text-white/80"
          >
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span className="text-white font-medium">Log In</span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <span className="text-white font-medium">Sign Up</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-2 text-white/60 text-xs px-4 py-2 rounded-full bg-white/10">
            🔒 Secure connection
          </div>
        </div>
      </div>
    </div>
  );
}
