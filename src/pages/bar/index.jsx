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
            <Header title="Grafica" subtitle="Insumos" />
            <Box height="75vh">
                {loading ? (
                <Box marginLeft={"160px"}>
                    <div class="wrapper">
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="shadow"></div>
                        <div class="shadow"></div>
                        <div class="shadow"></div>
                    </div>
                </Box>
                ) : (
                    <BarChart data={data} />
                )}
            </Box>
        </Box>
    );
};

export default Bar;
