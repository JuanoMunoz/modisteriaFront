import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useComprasData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllCompras = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/compras/getAllCompras",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllCompras = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/compras/getAllCompras",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateCompra = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/compras/updateUser/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createCompra = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/compras/createCompra`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteCompra = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/compras/deleteUser/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCompras,
    fetchAllCompras,
    deleteCompra,
    createCompra,
    updateCompra,
    loading,
  };
}
