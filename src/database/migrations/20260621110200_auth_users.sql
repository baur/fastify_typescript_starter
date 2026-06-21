-- migrate:up
CREATE TABLE auth_users (
    id serial PRIMARY KEY,
    email varchar(100) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    email_verified boolean NOT NULL DEFAULT false,
    role user_role NOT NULL DEFAULT 'customer',
    is_banned boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS auth_users;
