import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "./pruebas.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  estadoCitasColores,
  messagesCalendar,
  toggleState,
} from "../../assets/constants.d";
import "dayjs/locale/es";
import Header from "../../components/Header/Header";
import {
  CalculateOutlined,
  CalendarTodayOutlined,
  Cancel,
  Edit,
  HelpOutline,
} from "@mui/icons-material";
import useCitasData from "../../hooks/useCitasData";
import LoadingTableData from "../../components/loadingTableData/LoadingTableData";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DialogTitleCustom from "../../components/dialogTitle/DialogTitleCustom";
import CustomDialogActions from "../../components/customDialogActions/CustomDialogActions";
import Transition from "../../components/transition/Transition";
import { AddRounded, Dots } from "../../components/svg/Svg";
import { useForm } from "react-hook-form";
import InputDash from "../../components/inputDashboard/InputDash";
import SelectDash from "../../components/selectDash/SelectDash";
import useUsuariosData from "../../hooks/useUsuarioData";
import useInsumosData from "../../hooks/useInsumosData";
dayjs.locale("es");
export default function Prueba() {
  const localizer = dayjsLocalizer(dayjs);
  const { initialFetchAllCitas, loading } = useCitasData();
  const { initialFetchAllUsuarios, loading: loadingUsuarios } =
    useUsuariosData();
  const { initialFetchAllInsumos, loading: loadingInsumos } = useInsumosData();
  const {
    register,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
    setValue,
    getValues,
  } = useForm();
  const [dialogProps, setDialogProps] = useState({
    action: "",
    title: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const findMaxQuantityInsumo = (id) => {
    const insumo = insumos.find((insumo) => insumo.id === id);
    return `${parseFloat(
      insumo?.cantidad
    )} ${insumo?.unidades_de_medida.nombre?.toLowerCase()}`;
  };
  const handleDialog = (action, title) => {
    setDialogProps({ action, title });
    reset({
      fecha: action === "add" ? "" : selectedEvent?.data?.fecha,
      objetivo: action === "add" ? "" : selectedEvent?.data?.objetivo,
      usuarioId:
        action === "add" ? users[0]?.id : selectedEvent?.data?.usuarioId,
      precio: action === "add" ? "" : selectedEvent?.data?.precio,
      horas:
        action === "add"
          ? 1
          : parseInt(selectedEvent?.data?.tiempo?.split(":")[0]) || 1,
      minutos:
        action === "add"
          ? ""
          : parseInt(selectedEvent?.data?.tiempo?.split(":")[1]) || 0,
    });
    toggleState(setOpenModal);
  };
  const handleAdd = () => {
    handleDialog("add", "Añadir Cita");
  };
  const handleEstimation = () => {
    handleDialog("estimation", "Cotización Cita");
  };
  const handleEdit = () => {
    handleDialog("edit", "Editar Cita");
  };
  const handleCancel = () => {
    handleDialog("cancel", "Cancelar Cita");
  };
  const handleInfo = () => {
    handleDialog("info", "Información Estados Citas");
  };
  const handlePreview = () => {
    handleDialog("preview", "Detalles de la Cita");
  };
  const [data, setData] = useState();
  const [events, setEvents] = useState();
  const [users, setUsers] = useState();
  const [insumos, setInsumos] = useState();
  const [numberOfInsumos, setNumberOfInsumos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleSelectEvent = (event, e) => {
    console.log(event);

    setSelectedEvent(event);
    setPosition({ x: e.clientX, y: e.clientY });
    setShowOptions(true);
  };
  useEffect(() => {
    const initialFetchInsumos = async () => {
      const respuesta = await initialFetchAllCitas();
      const usuarios = await initialFetchAllUsuarios();
      const insumos = await initialFetchAllInsumos();
      if (
        respuesta.status === 200 &&
        usuarios.status === 200 &&
        insumos.status === 200
      ) {
        setData(respuesta.data);
        setUsers(usuarios.data);
        setInsumos(insumos.data);

        const events = respuesta.data.map((cita) => {
          const fechaInicial = dayjs(`${cita.fecha.slice(0, -1)}`);
          let fechaFinal = fechaInicial;
          if (cita.estadoId != 9 && cita.estadoId != 12) {
            const [horas, minutos, _] = cita.tiempo.split(":").map(Number);
            fechaFinal = fechaInicial
              .add(horas, "hours")
              .add(minutos, "minutes");
          }
          return {
            title: `${cita.usuario.nombre}`,
            start: fechaInicial.toDate(),
            end: fechaFinal.toDate(),
            data: cita,
          };
        });
        setEvents(events);
      }
    };
    initialFetchInsumos();
  }, []);
  const handleAddInsumo = () => {
    if (numberOfInsumos.length >= insumos?.length)
      return toast.error("¡Ya has agregado todos tus insumos!", {
        toastId: "errorAllInsumos",
        autoClose: 1500,
      });
    setValue(
      `insumo[${numberOfInsumos.length}]`,
      insumos[numberOfInsumos.length]?.id
    );
    setNumberOfInsumos((prev) => (!prev ? [1] : [...prev, prev.length + 1]));
  };
  const handleSave = async (data) => {
    console.log(data);
  };
  const components = {
    event: (props) => {
      return <CalendarEvent props={props} />;
    },
  };
  return (
    <div className="parent-calendar">
      <Header
        icon={CalendarTodayOutlined}
        title={"Citas"}
        secondButton
        handleAdd={handleAdd}
        secondButtonText={"Ver estados"}
        handleSecondButtonFunction={handleInfo}
        buttonText={"Agregar cita"}
      />

      {loading || loadingUsuarios || loadingInsumos ? (
        <LoadingTableData />
      ) : (
        <Calendar
          events={events}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          messages={messagesCalendar}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          views={["month", "week", "day"]}
          components={components}
        ></Calendar>
      )}
      {showOptions && selectedEvent && (
        <div
          onMouseLeave={() => {
            setShowOptions(false);
          }}
          className="event-options"
          style={{
            position: "absolute",
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          <div onClick={handlePreview}>
            <span className="info">
              <HelpOutline />
            </span>{" "}
            <span>Info</span>
          </div>
          {selectedEvent.data.estadoId !== 13 &&
            selectedEvent.data.estadoId !== 12 && (
              <div onClick={handleEdit}>
                <span className="edit">
                  <Edit />
                </span>
                <span>Editar Cita</span>
              </div>
            )}
          {selectedEvent.data.estadoId === 9 && (
            <div onClick={handleEstimation}>
              <span className="cotizar">
                <CalculateOutlined />
              </span>
              <span>Cotizar cita</span>
            </div>
          )}
          {(selectedEvent.data.estadoId == 9 ||
            selectedEvent.data.estadoId == 10) && (
            <div onClick={handleCancel}>
              <span className="error">
                <Cancel />
              </span>
              <span>Cancelar cita</span>
            </div>
          )}
        </div>
      )}
      <Dialog
        keepMounted
        TransitionComponent={Transition}
        open={openModal}
        onClose={() => toggleState(!openModal)}
      >
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogTitleCustom>{dialogProps.title}</DialogTitleCustom>
          <DialogContent>
            {dialogProps.action === "info" ? (
              <section className="info-section">
                {estadoCitasColores.map((estado, idx) => (
                  <article key={idx}>
                    <span
                      style={{ background: estado.color }}
                      className="color-estado"
                    ></span>
                    <span>{estado.nombre}</span>
                  </article>
                ))}
              </section>
            ) : dialogProps.action === "preview" ? (
              <div class="cita-card">
                {selectedEvent.data.referencia && (
                  <div class="cita-imagen">
                    <img
                      src={selectedEvent.data.referencia}
                      alt="Imagen de la cita"
                    />
                  </div>
                )}
                <div class="cita-info">
                  <div class="campo">
                    <label>Fecha:</label>
                    <span>
                      {dayjs(selectedEvent.start).format(
                        "DD [de] MMMM [del] YYYY"
                      )}
                    </span>
                  </div>
                  <div class="campo">
                    <label>Objetivo:</label>
                    <span className="objetivo-text">
                      {selectedEvent.data.objetivo}
                    </span>
                  </div>
                  <div class="campo">
                    <label>Usuario:</label>
                    <span>{selectedEvent.data.usuario.nombre}</span>
                  </div>
                  <div class="campo">
                    <label>Teléfono:</label>
                    <span>+57 {selectedEvent.data.usuario.telefono}</span>
                  </div>
                  <div class="campo">
                    <label>Correo:</label>
                    <span>{selectedEvent.data.usuario.email}</span>
                  </div>
                </div>
              </div>
            ) : dialogProps.action === "cancel" ? (
              <DialogContentText>{`¿Estás seguro de querer cancelar la cita de ${
                selectedEvent.data.usuario.nombre
              } para el ${dayjs(selectedEvent.start).format(
                "dddd, D [de] MMMM [de] YYYY"
              )}`}</DialogContentText>
            ) : (
              <div>
                {dialogProps.action !== "estimation" && (
                  <div>
                    <div className="textInputWrapper">
                      <h4>
                        Fecha{" "}
                        {watch("fecha") &&
                          `${dayjs(watch("fecha")).format(
                            "dddd, D [de] MMMM [de] YYYY, h:mm A"
                          )}`}
                      </h4>
                      <input
                        {...register("fecha", {
                          required: "¡La fecha es requerida!",
                          min: {
                            value: dayjs().format("YYYY-MM-DD"),
                            message: "¡La fecha no puede ser anterior a hoy!",
                          },
                          max: {
                            value: dayjs()
                              .add(2, "months")
                              .format("YYYY-MM-DD"),
                            message:
                              "¡La fecha no puede superar los dos meses!",
                          },
                        })}
                        type="datetime-local"
                        className="textInput"
                      />
                    </div>
                    {errors.fecha && (
                      <div className="error-fecha">{errors.fecha.message}</div>
                    )}
                    <InputDash
                      {...register("objetivo", {
                        required: "¡El objetivo es obligatorio!",
                        minLength: {
                          value: 4,
                          message: "Mínimo  4 caracteres",
                        },
                        maxLength: {
                          value: 255,
                          message: "Mínimo  255 caracteres",
                        },
                      })}
                      label="Objetivo"
                      description={errors.objetivo && errors.objetivo.message}
                      type="text"
                    />
                    <SelectDash
                      {...register("usuarioId", {
                        required: "Debes escoger un usuario!",
                      })}
                      label="Usuario"
                      description={errors.usuarioId && errors.usuarioId.message}
                    >
                      {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nombre}
                        </option>
                      ))}
                    </SelectDash>
                  </div>
                )}
                {(dialogProps.action === "add" ||
                  (dialogProps.action === "edit" &&
                    selectedEvent.data.estadoId != 9) ||
                  dialogProps.action === "estimation") && (
                  <div>
                    <InputDash
                      {...register("precio", {
                        required:
                          "La cantidad es requerida en pesos Colombianos (COP)",
                        pattern: {
                          value: /^\d+$/,
                          message: "Solo se permiten números",
                        },
                        min: {
                          message: "¡Mínimo de compra 2000 pesos colombianos!",
                          value: 2000,
                        },
                        onChange: (e) => {
                          let { value } = e.target;
                          value = value.replace(/\D/g, "");
                          e.target.value = value;
                        },
                      })}
                      label="Precio"
                      type="text"
                      description={errors.precio && errors.precio.message}
                    />
                    <div className="">
                      <h4>Tiempo aproximado</h4>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <div>
                          <InputDash
                            {...register("horas", {
                              required: "¡mínimo 0 horas!",
                              min: {
                                value: 0,
                                message: "¡mínimo 0 horas!",
                              },
                              onChange: (e) => {
                                let { value } = e.target;
                                value = value.replace(/\D/g, "");
                                e.target.value = value;
                              },
                              max: {
                                value: 8,
                                message: "¡8 horas permitidas por cita",
                              },
                            })}
                            width="250px"
                            label={"Horas"}
                            initialValue={1}
                          ></InputDash>
                          {errors.horas && (
                            <div className="error-fecha">
                              {errors.horas.message}
                            </div>
                          )}
                        </div>
                        <div>
                          <InputDash
                            {...register("minutos", {
                              required: "¡mínimo 0 minutos!",
                              onChange: (e) => {
                                let { value } = e.target;
                                value = value.replace(/\D/g, "");
                                e.target.value = value;
                              },
                              min: {
                                value: watch("horas") == 0 ? 10 : 0,
                                message: `¡mínimo ${
                                  watch("horas") == 0 ? "10" : "0"
                                } minutos! `,
                              },
                              max: {
                                value: 59,
                                message:
                                  "¡59 es el máximo de minutos permitidos!",
                              },
                            })}
                            width="250px"
                            label={"Minutos"}
                            initialValue={0}
                          ></InputDash>
                          {errors.minutos && (
                            <div className="error-fecha">
                              {errors.minutos.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="add-insumos">
                      <span>
                        {insumos?.length > 0
                          ? "Añadir insumos"
                          : "¡No tienes insumos registrados en el aplicativo!"}
                      </span>{" "}
                      {numberOfInsumos?.length < insumos?.length && (
                        <Button onClick={handleAddInsumo}>
                          <AddRounded size={24} color={"#fff"}></AddRounded>
                        </Button>
                      )}
                    </div>
                    {numberOfInsumos?.length >= 1 ? (
                      numberOfInsumos.map((_, idx) => (
                        <div
                          style={{ marginTop: "10px" }}
                          key={idx}
                          className="add-insumo-section"
                        >
                          <div>
                            <SelectDash
                              label="Insumo"
                              width="170px"
                              {...register(`insumo[${idx}]`, {
                                required: "Debes escoger un insumo!",
                                onChange: (e) =>
                                  setValue(`insumo[${idx}]`, e.target.value),
                              })}
                              description={errors?.insumo?.[idx]?.message}
                            >
                              {insumos.map((ins) => (
                                <option key={ins.id} value={ins.id}>
                                  {ins.nombre}
                                </option>
                              ))}
                            </SelectDash>
                          </div>
                          <div>
                            <InputDash
                              width="350px"
                              allowDecimal
                              label={`Cantidad usada (Máximo ${findMaxQuantityInsumo(
                                parseFloat(getValues(`insumo[${idx}]`))
                              )})`}
                              type="number"
                              {...register(`cantidad_utilizada[${idx}]`, {
                                required: "¡La cantidad usada es requerida!",
                                pattern: {
                                  value: /^\d+(.\d+)?$/,
                                  message: "Solo se permiten números",
                                },
                                min: {
                                  value: 1,
                                  message: "¡La cantidad mínima es de 1!",
                                },
                                max: {
                                  value: findMaxQuantityInsumo(
                                    parseFloat(watch(`insumo[${idx}]`))
                                  ),
                                  message: `¡La cantidad máxima es de ${findMaxQuantityInsumo(
                                    parseFloat(watch(`insumo[${idx}]`))
                                  )}!`,
                                },
                              })}
                              onChange={(e) =>
                                setValue(
                                  `cantidad_utilizada[${idx}]`,
                                  e.target.value
                                )
                              }
                              description={
                                errors?.cantidad_utilizada?.[idx]?.message
                              }
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>Dale click a agregar un insumo!</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
          <CustomDialogActions
            cancelButton
            //customCancelColor={dialogProps.action === "delete" && "inherit"}
            saveButton={dialogProps.action !== "delete"}
            //deleteButton={dialogProps.action === "delete"}
            handleClose={() => toggleState(setOpenModal)}
          />
        </form>
      </Dialog>
    </div>
  );
}
const CalendarEvent = ({ props }) => {
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [bgColor, setBgColor] = useState(false);
  useEffect(() => {
    switch (props.event.data.estadoId) {
      case 9:
        setBgColor({ bg: estadoCitasColores[0].color, color: "#6A0DAD" });
        break;
      case 10:
        setBgColor({ bg: estadoCitasColores[1].color, color: "#fff" });
        break;
      case 11:
        setBgColor({ bg: estadoCitasColores[2].color, color: "#fff" });
        break;
      case 12:
        setBgColor({ bg: estadoCitasColores[4].color, color: "#fff" });
        break;
      case 13:
        setBgColor({ bg: estadoCitasColores[3].color, color: "#fff" });
        break;
      default:
        setBgColor(null);
    }
  }, [props.event.data.estadoId]);
  const toggleState = () => {
    setIsOpenOptions(!isOpenOptions);
  };

  return (
    <>
      <div
        className="cita-calendar"
        style={{ background: bgColor.bg, color: bgColor.color }}
        onClick={toggleState}
      >
        {props.title}
        <Dots size={12} color={"#fff"} />
      </div>
    </>
  );
};
