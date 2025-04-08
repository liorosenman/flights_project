import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

const customerSignUpService = async (customerData) => {
    try{
        const response =  await axios.post(SERVER + 'create_new_customer/', customerData);
        return response.data;
}  catch (error) {
    return error}
}
export default customerSignUpService;