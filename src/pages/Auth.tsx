import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password, options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(params.get("next") || "/dashboard");
      }
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm">Full name</label>
              <input className="w-full rounded border p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input className="w-full rounded border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-70" disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button className="text-blue-600 underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
