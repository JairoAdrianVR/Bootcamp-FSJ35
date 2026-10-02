'use client';

import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface AuthBoxProps {
  onError: (msg: string | null) => void;
}

export function AuthBox({ onError }: AuthBoxProps) {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);
    try {
      if (isRegistering) {
        await api.register(form);
        alert('Registro exitoso. Inicia sesión.');
        setIsRegistering(false);
      } else {
        const res = await api.login({ email: form.email, password: form.password });
        login(res.token, res.user);
      }
      setForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      onError(err.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm px-3 py-1.5 rounded-md"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
      <h2 className="font-bold text-slate-800 mb-3">{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegistering && (
          <input
            type="text"
            placeholder="Nombre (min 5)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-black"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-black"
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mín 8 car, mayús, núm, símb)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-black"
          required
        />
        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium">
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-blue-600 hover:underline"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </form>
    </div>
  );
}