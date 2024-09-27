import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import BarChart from "../../components/BarChart/BarChart";
import { useJwt } from "../../context/JWTContext";
import useFetch from "../../hooks/useFetch";

const Bar = () => {
    const { token } = useJwt();
    const { loading, triggerFetch } = useFetch();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await triggerFetch(
                    "https://modisteria-back-production.up.railway.app/api/insumos/getAllInsumos",
                    "GET",
                    null,
                    { "x-token": token }
                );

                if (response.status === 200 && response.data) {
                    setData(response.data);
                } else {
                    console.error("Error al obtener datos: ", response);
                }
            } catch (error) {
                console.error("Error al realizar la solicitud:", error);
            }
        };
        fetchData();
    }, [triggerFetch, token]);

    return (
        <Box m="20px">
            <Header title="Bar Chart" subtitle="Simple Bar Chart" />
            <Box height="75vh">
                {loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <BarChart data={data} />
                )}
            </Box>
        </Box>
    );
};

export default Bar;
