-- migrate:up
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager');

-- migrate:down
DROP TYPE IF EXISTS user_role;
