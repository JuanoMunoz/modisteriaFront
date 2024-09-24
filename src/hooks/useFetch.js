import { useState, useCallback } from "react";
import axios from "axios";

export default function useFetch() {
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const triggerFetch = useCallback(async (url, method = 'GET', requestData = null, headers = {}) => {
        setLoading(true);
        setError(null);

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

            setResponseData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data: responseData, loading, error, triggerFetch };
}
