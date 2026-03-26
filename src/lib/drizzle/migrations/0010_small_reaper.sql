CREATE TABLE "nav_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_name" varchar(15) NOT NULL,
	"password" varchar(255) NOT NULL,
	"signature_key" varchar(255) NOT NULL,
	"exchange_key" varchar(255) NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nav_data_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "nav_data" ADD CONSTRAINT "nav_data_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;