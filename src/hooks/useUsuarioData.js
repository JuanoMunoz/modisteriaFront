import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useUsuariosData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllUsuarios = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/usuarios/getAllUsers",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllUsuarios = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/usuarios/getAllUsers",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateUsuario = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/updateInsumo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createUsuario = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/createInsumo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteUsuario = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/insumos/deleteInsumo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllUsuarios,
    fetchAllUsuarios,
    // deleteInsumo,
    // createInsumo,
    // updateInsumos,
    loading,
  };
}
