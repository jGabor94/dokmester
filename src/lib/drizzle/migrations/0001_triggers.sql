-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION update_used_space()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE companies_meta
        SET used_space = COALESCE(used_space, 0) + NEW.size
        WHERE company_id = NEW.company_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE companies_meta 
        SET used_space = GREATEST(COALESCE(used_space, 0) - OLD.size, 0)
        WHERE company_id = OLD.company_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_upload_size
AFTER INSERT OR DELETE ON documents
FOR EACH ROW EXECUTE FUNCTION update_used_space();



CREATE OR REPLACE FUNCTION update_users_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE companies_meta
        SET users_number = COALESCE(users_number, 0) + 1
        WHERE company_id = company_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE companies_meta 
        SET users_number = GREATEST(COALESCE(users_number, 0) - 1, 0)
        WHERE company_id = company_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_users_count
AFTER INSERT OR DELETE ON user_to_company
FOR EACH ROW EXECUTE FUNCTION update_users_count();



CREATE OR REPLACE FUNCTION update_meta_year()
RETURNS TRIGGER AS $$
BEGIN
    NEW.year := EXTRACT(YEAR FROM NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meta_year
AFTER UPDATE ON companies_meta
FOR EACH ROW EXECUTE FUNCTION update_meta_year();



CREATE OR REPLACE FUNCTION update_invites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE companies_meta
        SET invites_number = COALESCE(invites_number, 0) + 1
        WHERE company_id = company_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE companies_meta
        SET invites_number = GREATEST(COALESCE(invites_number, 0) - 1, 0)
        WHERE company_id = company_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_invites_count
AFTER INSERT OR DELETE ON invites
FOR EACH ROW EXECUTE FUNCTION update_invites_count();