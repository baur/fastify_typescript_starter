-- migrate:up
CREATE TABLE dim_plant_type (
    plant_type_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plant_type_name text NOT NULL UNIQUE CHECK (length(trim(plant_type_name)) > 0),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_dim_plant_type_updated_at
BEFORE UPDATE ON dim_plant_type
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

-- migrate:down
DROP TRIGGER IF EXISTS set_dim_plant_type_updated_at ON dim_plant_type;
DROP TABLE IF EXISTS dim_plant_type;
