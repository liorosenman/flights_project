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

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_customer_by_username(input_username TEXT)
RETURNS TABLE (
ID BIGINT,
first_name TEXT,
last_name TEXT,
address TEXT,
phone_number BIGINT,
credit_card BIGINT
username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS ID::BIGINT,
        c.first_name::TEXT AS first_name,
        c.last_name::TEXT AS last_name,
        c.address::TEXT AS address,
        -- CAST(c.phone_no AS BIGINT) AS phone_number,
        -- CAST(c.credit_card_no AS BIGINT) AS credit_card
        c.phone_no::BIGINT AS phone_number,
        c.credit_card_no::BIGINT AS credit_card
        u.username
    FROM
        base_customer AS c JOIN base_airportuser AS u ON
        c.airport_user_id = u.id
    WHERE
        u.username = input_username;
END;
$$ LANGUAGE plpgsql;



-- ####################################################################################

CREATE OR REPLACE FUNCTION deactivate_expired_flights()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.departure_time <= CURRENT_TIMESTAMP THEN
        NEW.is_active = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS check_flight_status
BEFORE INSERT OR UPDATE ON flight
FOR EACH ROW
EXECUTE FUNCTION deactivate_expired_flights();
