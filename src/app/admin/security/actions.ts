"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, requireStaff, verifyPassword } from "@/lib/auth";

export async function changeAdminPassword(input: { current: string; next: string }) {
  const user = await requireStaff();
  if (!input.current || !input.next) throw new Error("Заполните оба поля");
  if (input.next.length < 10) throw new Error("Новый пароль должен быть не короче 10 символов");
  if (!/[A-Za-z]/.test(input.next) || !/\d/.test(input.next)) throw new Error("Пароль должен содержать буквы и цифры");

  const db = await getDb();
  const valid = await verifyPassword(input.current, user.passwordHash);
  if (!valid) throw new Error("Текущий пароль неверен");

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(input.next), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { ok: true };
}
