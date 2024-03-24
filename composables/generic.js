import {getApiResponse, MethodType, specificApiResponse,nuxtResponse} from "@/utils/axiosFunctions";
import commonCode from "~/composables/common";


export default function genericFeatures() {
    const
        { Toast } = commonCode()

    const showGenericListing = async (url = '', queryParams = {}) => {
        if (url) {
            try {
                return await getApiResponse(url, true, MethodType.get,{} ,queryParams)
            } catch (e) {
                console.log(e)
            }
        }
        else
            Toast.fire({ icon: 'error', title: 'Url is missing' })

    }
    const showSpecificGenericListing = async (url = '', queryParams = {}) => {
        if (url) {
            try {
                return await specificApiResponse(url, true, MethodType.get,{} ,queryParams)
            } catch (e) {
                console.log(e)
            }
        }
        else
            Toast.fire({ icon: 'error', title: 'Url is missing' })

    }

    const fetchListing =async (url='',queryParams={},isGeneric=false) =>{
        if (url) {
            try {
             
                return await nuxtResponse(url, true, MethodType.get ,queryParams,[],isGeneric)
            } catch (e) {
                console.log(e)
            }
        }
        else
            Toast.fire({ icon: 'error', title: 'Url is missing' })
    }

    return {
        showGenericListing,
        showSpecificGenericListing,
        fetchListing
    }
}