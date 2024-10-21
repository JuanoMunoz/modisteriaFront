import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useCatalogoData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllCatalogos = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/catalogos/getAllCatalogo",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const initialFetchAllCatalogos = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/catalogos/getAllCatalogo",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  const updateCatalogos = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/catalogos/updateCatalogo/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const createCatalogo = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/catalogos/createCatalogo`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };
  const deleteCatalogo = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/catalogos/deleteCatalogo/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  return {
    initialFetchAllCatalogos,
    fetchAllCatalogos,
    deleteCatalogo,
    createCatalogo,
    updateCatalogos,
    loading,
  };
}
