import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

const customerSignUpService = async (customerData) => {
    return await axios.post(SERVER + 'create_new_customer/', customerData);

//     try{
//         console.log("BBBBBBBBBBBBBBBBBBBBBBBBB");
//         const response =  await axios.post(SERVER + 'create_new_customer/', customerData);
//         return response.data;
// }  catch (error) {
//     console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCc");
//     console.log(error.message);
    
//     return error}
}
export default customerSignUpService;