"use server";

import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../repositories/supabase";
import { createSession } from "../lib/session";

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!name || !email || !password) {
      return { error: "Todos los campos de texto son obligatorios." };
    }

    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) return { error: "El correo ya está registrado." };

    let avatarUrl: string | null = null;

    if (avatarFile && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return { error: "El archivo debe ser una imagen válida." };
      }

      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      const buffer = await avatarFile.arrayBuffer();

      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(filePath, buffer, { contentType: avatarFile.type });

      if (uploadError) return { error: uploadError.message };

      const { data: publicData } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath);
      avatarUrl = publicData.publicUrl;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        name,
        email,
        password_hash: passwordHash,
        avatarUrl: avatarUrl || `[https://api.dicebear.com/7.x/bottts/svg?seed=$](https://api.dicebear.com/7.x/bottts/svg?seed=$){encodeURIComponent(name)}`,
        status: "online",
      })
      .select("id")
      .single();

    if (insertError || !newUser) return { error: insertError?.message };

    await createSession(newUser.id);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Error al procesar el registro." };
  }
}