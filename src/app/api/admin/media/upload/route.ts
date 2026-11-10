import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getDb } from "@/db";
import { media } from "@/db/schema";
import { getCurrentUser, isStaff } from "@/lib/auth";

export const runtime = "nodejs";

function s3Config() {
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT;
  if (!bucket || !accessKeyId || !secretAccessKey) return null;
  const client = new S3Client({
    region: process.env.S3_REGION ?? "ru-central1",
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: { accessKeyId, secretAccessKey },
  });
  const publicBase = (process.env.S3_PUBLIC_URL || (endpoint ? `${endpoint.replace(/\/$/, "")}/${bucket}` : "")).replace(/\/$/, "");
  return { client, bucket, publicBase };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const config = s3Config();
  if (!config) return NextResponse.json({ error: "S3 не настроен: добавьте S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  if (!(file instanceof File)) return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Максимум 8 МБ" }, { status: 413 });
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Только JPEG, PNG, WebP или AVIF" }, { status: 415 });

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const key = `cms/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  await config.client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const url = `${config.publicBase}/${key}`;
  const db = await getDb();
  const [row] = await db
    .insert(media)
    .values({ key, url, alt: alt || null, mimeType: file.type, size: file.size, uploadedBy: user.id })
    .returning();
  return NextResponse.json({ media: row });
}
