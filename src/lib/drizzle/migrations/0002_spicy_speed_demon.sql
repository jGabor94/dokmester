ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_sub_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "sub_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "sub_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "company_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;