import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";

export default function useCategoriaData() {
  const { loading, triggerFetch } = useFetch();
  const { triggerFetch: updateFetch } = useFetch();
  const { triggerFetch: createFetch } = useFetch();
  const { triggerFetch: getFetch } = useFetch();
  const { triggerFetch: deleteFetch } = useFetch();
  const { token } = useJwt();

  const fetchAllCategorias = async () => {
    const respuesta = await getFetch(
      "https://modisteria-back-production.up.railway.app/api/categoriaprendas/getAllCategoriaPrendas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const initialFetchAllCategorias = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/categoriaprendas/getAllCategoriaPrendas",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };

  const updateCategoria = async (id, infoUpdate) => {
    const respuesta = await updateFetch(
      `https://modisteria-back-production.up.railway.app/api/categoriaprendas/updateCategoriaPrenda/${id}`,
      "PUT",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const createCategoria = async (infoUpdate) => {
    const respuesta = await createFetch(
      `https://modisteria-back-production.up.railway.app/api/categoriaprendas/createCategoriaPrenda`,
      "POST",
      infoUpdate,
      { "x-token": token }
    );
    return respuesta;
  };

  const deleteCategoria = async (id) => {
    const respuesta = await deleteFetch(
      `https://modisteria-back-production.up.railway.app/api/categoriaprendas/deleteCategoriaPrenda/${id}`,
      "DELETE",
      null,
      { "x-token": token }
    );
    return respuesta;
  };


  return {
    initialFetchAllCategorias,
    fetchAllCategorias,
    deleteCategoria,
    createCategoria,
    updateCategoria,
    loading,
  };
}
