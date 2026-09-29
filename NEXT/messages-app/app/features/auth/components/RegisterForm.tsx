"use client";
import { ChangeEvent, useState } from "react";
import Link from "next/link";

export default function RegisterForm() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword,setShowPassword] = useState(false);


    const [avatarPreview, setAvatarPreview] = useState(null);
    
    const handleSubmit= () => {
        //Procesar el submit
    }

    const handleAvatarChange = () => {
        //Procesar en onchange o cambio del avatar
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
       console.log(`${e.target.name} su valor es ${e.target.value}`);
        setFormData((prev) => ({
            /*
            inicialmente el prev
        name: "",
        email: "",
        password: ""
            */
            ...prev,
            [e.target.name] :e.target.value
        }))

    }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-800/80 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
      {/* Brand / Header */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 mb-3">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Crear cuenta</h1>
        <p className="text-xs text-neutral-400 mt-1">Ingresa tus datos para unirte al chat</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Avatar con Previsualización */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="relative group h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-neutral-700 bg-neutral-950 flex items-center justify-center transition hover:border-indigo-500">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-8 w-8 text-neutral-500 group-hover:text-indigo-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <label className="cursor-pointer text-xs font-medium text-indigo-400 hover:text-indigo-300 transition">
            <span>Subir imagen de perfil</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Input Nombre */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Nombre completo
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder-neutral-500 transition focus:border-indigo-500 focus:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Input Email */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder-neutral-500 transition focus:border-indigo-500 focus:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Input Contraseña */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 py-2.5 pl-10 pr-10 text-sm text-neutral-100 placeholder-neutral-500 transition focus:border-indigo-500 focus:bg-neutral-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-neutral-300"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 mt-2"
        >
          Crear cuenta
        </button>
      </form>

      {/* Enlace a Login */}
      <p className="mt-6 text-center text-xs text-neutral-400">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
