import toast from "react-hot-toast";
import {apiConnector} from "../apiconnector"

const { catalogData } = require("../apis");

const {
    CATALOGPAGEDATA_API
} = catalogData

export async function catalogPage (categoryId) {
    let result = null;
    const toastId = toast.loading("Loading..");
    try{
        let response = await apiConnector("POST",CATALOGPAGEDATA_API,{categoryId : categoryId})

        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Catagory page data.")
        }
        result = response?.data

    }catch(error){
        console.log("CATALOGPAGEDATA_API API ERROR............", error)
        toast.error(error.message)
        result = error.response?.data
    }
    toast.dismiss(toastId)
    return result
}