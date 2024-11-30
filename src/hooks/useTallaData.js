import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useTallaData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllTallas = async () => {
    const respuesta = await getFetch(
      `https://modisteria-back-production.up.railway.app/api/tallas/getAllTallas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllTallas = async () => {
    const respuesta = await triggerFetch(
      `https://modisteria-back-production.up.railway.app/api/tallas/getAllTallas`,
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateTalla = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/tallas/updateTalla/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createTalla = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/tallas/createTalla`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteTalla = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/tallas/deleteTalla/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllTallas,
    fetchAllTallas,
    deleteTalla,
    createTalla,
    updateTalla,
    loading,
  };
}
