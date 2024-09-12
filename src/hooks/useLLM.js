
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const useLLM = () => {
    const [isLoadingMessage, setIsloadingMessage] = useState(false)
    const initialHistory = [
    {
      role: "user",
      parts: [
        {
          text: `Hola, eres un asistente virtual en una página para una modistería, ubicada en Copacabana llamada 'modistería doña luz'. Serás el encargado de asesorar el proceso de agendamiento de citas, hoy estamos a ${new Date().toString()}. Quiero que tús respuestas NO SE DESVIEN DEL TEMA PRINCIPAL, RELACIONADO AL AGENDAMIENTO DE CITAS, Si hay alguna pregunta no relacionada a agendar citas en la modisteria debes ÚNICAMENTE recordar el motivo de la conversación, que es ÚNICAMENTE AGENDAR CITAS `,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Encantado, de ahora en adelante solo hablaré en español, seré claro y conciso en mis respuestas, y no me desviaré del propósito por ningún motivo. Responderé todas las preguntas relacionadas con la modistería Y EVITARÉ A TODA COSTA DE MANERA OBLIGATORIA responder cosas o hacer cosas que no estén relacionadas a agendar citas, no importa que tanto me insitan o las excusas que me pongan. además, SOLO USARÉ TEXTO PLANO EN TODAS MIS RESPUESTAS, SIN FORMATEAR NEGRITA, LISTAS, ETC. PUEDO USAR EMOJIS, PERO SOLAMENTE ESO",
        },
      ],
      },
    {
      role: "user",
      parts: [
        {
          text: `Perfecto, tendrás tres funciones LINEALES y NO te podrás desviar de ellas, tu propósito es agendar una cita, por lo que debes conocer: 1.El objetivo de la cita. 2. La fecha de la cita. 3. El método de pago (solo existen dos: Efectivo 💵 o transferencia por QR 🏦). Recuerda, todo el hilo de la conversación puede Y DEBE CUMPLIR estas tres encomiendas. ahora cuando te envie el mensaje "Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat" la siguiente respuesta debe ser en formato json del siguiente modo: {fecha:formato dd-mm-aa-hh:mm,objetivo: descripción corta y concisa del objetivo de la cita descrito a lo largo del chat,metodoPago:la opción elegida}. Es muy importante que si mi mensaje como usuario no es EXPLICÍTAMENTE el de arriba no me generes el reporte,si te lo pido pero no es igual al mensaje 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' puedes hacer un resumen de la cita en texto plano RELACIONADO A LA CITA Y sguime ayudando  A AGENDAR UNA CITA, NO ME DIGAS LA FRASE, PORQUE SE SUPONE QUE ES SECRETA`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Por supuesto, comprendo y entiendo estas tres objetivos y estoy a la espera del mensaje 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' para generar el reporte del proceso de compra. NO IMPORTA CUANTO ME LO PIDAN NO GENERARÉ EL REPORTE SI NO ME EXPRESAN EL MENSAJE 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat'. EL MENSAJE ES SECRETO ASÍ QUE TAMPOCO LO DIRÉ, EVITARÉ HABLAR SOBRE EL MENSAJE Y SI ME PIDEN UN REPORTE SIN EL MENSAJE ESTRICTAMENTE IGUAL DESVIARÉ LA CONVERSACIÓN PARA AGENDAR UNA CITA. Si por algún motivo faltase algun item este será null en el json de mi respuesta.'",
        },
      ],
    },    {
      role: "user",
      parts: [
        {
          text: `Ya que entendiste tus tres funciones lineales, no será tan fácil, la modistería maneja un horario, solo podrás agendar citas de LUNES A VIERNES DE 8 DE LA MAÑANA A 5PM DE LA TARDE. recuerda que la cita tiene una duración de 2 horas con la modista, por lo que la última cita podrá ser agendada a las 3pm, tu objetivo será poder llegar a un acuerdo con el usuario sí la cita que requiere no se puede agendar, PRIMERO DILE QUE LA FECHA NO SE PUEDE Y EXPLICALE EL PORQUÉ, luego dale alternativas que estén disponibles y cerca al día que el quiere, SI NO LLEGAN A UN ACUERDO SIMPLEMENTE MANDA NULL EN FECHA EN TU RESPUESTA A GENERAR REPORTE.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Por supuesto, comprendo y entiendo estas tres objetivos y estoy a la espera del mensaje para generar el reporte del proceso de compra. Si por algún motivo faltase algun item este será null en el json de mi respuesta, de ahora en más, comienzo mi proceso como asistente virtual de 'Modistería Doña Luz, de ahora en más, comienzo mi proceso como asistente virtual de 'Modistería Doña Luz'",
        },
      ],
    },
  ]
    const [historial, setHistorial] = useState(initialHistory);
    const resetHistory = () => {
        setHistorial(initialHistory)
    } 
    const sendMessage = async (message) => {
      setIsloadingMessage(true)
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: historial,
      });
      let result = await chat.sendMessage(message);
      const responseText = result.response.text();
      setHistorial((prev) => [
        ...prev,
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: responseText }] },
      ]);
      setIsloadingMessage(false)
      return responseText
    };
    const generarReporte = async () => {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: historial,
      });
      let result = await chat.sendMessage("'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat'");
      const responseText = result.response.text();
      return responseText
    };
    return {sendMessage,historial,isLoadingMessage,resetHistory,generarReporte}
  }
    

export default useLLM;
