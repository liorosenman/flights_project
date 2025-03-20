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
        a.id::BIGINT AS airline_id,
        a.name::TEXT AS airline_name,
        c.name::TEXT AS country_name,
        u.username::TEXT AS username
    FROM 
        base_airline AS a
    JOIN 
        base_country AS c ON a.country_id_id = c.id
    JOIN 
        base_airportuser AS u ON a.airport_user_id = u.id
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
    FROM base_customer AS c
    JOIN base_airportuser AS u
    ON c.airport_user_id = u.id
    WHERE u.username = input_username;
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
flight_id BIGINT,
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
    f.id::BIGINT AS flight_id,
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
    ON f.airline_company_id_id = a.id
    WHERE f.airline_company_id_id = airline_id;

END;
$$ LANGUAGE plpgsql;
-- ####################################################################################
CREATE OR REPLACE FUNCTION get_tickets_by_customer_id(customer_id BIGINT)
RETURNS TABLE (
ticket_id BIGINT,
flight_id BIGINT,
origin_country TEXT,
destination_country TEXT,
departure_time TIMESTAMP,
status TEXT,
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
    t.id::BIGINT AS ticket_id,
    f.id::BIGINT AS flight_id,
    co.name::TEXT AS origin_country,
    cd.name::TEXT AS destination_country,
    f.departure_time::TIMESTAMP as departure_time,
    t.status::TEXT AS ticket_status
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
    airline_name VARCHAR,
    origin_country_name VARCHAR,
    destination_country_name VARCHAR,
    departure_time TIMESTAMP,
    landing_time TIMESTAMP,
    remaining_tickets INTEGER,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id::BIGINT AS flight_id,
        a.name::VARCHAR AS airline_name,
        co.name::VARCHAR AS origin_country_name,
        cd.name::VARCHAR AS destination_country_name,
        f.departure_time::TIMESTAMP AS departure_time,
        f.landing_time::TIMESTAMP AS landing_time,
        f.remaining_tickets::INTEGER AS remaining_tickets,
        f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS a ON f.airline_company_id_id = a.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE
        f.origin_country_id_id = origin_country
        AND f.destination_country_id_id = destination_country
        AND DATE(f.departure_time) = DATE(departure);
END;
$$ LANGUAGE plpgsql;



-- ####################################################################################
CREATE OR REPLACE FUNCTION get_arrival_flights_by_country(country_id BIGINT)
RETURNS TABLE (
    flight_id BIGINT,
    airline_name VARCHAR,
    origin_country_name VARCHAR,
    destination_country_name VARCHAR,
    departure_time TIMESTAMP,
    landing_time TIMESTAMP,
    remaining_tickets INTEGER,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    f.id::BIGINT AS flight_id,
    a.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS a ON f.airline_company_id_id = a.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE f.destination_country_id_id = country_id
        AND f.landing_time BETWEEN NOW() AND NOW() + INTERVAL '12 hours';
END;
$$ LANGUAGE plpgsql;
-- ###################################################################################
CREATE OR REPLACE FUNCTION get_departure_flights_by_country(country_id BIGINT)
RETURNS TABLE (
    flight_id BIGINT,
    airline_name VARCHAR,
    origin_country_name VARCHAR,
    destination_country_name VARCHAR,
    departure_time TIMESTAMP,
    landing_time TIMESTAMP,
    remaining_tickets INTEGER,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    f.id::BIGINT AS flight_id,
    a.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS a ON f.airline_company_id_id = a.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE f.origin_country_id_id = country_id
        AND f.departure_time BETWEEN NOW() AND NOW() + INTERVAL '12 hours';
END;
$$ LANGUAGE plpgsql;
-- ####################################################################################
CREATE OR REPLACE FUNCTION get_user_by_username(input_username VARCHAR)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    password VARCHAR,
    email VARCHAR,
    role_name VARCHAR,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id AS ID,
        a.username AS username,
        a.password AS password,
        a.email AS email,
        r.role_name AS role_name,
        a.is_active AS is_active
    FROM base_airportuser AS a
    JOIN base_userrole as r ON a.role_name_id = r.id
    WHERE a.username = input_username;
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

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_all_flights()
RETURNS TABLE (
    flight_id BIGINT,
    airline_name VARCHAR,
    origin_country_name VARCHAR,
    destination_country_name VARCHAR,
    departure_time TIMESTAMP,
    landing_time TIMESTAMP,
    remaining_tickets INTEGER,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    f.id::BIGINT AS flight_id,
    a.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline as a ON f.airline_company_id_id = a.id
    JOIN base_country as co ON f.origin_country_id_id = co.id
    JOIN base_country as cd ON f.destination_country_id_id = cd.id;

    END;
$$ LANGUAGE plpgsql;

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_flights_by_airline_id(airline_id BIGINT)
RETURNS TABLE (
    flight_id BIGINT,
    airline_name VARCHAR,
    origin_country_name VARCHAR,
    destination_country_name VARCHAR,
    departure_time TIMESTAMP,
    landing_time TIMESTAMP,
    remaining_tickets INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    f.id::BIGINT AS flight_id,
    a.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.is_active::BOOLEAN AS is_active
    FROM base_flight AS f
    JOIN base_airline as a ON f.airline_company_id_id = a.id
    JOIN base_country as co ON f.origin_country_id_id = co.id
    JOIN base_country as cd ON f.destination_country_id_id = cd.id
    WHERE f.airline_company_id_id = airline_id

    END;
$$ LANGUAGE plpgsql;   

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_active_airline_tickets(airline_id BIGINT)
RETURNS TABLE(
ticket_id BIGINT

) AS $$
BEGIN
    RETURN QUERY
    SELECT
    t.id::BIGINT AS ticket_id
    FROM base_ticket as t
    JOIN base_flight as f ON t.flight_id_id = f.id
    JOIN base_airline as a ON f.airline_company_id_id = a.id
    WHERE a.id = airline_id AND (f.flight = 'tookoff' OR (f.status = 'active' AND t.status = 'active'));

    END;
$$ LANGUAGE plpgsql;   

-- ####################################################################################
-- Probably unneccessary
CREATE OR REPLACE FUNCTION get_active_customer_tickets(airline_id BIGINT)
RETURNS TABLE
ticket_id BIGINT

) AS $$
BEGIN
    RETURN QUERY
    SELECT
    t.id::BIGINT AS ticket_id
    FROM base_ticket as t
    JOIN base_flight as f ON t.flight_id_id = f.id
    JOIN base_airline as a ON f.airline_company_id_id = a.id
    WHERE a.id = airline_id AND (f.flight = 'tookoff' OR (f.status = 'active' AND t.status = 'active'))

    END;
$$ LANGUAGE plpgsql;   