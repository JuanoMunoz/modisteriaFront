import Metadata from "../../components/metadata/Metadata";
import { useEffect, useRef, useState } from "react";
import useLLM from "../../hooks/useLLM";
import "./citas.css";
import videoSource from "/citasVideo.mp4";
import { useJwt } from "../../context/JWTContext";
import { Asesor, Right, Plus, Top } from "../../components/svg/Svg";
import Input from "../../components/input_basico/Input";
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


  const asesorDiv = useRef(null);

  const scrollToDiv = () => {
    asesorDiv.current.scrollIntoView({ behavior: 'smooth' });
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

      <section ref={asesorDiv}>

        <Input
          placeholder={'Escribe un Mensaje'}
          ref={inputRef}
          onChange={handleInput}
          type="text"
          value={inputValue}
        ></Input>

        <button style={{ color: "#fff" }} onClick={submitQuestion}>
          {" "}
          <Top color={'#fff'}></Top>
        </button>
        <button style={{ color: "#fff" }} onClick={resetHistory}>
          {" "}
          <Plus color={'#fff'}></Plus>
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