-- migrate:up
INSERT INTO dim_plant_type (plant_type_name)
VALUES
    ('Рудник'),
    ('Шахта'),
    ('Обогатительная фабрика'),
    ('Медоплавильный завод');

-- migrate:down
DELETE FROM dim_plant_type
WHERE plant_type_name IN (
    'Рудник',
    'Шахта',
    'Обогатительная фабрика',
    'Медоплавильный завод'
);
