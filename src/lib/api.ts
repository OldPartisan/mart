import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function apiOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Проверьте заполнение полей", fields: error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  if (error instanceof Error && "status" in error && typeof (error as { status?: number }).status === "number") {
    return apiError(error.message, (error as { status: number }).status);
  }
  console.error("[api]", error);
  return apiError("Внутренняя ошибка. Попробуйте ещё раз.", 500);
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Некорректный JSON");
  }
}
