import axios from "axios";
import airportUser from "../../models"

export const loginrequest = async(username : string, password:string): Promise<Product> => {
    await axios.put<Product>(`${SERVER}/${id}/`, updatedprod);
    return updatedprod