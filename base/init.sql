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
    phone_number INTEGER,
    credit_card BIGINT,
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id::BIGINT AS ID,
        c.first_name::TEXT AS first_name,
        c.last_name::TEXT AS last_name,
        c.address::TEXT AS address,
        c.phone_no::INTEGER AS phone_number,
        c.credit_card_no::BIGINT AS credit_card,
        u.username::TEXT AS username
    FROM
        base_customer AS c
    JOIN
        base_airportuser AS u
    ON
        c.airport_user_id = u.id
    WHERE
        u.username = input_username;
END;
$$ LANGUAGE plpgsql;




-- ####################################################################################
CREATE OR REPLACE FUNCTION get_active_tickets_of_an_airline(id BIGINT)
RETURNS TABLE (
ticket_id BIGINT,
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id AS ticket_id
    FROM
        ticket





-- ####################################################################################
CREATE OR REPLACE FUNCTION get_flights_by_airline_id(airline_id BIGINT)
RETURNS TABLE (
airline_name TEXT,
origin_country_name TEXT,
destination_country_name TEXT,
departure_time TIMESTAMP,
landing_time TIMESTAMP,
remaining_tickets INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    a.name::TEXT AS airline_name,
    co.name::TEXT AS origin_country_name,
    cd.name::TEXT AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets

    FROM base_flight AS f
    JOIN base_country AS co
    ON f.origin_country_id_id = co.id
    JOIN base_country AS cd
    ON f.destination_country_id_id = cd.id
    JOIN base_airline AS a
    ON f.airline_company_id = a.id
    WHERE f.airline_company_id_id = airline_id

END;
$$ LANGUAGE plpgsql;
-- ####################################################################################
CREATE OR REPLACE FUNCTION get_tickets_by_customer_id(customer_id BIGINT)
RETURNS TABLE (
ticket_id BIGINT,
flight_id BIGINT,
origin_country TEXT,
destination_country TEXT,
departure_time TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
    t.id::BIGINT AS ticket_id,
    f.id::BIGINT AS flight_id,
    co.name::TEXT AS origin_country,
    cd.name::TEXT AS destination_country,
    f.departure_time::TIMESTAMP as departure_time
    FROM base_ticket AS t    
    JOIN base_flight AS f ON t.flight_id_id = f.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE t.customer_id_id = customer_id;
END;
$$ LANGUAGE plpgsql;


-- ####################################################################################
CREATE OR REPLACE FUNCTION get_flights_by_parameters(
    origin_country INT,
    destination_country INT,
    departure TIMESTAMP
)
RETURNS TABLE (
    flight_id BIGINT,
    airline_company_name TEXT,
    origin_country_name TEXT,
    destination_country_name TEXT,
    landing_time TIMESTAMP,
    departure_time TIMESTAMP,
    remaining_tickets INT,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id::BIGINT AS flight_id,
        a.name::TEXT AS airline_company_name,
        co.name::TEXT AS origin_country_name,
        cd.name::TEXT AS destination_country_name,
        f.landing_time::TIMESTAMP AS landing_time,
        f.departure_time::TIMESTAMP AS departure_time,
        f.remaining_tickets::INT AS remaining_tickets,
        f.is_active::BOOLEAN AS is_active
    FROM
        base_flight AS f
    JOIN
        base_airline AS a ON f.airline_company_id_id = a.id
    JOIN
        base_country AS co ON f.origin_country_id_id = co.id
    JOIN
        base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE
        f.origin_country_id_id = origin_country
        AND f.destination_country_id_id = destination_country
        AND DATE(f.departure_time) = DATE(departure);
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
