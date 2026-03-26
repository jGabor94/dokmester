ALTER TABLE "documents" ADD COLUMN "transaction_id" varchar(100);--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_transaction_id_unique" UNIQUE("transaction_id");