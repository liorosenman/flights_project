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

# FOR THE END:
    1. Input validity methods
    2. Moving to serializer to shorten the code
    3. Divide the views into folders
    4. Authorization
    5. Logger for each execution of view
    5. More attractive login
    6. Is AirportUserManager neccessary?

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

# When removing a ticket:
    1. Check if the customer has a ticket to that flight.
    2. Check if the flight is active. Inactive flight means that all its tickets are inactive.
    TO BE TESTED (8/12/24).
    
