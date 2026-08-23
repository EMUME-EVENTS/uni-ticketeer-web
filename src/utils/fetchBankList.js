import axios from "axios"
import { apiVersion, baseApiUrlTest } from "../config"

export default async function fetchBankList(){
    try{
        let response = await axios.get(`${baseApiUrlTest}${apiVersion}/paystack-banklist`)
        console.log("banklist", response)
        return response.data.data 
    }catch(err){
        console.log(err)
    }
}