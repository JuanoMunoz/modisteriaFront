import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function userolesData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllroles = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/roles/getAllRoles",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllroles = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/roles/getAllRoles",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updaterol = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/roles/updateRol/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createrol = async (infoUpdate) => {
    const respuesta = await createFetch(
      "https://modisteria-back-production.up.railway.app/api/roles/createRol",
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleterol = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/roles/deleteRol/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllroles,
    fetchAllroles,
    deleterol,
    createrol,
    updaterol,
    loading,
  };
}
