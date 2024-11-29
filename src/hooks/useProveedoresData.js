import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useProveedoresData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllProveedores = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/proveedores/getAllProveedores",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllProveedores = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/proveedores/getAllProveedores",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateProveedores = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/proveedores/updateProveedor/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createProveedores = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/proveedores/createProveedor`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteProveedores = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/proveedores/deleteProveedor/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllProveedores,
    fetchAllProveedores,
    deleteProveedores,
    createProveedores,
    updateProveedores,
    loading,
  };
}
