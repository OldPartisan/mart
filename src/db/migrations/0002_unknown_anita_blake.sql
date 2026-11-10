ALTER TYPE "public"."user_role" ADD VALUE 'MARKETER';--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'EDITOR';--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"mime_type" text NOT NULL,
	"size" integer DEFAULT 0 NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "publish_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "unpublish_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;