import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useInsumosData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllInsumos = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/insumos/getAllInsumos",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllInsumos = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/insumos/getAllInsumos",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateInsumos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/updateInsumo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createInsumo = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/createInsumo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteInsumo = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/deleteInsumo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllInsumos,
    fetchAllInsumos,
    deleteInsumo,
    createInsumo,
    updateInsumos,
    loading,
  };
}
