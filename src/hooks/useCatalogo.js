import { useEffect, useState } from "react";
export default function useCatalogoData(page,price) {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchCatalagoData, setFetchCatalogoData] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState([]);
  useEffect(() => {
    const fetchCatalogo = async () => {
      setIsLoading(true);
      fetch(
        `https://modisteria-back-production.up.railway.app/api/catalogos/getAllCatalogo?page=${page}&price=${price}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchCatalogoData(data.rows)
          const number = Math.ceil(data.count/9)
          setNumberOfPages(Array(number).fill(null).map((_, index) => index + 1))
          
         })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    };
    window.scrollTo({ 
      top: 0,  
      behavior: 'smooth'
    }); 
    fetchCatalogo();
  }, [page,price]);
  return { fetchCatalagoData, isLoading,numberOfPages };
}