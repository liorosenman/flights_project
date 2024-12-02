CREATE OR REPLACE FUNCTION get_airline_data_by_username(input_username TEXT)
RETURNS TABLE (
    airline_id BIGINT,
    airline_name TEXT,
    country_name TEXT,
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id AS airline_id,
        a.name AS airline_name,
        c.name AS country_name,
        u.username
    FROM 
        airline AS a
    JOIN 
        country AS c ON a.country_id_id = c.id
    JOIN 
        airport_user AS u ON a.airport_user_id = u.id
    WHERE 
        u.username = input_username;
END;
$$ LANGUAGE plpgsql;
