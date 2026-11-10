CREATE TABLE "customer_import_batches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source" text DEFAULT 'AZS' NOT NULL,
	"file_name" text NOT NULL,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"imported_rows" integer DEFAULT 0 NOT NULL,
	"updated_rows" integer DEFAULT 0 NOT NULL,
	"skipped_rows" integer DEFAULT 0 NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_contacts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"source" text DEFAULT 'AZS' NOT NULL,
	"external_id" text,
	"user_id" uuid,
	"name" text,
	"phone" text,
	"email" text,
	"consent_email" boolean DEFAULT false NOT NULL,
	"consent_sms" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_source" text,
	"last_visit_at" timestamp with time zone,
	"visits_count" integer DEFAULT 0 NOT NULL,
	"fuel_spend" integer DEFAULT 0 NOT NULL,
	"shop_spend" integer DEFAULT 0 NOT NULL,
	"bonus_balance" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer_import_batches" ADD CONSTRAINT "customer_import_batches_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_contacts" ADD CONSTRAINT "marketing_contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "marketing_contacts_external_idx" ON "marketing_contacts" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "marketing_contacts_phone_idx" ON "marketing_contacts" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "marketing_contacts_email_idx" ON "marketing_contacts" USING btree ("email");