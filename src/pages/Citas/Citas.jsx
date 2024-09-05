import "./citas.css";
import videoSource from "/registro.mp4";
export default function Citas() {
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
    </>
  );
}
