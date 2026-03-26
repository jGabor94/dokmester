ALTER TABLE "companies" ADD COLUMN "group_member_tax_number" varchar(13);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "unit_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "price";