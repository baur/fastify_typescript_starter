-- migrate:up
CREATE TABLE cache (
    key varchar(255) PRIMARY KEY,
    value jsonb NOT NULL,
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE IF EXISTS cache;
