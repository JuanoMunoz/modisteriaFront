import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h1>Area compartida</h1>
      <Outlet></Outlet>
    </>
  );
}
