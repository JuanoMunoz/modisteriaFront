import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function usePermisosData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllPermisos = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/permisos/getAllPermisos",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllPermisos = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/permisos/getAllPermisos",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updatePermisos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/permisos/updatePermiso/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deletePermisos = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/permisos/deletePermiso/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllPermisos,
    fetchAllPermisos,
    deletePermisos,
    updatePermisos,
    loading,
  };
}
