import { useState, useCallback } from "react";
import axios from "axios";

export default function useFetch() {
    const [loading, setLoading] = useState(false);
    const triggerFetch = useCallback(async (url, method = 'GET', requestData = null, headers = {}) => {
        setLoading(true);
        try {
            let response;
            const config = { headers };

            if (method === 'GET') {
                response = await axios.get(url, config);
            } else if (method === 'POST') {
                response = await axios.post(url, requestData, config);
            } else if (method === 'PUT') {
                response = await axios.put(url, requestData, config);
            } else if (method === 'DELETE') {
                response = await axios.delete(url, config);
            }

            return ({ data:response.data,status: response.status });
        } catch (err) {
            return({ data:err.response.data,status: err.response.status });
        } finally {
            setLoading(false);
        }
    }, []);

    return {loading, triggerFetch };
}
