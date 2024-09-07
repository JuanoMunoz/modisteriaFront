import { useEffect, useState } from "react";
export default function useCatalogoData() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchCatalagoData, setFetchCatalogoData] = useState(null);
  useEffect(() => {
    const fetchCatalogo = async () => {
      setIsLoading(true);
      fetch(
        "https://modisteria-back-production.up.railway.app/api/catalogos/getAllCatalogo"
      )
        .then((res) => res.json())
        .then((data) => setFetchCatalogoData(data))
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    };
    fetchCatalogo();
  }, []);
  return { fetchCatalagoData, isLoading };
}