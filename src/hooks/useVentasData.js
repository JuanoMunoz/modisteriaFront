import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";

export default function useVentas() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllVentas = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/ventas/getAllVentas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllVentas = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/ventas/getAllVentas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const updateVentas = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/ventas/confirmarVenta/${id}`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  

  return {
    fetchAllVentas,
    updateVentas,
    initialFetchAllVentas,
    loading,
  };
}
