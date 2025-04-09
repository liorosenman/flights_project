import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

export const customerSignUpService = async (customerData) => {
    return await axios.post(SERVER + 'create_new_customer/', customerData);
}

export const airlineSignupService = async (airlineData) => {
    return await axios.post(SERVER + 'create_new_airline/', airlineData);
}


