# Building the DB:
    ## In order: UserRole, AirportUser, Customer, Admin, Country, Airline, Flight, Ticket - DONE
    ## Finish with unique|status|BigInt (Only tickets) - DONE
    ## Understand and finish with the "related_name"

# Building create methods, all based on AirportUser: (15.11.24)
    ## AirportUser - Working followed by Admin creation.
    ## Admin - Creation working.
    ## Create first admin "manually" -DONE-
    ## Permission for admin-only method
    ## Customer
    ## Airline

# Front-end components:
    1. Login page
        a. Wrong credentials --- error message.
        b. Valid credentials --- customer,airline to flights page, admin to users page.
        c. Link to register as a customer.
    2. Flights page for customer, and airline.
        --- For customer --- Details and BUY button, once clicked - the flight will be filled with distinct color,
            and the button will turn to CANCEL button.
        --- For airline --- Details and UPDATE-REMOVE buttons. 
            UPDATE will open calendar for changing the departure time, including a cancel button, closing the board.
            REMOVE will remove the flight form the board, if it answers the conditions for it.
        --- Errors will be addressed.
    3. Tickets page for customer, and airline.
    4. For admin --- Additional forms for registering as admin, customer, airline:
        --- Table of users, select between the three what to show.
        --- Forms of signing-up, select user with select-list\radio buttons.

# Validate creation details for AirportUser, admin, customer and airline
    ## Customer can be created by admin and an anonymous user.
    ## Admin and airline can be created by admin alone.

# ------------16/11/2024------------------------
# No CSRF token, abortion. (16.11.24)
    ## An endpoint's decorator was changed from @action to @api_view
    ## from rest_framework.response import Response
       from rest_framework import status
    ## utils.create_default_airport_user was edited to return a Response and in the view to accept it.

# ------------17/11/2024------------------------
# Build the 3 constant rows of UserRole: admin, customer and airline. -DONE-

# When makemigrations - "it is impossible to add a non-nullable field..." - SOLVED - base table
# and its "son" must be created together.

# ------------19/11/2024------------------------
# AirportUser table - 'role_name' has to be an Integer 1-3. --- Meanwhile seems working.
## Creation method of AirportUser.
    ## Admin creation view. -DONE-

# ------------22/11/2024------------------------
    ## Error when executing every api_view: Foreign key is violated / Integrity error.
       

# ------------23/11/2024------------------------
    ## role_name should have been represnted as an integer and not by the title (as a foreign key). - DONE
    ## Creation, login, and logout of an admin works. - DONE
    ## Creation, login, and logout of a customer works. - DONE

# ------------25/11/2024------------------------
    ## Create, read and retrieve for Country - DONE
    ## Filling the countries table instances. - DONE
    ## Filling the airlines table instances.

# ------------26/11/2024------------------------
    ## Create, read and retrieve for airline - DONE

# ------------27/11/2024------------------------
    ## Flight - First object was created, but with is_active = F, although set for default T. - Solved
    ## Following flights are with is_active = F, as well. - Solved

# ------------28/11/2024------------------------
    ## DB connected with Postgres and pgadmin using docker containers.

# ------------08/12/2024------------------------
    ## To create Ticket serializer.
    ## To continue with get_my_tickets

# ------------09/12/2024------------------------   
    ## Creating all serializers.
    ## Creating viewsets:
        Flight
        Airline
        Customer
        Administrator
        User
        Country
        
# ------------10/12/2024-------------------------
    ## Admin and customer are created through the view set in customized create func. //DONE
    ## The same should be done with airline.
    ## The func can be shortened by decorator - @create_airport_user in the utils.py.
       When the airport_user is created, it can be called as the last one to proceed.

# ------------16/12/2024-------------------------
    ## remove_airline should be tested.
    ## remove_airline should be tested.

# ------------20/12/2024-------------------------
    ## Working on update_flight - done
    ## Working on get_flights_by_airline - done
    ## Working on get_tickets_by_customer - done

# ------------21/12/2024-------------------------
    ## Working on get_flights_by_parameters

# ------------25/12/2024-------------------------
    ## Permission method was created for authorization of admin, customer and airline.

# ------------25/12/2024-------------------------
    ## Modification in add_ticket method --- exclude inactive flight.
    ## Decorators --- Adding method "deactivate flights"

# ------------31/12/2024-------------------------
    # Customized logger produces the logs in another file.

# ------------02/02/2024-------------------------
    # Country facade should be deleted
    # Clear --- make aware function
    # get_my_flights --- revised (not tested).
    # get_flight_by_parameters --- revised (not tested).
    # remove_ticket addressed again.
    # get_my_tickets --- to be shortened.

# ------------03/02/2024-------------------------
    # Move all remove methods to administator view
    # 

# ------------11/02/2024-------------------------
    # Create a flight --- Flight's airline id is the logged in airline id
    #Input validation method for creating an airport_user

# ------------16/02/2024-------------------------
    # get_arrival_flights_by_country --- Present countries that have at least one active ticket.
    
# ------------21/02/2025-------------------------
    # Changes:
        ## 1. get_all_flights -> Show every flight, no filtering.
              No rows --> different msg.
        ## 2. get_flight_by_id -> Show every flight, no filtering.
        ## 3. get_flights_by_airline -> Show every flight, no filtering.
              No rows --> different msg.
        ## 4. remove_airline --> New logic in the method, using sql
        
# ------------22/02/2025-------------------------
    1. Changes regarding flight status filed.
     ## Conditions for booking a flight.
     ## Customer - add_flight --- status = 'active' should be default.
    Scanning methods that should be updated by flights_update
    2. Changes of init.sql , status field of flight and ticket. (status 
    
# ------------23/02/2025-------------------------
    1. Changing get_all_airlines --- no serializer.
    2. Tests on views.py api points //DONE
        get_flights_by_airline_id --- adding flight id to the querty fields. //DONE
    3. Setting the timezone in postgres.

# ------------24/02/2025-------------------------
    1. Input validity methods, for airportuser and airline.

# ------------26/02/2025-------------------------
    1. Time & Date formats unification.

# ------------17/03/2025-------------------------
    1. Input validity for flight creation - TESTED

# ------------18/03/2025-------------------------
    1. Modify Ticket model - customer_id from OnetoOne to Foreign_key
    2. Deletion of is_active property in Ticket table.
    3. a. Update_flight_status time format changed to timezone.now()
       b. Fixed Time zones formats in the conditions of the flight (flight.landing_time.astimezone(pytz.UTC)).
       c. Active flight with one active ticket changed to 'Took-off' - TESTED
# ------------18/03/2025-------------------------
    1. Modify Ticket model - flight_id from OnetoOne to Foreign_key
# ------------19/03/2025-------------------------
    Tasks:
        a. Creation of an object should return the details of the object. //Only Ticket
        b. Update methods that are influenced by changing flight\ticket is_active to status. -- including tickets // DONE
        c. Update customer --- as creating customer. --- using decorator // DONE
            1. Add new flight - DONE & TESTED
            2. Update Flight - DONE (Within the function)
        d. Check methods that use serializer:
            1. get_airline_by_id --- maybe add an email. //DONE
            2. arrival_flights --- condition - flight is not canceled. //DONE
            3. departure_flights --- condition - flight is not canceled. //DONE
            4. remove_airline --- rewrite (unupdated with is_active to status). // DONE
            5. Customer sign-up --- address can have spaces. //DONE
        e1. Loggers.
        e2. Comments.
        f. Display fields, not ids --- when creating a flight, id is presented //DONE
        g. Adding status to response. //DONE
        h. Get flights py parameters - only date, no hours //DONE
        i. Remove users --- Check again. //DONE
        j. The definition of constant information like roles and countries. //DONE
        k. Add update_flights_status to every relevant method. //DONE
        l. Create a user, role_id --- number or string. //DONE
        m. Doesn't allow a inactive user to login. //DONE

# ------------20/03/2025-------------------------
    1. "flight_details_input_validation" decorator is revised.
    2. All decorators --- Status was added to each Response.
# ------------21/03/2025-------------------------
    1. get_flights_by_airline_id --- Add status to results.
    2. airline --- remove_flight --- 'landed' flight cannot be removed as well.
    3. TASK --- What flights can be removed?
    4. 
# ------------23/03/2025------------------------- 
    1. TEST - from 19.3 --- section d
# ------------24/03/2025------------------------- 
    1. I changed role_required(role_id) by enum
    2. TASK --- Inactive user cannot sign in.
    3. TASK --- get_methods -- include status.
    4. TASK --- AirportUser model --- remove 'default=2'
# ------------26/03/2025------------------------- 
    1. Logger was set successfully.
# ------------27/03/2025------------------------- 
    1. React initialization:
        a. Models created.
# ------------31/03/2025------------------------- 
    1. Front --- Login --- Needs navigation to the right page. (Admin, customer, airline)
# ------------01/04/2025------------------------- 
    1. Front --- get_flights component
# ------------03/04/2025------------------------
    1. User login, continue from the slicer row 28 (('error' in result)) --- maybe decode will work.
# ------------07/04/2025------------------------
    1. Login page --- Admin, customer and airline are directed to a specific page.
# ------------09/04/2025------------------------
    1. Customer register //DONE & TESTED
    2. Airline register to be finished.
# ------------13/04/2025------------------------
    1. Customer register & errors // DONE & TESTED
    2. Airline register & errors // DONE& TESTED
    3. Admin register $ errors // DONE & TESTED
# ------------28/04/2025------------------------
    1. get_flight_by_id --- Successful return will send flight only, no message. (views.py)

# FOR THE END:
    *** Admin creation - try to avoid try-catch 
    *** Prime admin
    *** First and last names can be inherited. // SKIPPED
    *** Same time format. //SKIPPED
    *** Finish the time zone problem. //DONE --- Both postgres and django were set to UTC timezone.s
    *** Creation of an object should return the details of the object.
    *** A "tookoff" flight with no active tickets will be considered as canceled. //DONE & TESTED
    *** Update methods that are influenced by changing flight\ticket is_active to status. -- including tickets
    1. Input validity methods //DONE & TESTED
    2. Moving to serializer to shorten the code
    3. Divide the views into folders //DONE
    4. Authorization //DONE
    4a. Customer is permitted to perform actions only his //DONE & TESTED
    4b. Airline is permitted to perform actions only his //DONE & TESTED
    5. Logger for each execution of view
    5. More attractive login
    6. Is AirportUserManager neccessary? // DONE
    8. kwargs - desposible? // DONE
    9. get_my_tickets --- redesign // DONE
    10. Conditions for buying a ticket --- checking again if flight is active is unneccessary. //DONE
    11. get_all_flights //DONE
    12. Stored procedures --- //DONE 
    13. Display fields, not ids --- when creating a flight, id is presented
    14. Remove ticket --- If the flight is full, is_active doesn't change //DONE
    15. Automatic deactivation of a flight. //DONE & TESTED
    15. Status of a response. //DONE
    16. get_flights_by_parameters --- Only date, without hour
    17. Remove users --- Check again
    18. Creation of the countries with a file. // DONE

    
# When buying a ticket to a flight (Country and UserRoles exist): *6.12.24
    1. Create administator // DONE
    2. Create airline //DONE
    3. Create Flight //DONE
    4. Create customer //DONE
    5. Buying a ticket:
        a. Check if the customer is active //DONE
        a. Check if the flight is active //DONE
        b. Check the number of avaiable tickets //DONE
        e. Check that the same user has already a ticket for this flight. //DONE
    6. Reduce 1 from the relevant flight's tickets number.
    7. Create a new row in Tickets.
    8. Return the role authorization to view points.

# When removing a ticket:
    1. Check if the customer has a ticket to that flight.
    2. Check if the flight is active. Inactive flight means that all its tickets are inactive.
    TO BE TESTED (8/12/24).

# A clearer sign-up method
    ## In each role - create first the airportuser instance.
## Unsuccessful sign-up should erase the airport_user too.

# BUGS:
    1. get_customer_by_username // structure of query does not match function result // FIXED
    2. get_airline_by_username --- structure of query does not match function result

# ADDITIONS:
    1. In create a ticket - check if tickets left. // DONE
    2. Create Countries --> User_roles --> airportuser //DONE
    3. Automatic modification of activity of a flight that took off: (There are more) //DONE
        a. Add a ticket
        b. get all flights
        c. get flights by id
        d. get my flights 
        e. update flight
    4. get-delete-put = Add ID as a seperate argument. //DONE
    4. Login method should consider activity/inactivity.
    5. In get methods - Showing name and not id. //DONE
    6. Decorators //DONE
    7. Exclude inactive flights in the stored procedures.
    8. get_user_by_username --- Show everything except for the password
    9. Don't allow one user to use method on an object that belongs to another user. //DONE
    10. Adjust id to name in GET methods. //DONE

# Facade Base:
    1. get_all_flights()
    2. get_flight_by_id(id)
    3. get_flights_by_parameters() //DONE
    4. get_all_airlines() //DONE
    5. get_airline_by_id(id) // DONE
    6. get_airline_by_parameters()
    7. get_all_contries() // DONE
    8. get_country_by_id(id) // DONE
    9. create_new_user() // DONE

# Customer facade:
    1. update_customer(customer) // DONE
    2. add_ticket(ticket) // DONE
    3. remove_ticket(ticket) //DONE --- Check if ticket is already inactive.
    4. get_my_tickets() //DONE 

# Airline Facade:
    1. update_airline(airline) // NO SIGNIFICANCE
    2. add_flight(flight) // DONE & TESTED
    3. update_flight(flight) // DONE & TESTED
    4. remove_flight(flight) // DONE & TESTED
    5. get_my_flights() // DONE & TESTED

# Anonymous facade:
    1. login(username, password) // DONE
    2. add_customer() //DONE

# Administrator facade:
    1. get_all_customers()
    2. add_airline() // DONE
    3. add_customer() // DONE
    4. add Administrator() // DONE
    5. remove_airline(airline) // DONE & TESTED --- All of its flights and tickets should be deactivated.
    6. remove_customer(customer) //DONE
    7. remove_administrator(administator)//DONE

# Stored procedures:
    1. get_airline_by_username (username) // DONE
    2. get_customer_by_username (username) // BUG
    3. get_user_by_username (username) //DONE
    4. get_flight_by_parameters (origin, dest, date) //DONE
    5. get_flights_by_airline_id (airline_id bigint) //DONE
    6. get_arrival_flights (country_id) //DONE & TESTED
    7. get_deparure_flights (country_id) //DONE

# Input validity for methods:
    1. Create new airport user. //DONE & TESTED
    2. Create new administator. //DONE & TESTED
    3. Create new customer. //DONE & TESTED
    4. Create new airline. //DONE & TESTED
    5. Update customer --- as creating customer. --- using decorator
    6. Add new flight //DONE & TESTED
    7. Update Flight //DONE

# Methods to assure every user is authorized to modify his objects alone
    1. update_customer //DONE & TESTED
    2. remove_ticket //DONE & TESTED
    3. get_my_tickets //DONE & TESTED    
    4. update_airline // X
    5. Update-flight //DONE & TESTED
    6. remove_flight //DONE & TESTED
    7. get_my_flights//DONE & TESTED

# Presentation of data, showing names and not ids

# Automatic deactivation of a flight // DONE
    1. get_all_flights() // DONE & TESTED
    2. get_flight_by_id() // DONE & TESTED
    3. get_flights_by_airline_id() // DONE & TESTED
    4. get_flight_by_parameters() // DONE & TESTED
    5. get_arrival_flights() //
    6. get_deparure_flights()
    5. ---GET_COUNTRIES

# Automatic decativation of all flights: //DONE
    1. get_all_flights()
    2. get_flights_by_parameters()
    3. get_my_flights()

# Automatic deactivation of a single flight: //DONE
    1. get_flight_by_id()
    2. add_ticket()
    3. remove_ticket()
    4. get_my_tickets()
    5. update_flight()

# Add status in get methods:
    1. 

# Creation of objects - Datails of the new objects are returned in response: //NOT NEEDED
    1. Flight - // DONE
    2. Ticket - 
    3. Airline // NO NEED
    4. Customer - // NO NEED
    5. AirportUser -// NOT AN END POINT
    6. Admin - // NO NEED

# Changing is_active to status will influence: //DONE 
    1. VIEWS // NO CHANGES NEEDED
    2. CUSTOMER // DONE
    3. ADMINISTRATOR // DONE
    4. AIRLINE // DONE







