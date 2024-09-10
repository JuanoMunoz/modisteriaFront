import Metadata from "../../components/metadata/Metadata";
import { useEffect, useRef, useState } from "react";
import useLLM from "../../hooks/useLLM";
import "./citas.css";
import videoSource from "/citasVideo.mp4";
import { useJwt } from "../../context/JWTContext";
import { Asesor, Right, Send, Report, NewChat } from "../../components/svg/Svg";
export default function Citas() {
  const { token } = useJwt();
  const {
    historial,
    sendMessage,
    isLoadingMessage,
    generarReporte,
    resetHistory,
  } = useLLM();

  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const submitQuestion = async () => {
    const message = inputRef.current.value;

    setSentMessage(message);

    const response = await sendMessage(message);
    setLastResponse(response);

    setInputValue("");
  };

  const generateReport = async () => {
    const response = await generarReporte();
    console.log(response);
  };

  useEffect(() => {
    console.log(historial);
  }, [historial]);

  const asesorDiv = useRef(null);

  const scrollToDiv = () => {
    asesorDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Metadata title={"Citas - Modistería Doña Luz"}></Metadata>
      <div className="contenedorCitas">
        <div className="video">
          <video src={videoSource} autoPlay loop  muted className="video"></video>
        </div>
        <div className="citas">
          <span>Citas</span>
          <hr className="separacionCitas"/>
          <h2>¡Agenda tu cita ahora!</h2>
          <p>Contamos con un asesor especializado que estará completamente dedicado a atender tus necesidades. No pierdas la oportunidad de recibir una atención personalizada y profesional, diseñada exclusivamente para ti.</p>
          <button className="btnAsesor" onClick={scrollToDiv}>
              <span><Asesor color={'#fff'} size={'30px'}></Asesor><Right color={'#fff'} size={'30px'}></Right></span>
          </button>
        </div>
      </div>

      <section ref={asesorDiv} className="asesor">
        
      <div className="accionesTop">
        <button className="btnAccionesTop" onClick={resetHistory}>
              {" "}
              <span><NewChat></NewChat></span>
        </button>
        <button className="btnAccionesTop" onClick={generateReport}>
              {" "}
              <span><Report></Report></span>
        </button>
      </div>

      <p className="mensajeAsesor" style={{display: sentMessage.length > 0 ? "inline-block" : "none"}}>
        {sentMessage ? sentMessage : ""}
      </p>

      <p className="respuestaAsesor" style={{backgroundColor: lastResponse.length > 0 || isLoadingMessage ? "#e0e0e0" : "transparent"}}>
        {isLoadingMessage ? (
          <center>
              <div className="loader-containerAsesor">
              <div className="loaderAsesor">
                <svg viewBox="0 0 80 80">
                  <circle r="32" cy="40" cx="40" id="test"></circle>
                </svg>
              </div>

              <div className="loaderAsesor triangleAsesor">
                <svg viewBox="0 0 86 80">
                  <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
              </div>

              <div className="loaderAsesor">
                <svg viewBox="0 0 80 80">
                  <rect height="64" width="64" y="8" x="8"></rect>
                </svg>
              </div>
            </div>
          </center>
          
        ) : (
          lastResponse
        )}
      </p>

        <div className="accionesAsesor">

          <div className="messageBox">
            <div className="fileUploadWrapper">
              <label htmlFor="file">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                  <circle
                    strokeWidth="20"
                    stroke="#6c6c6c"
                    fill="none"
                    r="158.5"
                    cy="168.5"
                    cx="168.5"
                  ></circle>
                  <path
                    strokeLinecap="round"
                    strokeWidth="25"
                    stroke="#6c6c6c"
                    d="M167.759 79V259"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeWidth="25"
                    stroke="#6c6c6c"
                    d="M79 167.138H259"
                  ></path>
                </svg>
                <span className="tooltip">Agregar Imagen</span>
              </label>
              <input type="file" id="file" name="file" />
            </div>
            <input required placeholder="Mensaje..." type="text" id="messageInput" ref={inputRef} value={inputValue} onChange={handleInput} />
            <button id="sendButton" onClick={submitQuestion}>
              <Send></Send>
            </button>
          </div>

        </div>
      </section>
    </>
  );
}