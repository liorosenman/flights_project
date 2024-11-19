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
    ## Customer can be created by everyone
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


