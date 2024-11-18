import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";

export default function useUnidadesMedida() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllUnidades = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/unidadesDeMedida/getAllUnidadDeMedidas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllUnidades = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/unidadesDeMedida/getAllUnidadDeMedidas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateUnidades = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/unidadesDeMedida/updateUnidadDeMedida/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createUnidades = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/unidadesDeMedida/createUnidadDeMedida`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteUnidades = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/unidadesDeMedida/deleteUnidadDeMedida/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllUnidades,
    createUnidades,
    fetchAllUnidades,
    updateUnidades,
    deleteUnidades,
    loading,
  };
}
