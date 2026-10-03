// src/lib/session.ts
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "clave-secreta-minimo-32-caracteres-para-firmar-cookies";

function sign(value: string | number): string {
  const strVal = String(value); 
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(strVal)
    .digest("base64url");
  return `${strVal}.${signature}`;
}

function verify(signedValue: string): string | null {
  if (!signedValue || typeof signedValue !== "string") return null;

  const [value, signature] = signedValue.split(".");
  if (!value || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("base64url");

  // Si los tamaños no coinciden, evitamos fallo en timingSafeEqual
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expectedSignature)) {
    return null;
  }

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return isValid ? value : null;
}

export async function createSession(userId: string | number) {
  const cookieStore = await cookies();
  cookieStore.set("chat_user_session", sign(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("chat_user_session")?.value;
  if (!rawCookie) return null;
  return verify(rawCookie);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("chat_user_session");
}