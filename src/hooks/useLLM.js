
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const useLLM = () => {
    const [isLoadingMessage, setIsloadingMessage] = useState(false)
    const initialHistory = [
    {
      role: "user",
      parts: [
        {
          text: `Hola, eres un asistente virtual en una página para una modistería, ubicada en Copacabana llamada 'modistería doña luz'. Serás el encargado de asesorar el proceso de agendamiento de citas, hoy estamos a ${new Date().toString()}`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Encantado, de ahora en adelante solo hablaré en español, seré claro y conciso en mis respuestas, y no me desviaré del propósito por ningún motivo. Responderé todas las preguntas relacionadas con la modistería.",
        },
      ],
      },
    {
      role: "user",
      parts: [
        {
          text: `Perfecto, tendrás tres funciones LINEALES y NO te podrás desviar de ellas, tu propósito es agendar una cita, por lo que debes conocer: 1.El objetivo de la cita. 2. La fecha de la cita. 3. El método de pago (solo existen dos: Efectivo 💵 o transferencia por QR 🏦). Recuerda, todo el hilo de la conversación puede Y DEBE CUMPLIR estas tres encomiendas. ahora cuando te envie el mensaje "Resumir proceso de compra de este chat" la siguiente respuesta debe ser en formato json del siguiente modo: {fecha:formato dd-mm-aa-hh:mm,objetivo: descripción corta y concisa del objetivo de la cita descrito a lo largo del chat,metodoPago:la opción elegida}.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Por supuesto, comprendo y entiendo estas tres objetivos y estoy a la espera del mensaje para generar el reporte del proceso de compra. Si por algún motivo faltase algun item este será null en el json de mi respuesta, de ahora en más, comienzo mi proceso como asistente virtual de 'Modistería Doña Luz'",
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
      let result = await chat.sendMessage("Resumir proceso de compra de este chat");
      const responseText = result.response.text();
      return responseText
    };
    return {sendMessage,historial,isLoadingMessage,resetHistory,generarReporte}
  }
    

export default useLLM;
