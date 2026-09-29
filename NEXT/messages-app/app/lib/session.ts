// src/lib/session.ts
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "una-clave-secreta-de-al-menos-32-caracteres";

// 1. Funciones auxiliares para firmar y verificar sin JWT
function sign(value: string): string {
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("base64url");
  return `${value}.${signature}`;
}

function verify(signedValue: string): string | null {
  const [value, signature] = signedValue.split(".");
  if (!value || !signature) return null;

  
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("base64url");

  // Comparamos si es valido
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return isValid ? value : null;
}

// 2. Crear sesión (guarda el userId firmado en la cookie)
export async function createSession(userId: string) {
  const signedUserId = sign(userId);
  const cookieStore = await cookies();

  cookieStore.set("chat_user_session", signedUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

// 3. Obtener el ID del usuario logueado
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("chat_user_session")?.value;
  if (!rawCookie) return null;

  try {
    return verify(rawCookie);
  } catch {
    return null;
  }
}

// 4. Cerrar sesión
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("chat_user_session");
}