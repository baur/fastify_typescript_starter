-- migrate:up
CREATE TRIGGER set_auth_users_updated_at
BEFORE UPDATE ON auth_users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

-- migrate:down
DROP TRIGGER IF EXISTS set_auth_users_updated_at ON auth_users;
