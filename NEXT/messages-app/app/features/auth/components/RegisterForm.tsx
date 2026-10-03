"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "../../../actions/registerAction";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<{ name: string; email: string; password: string; avatar: File | null }>({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setForm((prev) => ({ ...prev, [name]: file }));
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setForm((prev) => ({ ...prev, [name]: null }));
        setPreviewUrl(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.avatar) formData.append("avatar", form.avatar);

    const res = await registerAction(formData);
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
      <h1 className="text-2xl font-bold text-white text-center mb-6">Crear Cuenta</h1>
      {errorMsg && <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">{errorMsg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-neutral-700 bg-neutral-950 flex items-center justify-center">
            {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" /> : <span className="text-xs text-neutral-500">Sin foto</span>}
          </div>
          <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            <span>{form.avatar ? "Cambiar foto" : "Subir avatar"}</span>
            <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>
        <input type="text" name="name" required placeholder="Nombre completo" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none" />
        <input type="email" name="email" required placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none" />
        <input type="password" name="password" required placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none" />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50">
          {loading ? "Creando perfil..." : "Registrarse"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-neutral-400">
        ¿Ya tienes cuenta? <Link className="text-indigo-400 hover:text-indigo-300 font-medium" href="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}