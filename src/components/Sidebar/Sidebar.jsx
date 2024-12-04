import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import maquinaCoser from "/maquina-coser.webp";

import {
  ShoppingCartOutlined,
  ViewListOutlined,
  AdminPanelSettingsOutlined,
  LockOutlined,
  Inventory2Outlined,
  StyleOutlined,
  CalendarTodayOutlined,
  InventoryOutlined,
  HelpOutlineOutlined,
  StraightenOutlined,
  HistoryOutlined,
  Settings,
  TableChart,
  BarChart,
  PointOfSale,
  Business,
  Paid,
} from "@mui/icons-material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ nombre }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "rgb(187, 14, 202) !important",
        },
        "& .pro-menu-item.active": {
          color: "rgb(187, 14, 202) !important",
          borderBottom: "0px solid rgb(187, 14, 202) ",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="end"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={maquinaCoser}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {nombre}
                </Typography>
                <Typography variant="h4" color={colors.purple[300]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Accordion
              sx={{ background: `${colors.primary[400]}`, border: "none" }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ArrowDropDownIcon />}
              >
                {isCollapsed ? (
                  <Settings></Settings>
                ) : (
                  <Item
                    title="Configuración"
                    icon={<Settings />}
                  ></Item>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Item
                  title="Usuarios"
                  to="/dashboard/contacts"
                  icon={<ContactsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Roles"
                  to="/dashboard/roles"
                  icon={<AdminPanelSettingsOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Permisos"
                  to="/dashboard/permisos"
                  icon={<LockOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ background: `${colors.primary[400]}`, border: "none" }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ArrowDropDownIcon />}
              >
                {isCollapsed ? (
                  <ShoppingCartOutlined />
                ) : (
                  <Item
                    title="Compra"
                    icon={<ShoppingCartOutlined/>}
                  ></Item>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Item
                  title="Insumos"
                  to="/dashboard/insumo"
                  icon={<InventoryOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Compras"
                  to="/dashboard/compras"
                  icon={<Paid />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Control Insumos"
                  to="/dashboard/controlInsumos"
                  icon={<HistoryOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Categoria Insumos"
                  to="/dashboard/categoriaInsumos"
                  icon={<Inventory2Outlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Proveedores"
                  to="/dashboard/proveedores"
                  icon={<Business />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ background: `${colors.primary[400]}`, border: "none" }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ArrowDropDownIcon />}
              >
                {isCollapsed ? (
                  <PointOfSale />
                ) : (
                  <Item
                    title="Venta"
                    icon={<PointOfSale/>}
                  ></Item>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Item
                  title="Ventas"
                  to="/dashboard/ventas"
                  icon={<ShoppingCartOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Citas"
                  to="/dashboard/cita"
                  icon={<CalendarTodayOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Productos"
                  to="/dashboard/catalogo"
                  icon={<ViewListOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Categoria Prendas"
                  to="/dashboard/categoriaPrenda"
                  icon={<StyleOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ background: `${colors.primary[400]}`, border: "none" }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ArrowDropDownIcon />}
              >
                {isCollapsed ? (
                  <TableChart />
                ) : (
                  <Item
                    title="Tablas referencia"
                    icon={<TableChart/>}
                  ></Item>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Item
                  title="Tallas"
                  to="/dashboard/tallas"
                  icon={<StraightenOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="prueba"
                  to="/dashboard/prueba"
                  icon={<StraightenOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Unidades de medida"
                  to="/dashboard/unidades-medida"
                  icon={<HelpOutlineOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                background: `${colors.primary[400]}`,
                border: "none",
              }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                expandIcon={<ArrowDropDownIcon />}
              >
                {isCollapsed ? (
                  <BarChart />
                ) : (
                  <Item
                    title="Graficas"
                    icon={<BarChart/>}
                  ></Item>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Item
                  title="Bar Chart"
                  to="/dashboard/bar"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Line Chart"
                  to="/dashboard/line"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
