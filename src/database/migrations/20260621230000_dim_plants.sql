-- migrate:up
CREATE TABLE dim_plant_type (
    plant_type_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plant_type_name text NOT NULL UNIQUE CHECK (length(trim(plant_type_name)) > 0),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dim_plant (
    plant_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plant_type_id integer NOT NULL REFERENCES dim_plant_type (plant_type_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    plant_name text NOT NULL UNIQUE CHECK (length(trim(plant_name)) > 0),
    plant_id_parent integer REFERENCES dim_plant (plant_id) ON UPDATE CASCADE ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT dim_plant_parent_not_self CHECK (plant_id_parent IS NULL OR plant_id_parent <> plant_id)
);

CREATE INDEX dim_plant_plant_type_id_idx ON dim_plant (plant_type_id);
CREATE INDEX dim_plant_plant_id_parent_idx ON dim_plant (plant_id_parent);

CREATE TRIGGER set_dim_plant_type_updated_at
BEFORE UPDATE ON dim_plant_type
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_dim_plant_updated_at
BEFORE UPDATE ON dim_plant
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

INSERT INTO dim_plant_type (plant_type_name)
VALUES
    ('Рудник'),
    ('Шахта'),
    ('Обогатительная фабрика'),
    ('Медоплавильный завод');

-- migrate:down
DROP TRIGGER IF EXISTS set_dim_plant_updated_at ON dim_plant;
DROP TRIGGER IF EXISTS set_dim_plant_type_updated_at ON dim_plant_type;
DROP TABLE IF EXISTS dim_plant;
DROP TABLE IF EXISTS dim_plant_type;
