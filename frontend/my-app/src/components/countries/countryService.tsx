// src/services/countryService.js
import axios from 'axios';

const SERVER = 'http://127.0.0.1:8000/';

export const getAllCountries = async () => {
    return await axios.post(SERVER + 'get_all_countries/');
}

