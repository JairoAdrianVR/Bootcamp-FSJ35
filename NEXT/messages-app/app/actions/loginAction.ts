"use server";

import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../repositories/supabase";
import { createSession } from "../lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Completa todos los campos." };

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!user) return { error: "Credenciales inválidas." };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: "Credenciales inválidas." };

  await createSession(user.id);
  return { success: true };
}