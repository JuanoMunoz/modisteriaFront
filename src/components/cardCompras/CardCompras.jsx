import { Business, Inventory, ShoppingCart } from "@mui/icons-material";
import {
  formatDateSpanish,
  formaTime,
  formToCop,
} from "../../assets/constants.d";

export default function CardCompras({ compra }) {
  return (
    <article className="compra" key={compra.id}>
      <div className="icono-compra-container">
        <ShoppingCart className="icono-compra" />
      </div>
      <div className="card-header">
        {`${formatDateSpanish(compra.fecha)} ${formaTime(compra.fecha)}`}
      </div>
      <div className="card-body">
        <div className="insumos">
          <Inventory className="icono-body" />
          <span>
            {compra.cantidad}{" "}
            {compra.insumo.unidades_de_medida.nombre.toLowerCase()} de{" "}
            {compra.insumo.nombre.toLowerCase()}
          </span>
        </div>
        <span className="action-text">Proveedor</span>
        <div className="proveedor">
          <Business className="icono-body" />
          <span>{compra.proveedor.nombre}</span>
        </div>
        <div className="valor">
          <span>{formToCop(compra.valorTotal)}</span>
        </div>
      </div>
    </article>
  );
}
