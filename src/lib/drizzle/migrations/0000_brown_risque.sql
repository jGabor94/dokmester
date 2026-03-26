CREATE TABLE "companies_meta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bid_seial" integer DEFAULT 0 NOT NULL,
	"den_seial" integer DEFAULT 0 NOT NULL,
	"con_seial" integer DEFAULT 0 NOT NULL,
	"inv_seial" integer DEFAULT 0 NOT NULL,
	"used_space" integer DEFAULT 0 NOT NULL,
	"users_number" integer DEFAULT 1 NOT NULL,
	"invites_number" integer DEFAULT 0 NOT NULL,
	"year" integer DEFAULT EXTRACT(YEAR FROM NOW()) NOT NULL,
	"company_id" uuid NOT NULL,
	CONSTRAINT "companies_meta_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"tax_number" varchar(13) NOT NULL,
	"zip" integer NOT NULL,
	"city" varchar(100) NOT NULL,
	"address" varchar(100) NOT NULL,
	"account_number" varchar(100),
	"account_provider" varchar(100),
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"logo" varchar(100) DEFAULT 'default' NOT NULL,
	"color" varchar(100),
	"monogram" varchar(3),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "user_to_company" (
	"userid" text NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_to_company_userid_company_id_pk" PRIMARY KEY("userid","company_id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar NOT NULL,
	"file" varchar(100) NOT NULL,
	"data" json NOT NULL,
	"size" integer NOT NULL,
	"state" varchar NOT NULL,
	"partner_id" uuid,
	"company_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_id_unique" UNIQUE("id"),
	CONSTRAINT "documents_name_unique" UNIQUE("name"),
	CONSTRAINT "documents_file_unique" UNIQUE("file")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"company_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"unit" varchar(50) NOT NULL,
	"vatkey" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"tax_number" varchar(50),
	"email" varchar(100) NOT NULL,
	"mobile" varchar(100),
	"zip" integer NOT NULL,
	"city" varchar(100) NOT NULL,
	"address" varchar(100) NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partners_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar(255) NOT NULL,
	"feat_id" varchar(255),
	"sub_id" uuid NOT NULL,
	"cs_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_id_unique" UNIQUE("id"),
	CONSTRAINT "subscriptions_customer_id_unique" UNIQUE("customer_id"),
	CONSTRAINT "subscriptions_sub_id_unique" UNIQUE("sub_id"),
	CONSTRAINT "subscriptions_cs_id_unique" UNIQUE("cs_id")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(100) NOT NULL,
	"company_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invites_id_unique" UNIQUE("id"),
	CONSTRAINT "invites_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"password" varchar(100) DEFAULT '' NOT NULL,
	"email" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"mobile" varchar(100) NOT NULL,
	"roles" json NOT NULL,
	"image" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "companies_meta" ADD CONSTRAINT "companies_meta_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_company" ADD CONSTRAINT "user_to_company_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_company" ADD CONSTRAINT "user_to_company_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_partner_id_companies_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_sub_id_companies_id_fk" FOREIGN KEY ("sub_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;