CREATE TRIGGER track_document_upload_size
AFTER INSERT OR DELETE ON documents
FOR EACH ROW EXECUTE FUNCTION update_used_space();

CREATE TRIGGER track_invoice_upload_size
AFTER INSERT OR DELETE ON invoices
FOR EACH ROW EXECUTE FUNCTION update_used_space();