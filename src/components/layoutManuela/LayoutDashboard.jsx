import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { useState, useEffect } from "react";
import { useJwt } from "../../context/JWTContext";
import useDecodedJwt from "../../hooks/useJwt";
export default function LayoutDashboard() {
  const { token } = useJwt();
  console.log(token);
  const payload = useDecodedJwt(token);
  const navigete = useNavigate();
  console.log(payload);
  useEffect(() => {
    (!token || payload?.roleId !== 2) && navigete("/");
  }, []);

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet></Outlet>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
