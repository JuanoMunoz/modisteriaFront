import { Outlet } from "react-router-dom"
export default function LayoutDashboard() {
    return(
        <>
            <nav> Hacer aquí el navbar</nav>
            <nav>Hacer aquí el sidebar</nav>
            {/* No borre el outlet */}
            <Outlet></Outlet> 
        </>
    )
}