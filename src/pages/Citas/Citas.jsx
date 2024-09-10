import { useEffect, useRef, useState } from "react";
import useLLM from "../../hooks/useLLM";
import "./citas.css";
import videoSource from "/registro.mp4";
import { useJwt } from "../../context/JWTContext";
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
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };
  const submitQuestion = async () => {
    const response = await sendMessage(inputRef.current.value);
    setLastResponse(response);
  };
  const generateReport = async () => {
    const response = await generarReporte();
    console.log(response);
  };
  const [inputValue, setInputValue] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  useEffect(() => {
    console.log(historial);
  }, [historial]);

  return (
    <>
      <section className="header">
        <div className="video">
          <video className="background-video" autoPlay muted loop>
            <source src={videoSource} type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        </div>
        <div className="container-gradient">
          <div className="texto">
            <h1>
              PIDE TU <br />
              CITA
            </h1>
            <h3>
              Tenemos un asesor virtual <br /> especializado para tí!
            </h3>
          </div>
          <div className="gradient-div"></div>
        </div>
      </section>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <section>
        <input
          ref={inputRef}
          onChange={handleInput}
          type="text"
          value={inputValue}
        />
        <button style={{ color: "#fff" }} onClick={submitQuestion}>
          {" "}
          preguntar
        </button>
        <button style={{ color: "#fff" }} onClick={resetHistory}>
          {" "}
          nuevo chat
        </button>
        <button style={{ color: "#fff" }} onClick={generateReport}>
          {" "}
          generar reporte
        </button>
        <p style={{ color: "#f00" }}>
          {isLoadingMessage ? "cargando mensaje... " : lastResponse}
        </p>
      </section>
    </>
  );
}
