import { useState, useEffect } from "react";
import axios from "axios";
export default function useActiveUserInfo(id,token) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    axios
      .get(
        `https://modisteria-back-production.up.railway.app/api/usuarios/getUserById/${id}`,{headers:{"x-token":token}}
      )
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

  return { userData,setUserData };
}