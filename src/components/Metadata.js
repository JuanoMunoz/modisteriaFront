import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Metadata({ title }) {
    const location = useLocation()
    console.log(location)
    useEffect(() => {
        document.title = title || 'Modistería Doña Luz'
    },[title])
    return null
}