import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";

export default function useCitasData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllCitas = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/citas/getAllCitas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllCitas = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/citas/getAllCitas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const updateCita = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/citas/updateCita/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const createCita = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/citas/createCita`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const deleteCita = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/citas/deleteCita/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

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

  return {
    initialFetchAllCitas,
    fetchAllCitas,
    deleteCita,
    createCita,
    updateCita,
    fetchAllUsuarios,
    initialFetchAllUsuarios,
    loading,
  };
}
