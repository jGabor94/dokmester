CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"data" json NOT NULL,
	"size" integer NOT NULL,
	"file_name" varchar(100) NOT NULL,
	"status" varchar NOT NULL,
	"transaction_id" varchar(100),
	"type" varchar NOT NULL,
	"history" json NOT NULL,
	"original_invoice" uuid,
	"nav_status" varchar NOT NULL,
	"nav_errors" json,
	"partner_id" uuid,
	"company_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_id_unique" UNIQUE("id"),
	CONSTRAINT "invoices_name_unique" UNIQUE("name"),
	CONSTRAINT "invoices_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_partner_id_companies_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;