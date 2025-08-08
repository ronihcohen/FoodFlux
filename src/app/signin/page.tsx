"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if (res?.error) setError("Invalid credentials");
  }

  return (
    <div className="container-shell">
      <div className="max-w-md mx-auto card">
        <form onSubmit={onSubmit} className="card-body space-y-4">
          <div>
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="text-sm text-neutral-500">Sign in to continue</p>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="btn-primary w-full">Sign in</button>
          <p className="text-xs text-neutral-500">Demo: demo@foodflux.dev / demo1234</p>
        </form>
      </div>
    </div>
  );
}


