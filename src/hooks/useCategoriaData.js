import useFetch from "./useFetch";
import { useJwt } from "../context/JWTContext";
export default function useCategoriaData() {
  const { loading: loadingCategoria, triggerFetch } = useFetch();
  const { token } = useJwt();
  const fetchAllCategorias = async () => {
    const respuesta = await triggerFetch(
      "https://modisteria-back-production.up.railway.app/api/categorias/getAllCategorias?type=insumo",
      "GET",
      null,
      { "x-token": token }
    );
    return respuesta;
  };
  return { fetchAllCategorias, loadingCategoria };
}
