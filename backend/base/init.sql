CREATE OR REPLACE FUNCTION get_airline_data_by_username(input_username TEXT)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    name VARCHAR,
    country VARCHAR,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id::BIGINT AS id,
        au.username::VARCHAR AS username,
        al.name::VARCHAR AS name,
        c.name::VARCHAR AS country,
        au.email::VARCHAR AS email,
        au.id::BIGINT AS airport_id,
        au.is_active::BOOLEAN AS status
    FROM base_airline al
    JOIN base_airportuser au ON al.airport_user_id = au.id
    JOIN base_country c ON al.country_id_id = c.id
    WHERE au.username = input_username AND au.role_name_id = 3;
END;
$$ LANGUAGE plpgsql;

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_customer_data_by_username(input_username TEXT)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    address VARCHAR,
    phone_no INTEGER,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN 
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id::BIGINT AS CustomerID,
        u.username::VARCHAR AS username,
        c.first_name::VARCHAR AS first_name,
        c.last_name::VARCHAR AS last_name,
        c.address::VARCHAR AS address,
        c.phone_no::INTEGER AS phone_no,
        u.email::VARCHAR AS email,
        u.id::BIGINT AS airport_id,
        u.is_active::BOOLEAN AS status
    FROM base_customer AS c
    JOIN base_airportuser AS u ON c.airport_user_id = u.id
    WHERE u.username = input_username AND u.role_name_id = 2
END;
$$ LANGUAGE plpgsql;

--##########################################################################
CREATE OR REPLACE FUNCTION get_admin_data_by_username(input_username TEXT)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    airport_id BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id::BIGINT AS AdminID,
        u.username::VARCHAR AS username,
        al.first_name::VARCHAR AS first_name,
        al.last_name::VARCHAR AS last_name,
        u.email::VARCHAR AS email,
        u.id::BIGINT AS airport_id
    FROM base_admin AS al
    JOIN base_airportuser AS u ON al.airport_user_id = u.id
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
    al.name::TEXT AS airline_name,
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
    JOIN base_airline AS al
    ON f.airline_company_id_id = al.id
    WHERE f.airline_company_id_id = airline_id
    ORDER BY f.departure_time;
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
  ticket_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id::BIGINT AS ticket_id,
    f.id::BIGINT AS flight_id,
    co.name::TEXT AS origin_country,
    cd.name::TEXT AS destination_country,
    f.departure_time::TIMESTAMP AS departure_time,
    t.status::TEXT AS ticket_status
  FROM base_ticket AS t    
  JOIN base_flight AS f ON t.flight_id_id = f.id
  JOIN base_country AS co ON f.origin_country_id_id = co.id
  JOIN base_country AS cd ON f.destination_country_id_id = cd.id
  WHERE t.customer_id_id = customer_id
  ORDER BY f.departure_time;
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
        al.name::VARCHAR AS airline_name,
        co.name::VARCHAR AS origin_country_name,
        cd.name::VARCHAR AS destination_country_name,
        f.departure_time::TIMESTAMP AS departure_time,
        f.landing_time::TIMESTAMP AS landing_time,
        f.remaining_tickets::INTEGER AS remaining_tickets,
        f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS al ON f.airline_company_id_id = al.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE
        f.origin_country_id_id = origin_country
        AND f.destination_country_id_id = destination_country
        AND DATE(f.departure_time) = DATE(departure)
    ORDER BY f.departure_time;
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
    al.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS al ON f.airline_company_id_id = al.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE f.destination_country_id_id = country_id
        AND f.landing_time BETWEEN NOW() AND NOW() + INTERVAL '12 hours'
        AND f.status != 'canceled'
    ORDER BY f.departure_time;
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
    al.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline AS al ON f.airline_company_id_id = al.id
    JOIN base_country AS co ON f.origin_country_id_id = co.id
    JOIN base_country AS cd ON f.destination_country_id_id = cd.id
    WHERE f.origin_country_id_id = country_id
        AND f.departure_time BETWEEN NOW() AND NOW() + INTERVAL '12 hours'
        AND f.status != 'canceled'
    ORDER BY f.departure_time;
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
        al.id AS ID,
        al.username AS username,
        al.password AS password,
        al.email AS email,
        r.role_name AS role_name,
        al.is_active AS is_active
    FROM base_airportuser AS al
    JOIN base_userrole as r ON al.role_name_id = r.id
    WHERE al.username = input_username;
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
    al.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline as al ON f.airline_company_id_id = al.id
    JOIN base_country as co ON f.origin_country_id_id = co.id
    JOIN base_country as cd ON f.destination_country_id_id = cd.id
    ORDER BY f.departure_time;
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
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    f.id::BIGINT AS flight_id,
    al.name::VARCHAR AS airline_name,
    co.name::VARCHAR AS origin_country_name,
    cd.name::VARCHAR AS destination_country_name,
    f.departure_time::TIMESTAMP AS departure_time,
    f.landing_time::TIMESTAMP AS landing_time,
    f.remaining_tickets::INTEGER AS remaining_tickets,
    f.status::VARCHAR AS status
    FROM base_flight AS f
    JOIN base_airline as al ON f.airline_company_id_id = al.id
    JOIN base_country as co ON f.origin_country_id_id = co.id
    JOIN base_country as cd ON f.destination_country_id_id = cd.id
    WHERE f.airline_company_id_id = airline_id;

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
    JOIN base_airline as al ON f.airline_company_id_id = al.id
    WHERE al.id = airline_id AND (f.status = 'tookoff' OR (f.status = 'active' AND t.status = 'active'));

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
    JOIN base_airline as al ON f.airline_company_id_id = al.id
    WHERE al.id = airline_id AND (f.flight = 'tookoff' OR (f.status = 'active' AND t.status = 'active'))

    END;
$$ LANGUAGE plpgsql; 

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_customers_details()
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    address VARCHAR,
    phone_no INTEGER,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id::BIGINT AS CustomerID,
        u.username::VARCHAR AS username,
        c.first_name::VARCHAR AS first_name,
        c.last_name::VARCHAR AS last_name,
        c.address::VARCHAR AS address,
        c.phone_no::INTEGER AS phone_no,
        u.email::VARCHAR AS email,
        u.id::BIGINT AS airport_id,
        u.is_active::BOOLEAN AS status
    FROM base_customer AS c
    JOIN base_airportuser AS u ON c.airport_user_id = u.id;
END;
$$ LANGUAGE plpgsql;

-- ####################################################################################

CREATE OR REPLACE FUNCTION get_admins_details()
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id::BIGINT AS AdminID,
        u.username::VARCHAR AS username,
        al.first_name::VARCHAR AS first_name,
        al.last_name::VARCHAR AS last_name,
        u.email::VARCHAR AS email,
        u.id::BIGINT AS airport_id,
        u.is_active::BOOLEAN AS status
    FROM base_admin AS al
    JOIN base_airportuser AS u ON al.airport_user_id = u.id
    WHERE u.role_name_id = 1;
END;
$$ LANGUAGE plpgsql;

-- ################################################################

CREATE OR REPLACE FUNCTION get_airlines_details()
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    name VARCHAR,
    country VARCHAR,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id::BIGINT AS id,
        au.username::VARCHAR AS username,
        al.name::VARCHAR AS name,
        c.name::VARCHAR AS country,
        au.email::VARCHAR AS email,
        au.id::BIGINT AS airport_id,
        au.is_active AS status
    FROM base_airline al
    JOIN base_airportuser au ON al.airport_user_id = au.id
    JOIN base_country c ON al.country_id_id = c.id;
END;
$$ LANGUAGE plpgsql;

-- ############################################################


CREATE OR REPLACE FUNCTION get_admin_data_by_username(input_username TEXT)
RETURNS TABLE (
    id BIGINT,
    username VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    email VARCHAR,
    airport_id BIGINT,
    status BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id::BIGINT AS AdminID,
        u.username::VARCHAR AS username,
        al.first_name::VARCHAR AS first_name,
        al.last_name::VARCHAR AS last_name,
        u.email::VARCHAR AS email,
        u.id::BIGINT AS airport_id,
        U.is_active AS status
    FROM base_admin AS al
    JOIN base_airportuser AS u ON al.airport_user_id = u.id
    WHERE u.username = input_username AND u.role_name_id = 1;
END;
$$ LANGUAGE plpgsql;