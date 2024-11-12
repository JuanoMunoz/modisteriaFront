import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useVentasData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
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
  const confirmarVenta = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/ventas/confirmarVenta`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllVentas,
    fetchAllVentas,
    confirmarVenta,
    loading,
  };
}
