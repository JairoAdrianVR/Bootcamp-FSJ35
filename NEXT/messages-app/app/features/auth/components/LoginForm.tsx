"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../../../actions/loginAction";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAction(formData);
    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Iniciar Sesión</h1>
      {errorMsg && <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">{errorMsg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none" />
        <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none" />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50">
          {loading ? "Accediendo..." : "Acceder"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-neutral-400">
        ¿No tienes cuenta? <Link className="text-indigo-400 hover:text-indigo-300 font-medium" href="/register">Regístrate</Link>
      </p>
    </div>
  );
}