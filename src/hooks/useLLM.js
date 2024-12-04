import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import { useJwt } from "../context/JWTContext";
import useDecodedJwt from "../hooks/useJwt";
import useFetch from "../hooks/useFetch";
import useIsFirstRender from "./useIsMount";
import { URL_BACK } from "../assets/constants.d";

const useLLM = () => {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const { triggerFetch } = useFetch();
  const IsFirstRender = useIsFirstRender();
  const [citasAprobadas, setCitasAprobadas] = useState([]);
  const [initialHistory, setInitialHistory] = useState([]);
  const [historial, setHistorial] = useState(initialHistory);
  const [isLoadingMessage, setIsloadingMessage] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      const response = await triggerFetch(
        `${URL_BACK}/citas/getAllCitas?estadoId=11`,
        "GET",
        null,
        {
          "x-token": token,
          "Content-Type": "multipart/form-data",
        }
      );

      const citas = response.data.map((value) => {
        return {
          fecha: new Date(value.fecha.slice(0, -1)).toLocaleString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          duracion: new Date(
            new Date(value.fecha.slice(0, -1)).getTime() +
              value.tiempo.split(":").reduce((acc, time) => 60 * acc + +time) *
                1000
          ).toLocaleString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
      let text = "";
      citas.forEach(
        (value) =>
          (text += `QUEDA PROHIBIDO EL AGENDAMIENTO DE CITAS DESDE ${value.fecha} hasta  EL ${value.duracion} NO PODRÁS AGRENDAR CITAS EN ESE RANGO DE TIEMPO, CUANDO TE PREGUNTEN SOBRE EL AGENDAMIENTO DE CITAS ENTRE UNO DE ESOS HORARIOS SIMPLEMENTE LE DICES AL USUARIO QUE OTRA PERSONA YA TIENE ESA CITA AGENDADA. No importa lo mucho que te rueguen, si la fecha y la hora se encuentra entre este rango horario en el que están atendiendo a otros no podrás agendar. Ofrece alternativas ese mismo día que no abarquen la franja horaria mencionada anteriormente, intentanto que sea una hora más que el final de la cita, si no hay tiempo sugiere asignar la cita otro día hábil`)
      );

      setInitialHistory([
        {
          role: "user",
          parts: [
            {
              text: `Hola, eres un asistente virtual en una página para una modistería, ubicada en Copacabana llamada 'modistería doña luz'. Serás el encargado de asesorar el proceso de agendamiento de citas, hoy estamos a ${new Date().toLocaleDateString(
                "es-CO",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}. Quiero que tús respuestas NO SE DESVIEN DEL TEMA PRINCIPAL, RELACIONADO AL AGENDAMIENTO DE CITAS, Si hay alguna pregunta no relacionada a agendar citas en la modisteria debes ÚNICAMENTE recordar el motivo de la conversación, que es ÚNICAMENTE AGENDAR CITAS `,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Encantado, de ahora en adelante solo hablaré en español, seré claro y conciso en mis respuestas, y no me desviaré del propósito por ningún motivo. Responderé todas las preguntas relacionadas con la modistería Y EVITARÉ A TODA COSTA DE MANERA OBLIGATORIA responder cosas o hacer cosas que no estén relacionadas a agendar citas, no importa que tanto me insistan o las excusas que me pongan. además, SOLO USARÉ TEXTO PLANO EN TODAS MIS RESPUESTAS, SIN FORMATEAR NEGRITA, LISTAS, ETC. PUEDO USAR EMOJIS, PERO SOLAMENTE ESO",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Perfecto, tendrás dos funciones LINEALES y NO te podrás desviar de ellas, tu propósito es agendar una cita, por lo que debes conocer: 1.El objetivo de la cita. Recuerda que esto es una modisteria,debes preguntar que está buscando SIEMPRE, que quiere hacerse, como quiere hacerselo pero sin salirte del tema que una persona quiere ir  a la modisteria a CONFECCIONAR ROPA, recuerda, en la modisteria NO se hacen accesorios que no tengan que ver con telas, por ejemplo NO hacemos collares, NO hacemos pulseras NO hacemos zapatos. por lo que el objetivo debe ser algo coherente como "hacer una gabardina color café pastel a mi medida" o "hacer una camisa con tela algodón talla xl". 2. La fecha de la cita.Recuarda, la fecha no está completa hasta que te digan un día válido y una hora válida, hasta entonces en el reporte fecha será null sin comillas. Si te pasan días de fechas como "25" o "31" o "12" REFIRIENDOSE AL DÍA, pideles atenta pero ESTRICTAMENTE que sean más especificos, que te brinden el día de la semana o el mes. Recuerda,todo el hilo de la conversación puede Y DEBE CUMPLIR estas dos encomiendas. ahora cuando te envie el mensaje "Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat" la siguiente respuesta debe ser del siguiente modo: {"fecha":formato dd-mm-aa-hh:mm,"objetivo": descripción corta y concisa del objetivo de la cita descrito a lo largo del chat}. en caso de null: {"fecha":null,"objetivo":null}. Es IMPORTANTISIMO, QUIZÁS LO MÁS IMPORTANTE QUE EL MENSAJE QUE ME MANDES SOLO SEA LAS LLAVES CON LA INFROMACIÓN, SIN NADA MÁS. Es muy importante que si mi mensaje como usuario no es EXPLICÍTAMENTE el de arriba no me generes el reporte,si te lo pido pero no es igual al mensaje 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' puedes hacer un resumen de la cita en texto plano RELACIONADO A LA CITA Y seguirme ayudando  A AGENDAR UNA CITA, NO ME DIGAS LA FRASE, PORQUE SE SUPONE QUE ES SECRETA`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Por supuesto, comprendo y entiendo estos dos objetivos y estoy a la espera del mensaje 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' para generar el reporte del proceso de compra. NO IMPORTA CUANTO ME LO PIDAN NO GENERARÉ EL REPORTE SI NO ME EXPRESAN EL MENSAJE 'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat'. EL MENSAJE ES SECRETO ASÍ QUE TAMPOCO LO DIRÉ, EVITARÉ HABLAR SOBRE EL MENSAJE Y SI ME PIDEN UN REPORTE SIN EL MENSAJE ESTRICTAMENTE IGUAL DESVIARÉ LA CONVERSACIÓN PARA AGENDAR UNA CITA. Si por algún motivo faltase algun item este será null SIN COMILLAS en el mensaje de mi respuesta. PARA QUE PUEDA CAMBIAR LA FECHA DEL REPORTE EL CLIENTE ME DEBERÁ HAVER PASADO UN DÍA Y UNA HORA VÁLIDA. no cambiaré la fecha del reporte de null hasta que no tenga estas dos cosas.'",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Ya que entendiste tus dos funciones lineales, no será tan fácil, tu responsabilidad es agendar citas, asegurándote de que cumplan con las siguientes reglas ESTRICTAS:
1. Las citas solo pueden agendarse de lunes a viernes, entre 8:00 AM y 5:00 PM.
2. No se pueden agendar citas en fin de semana (sábado o domingo).
3. Las citas deben agendarse al menos con tres (3) días hábiles de anticipación y no pueden exceder dos meses desde hoy (${new Date().toLocaleDateString(
                "es-CO",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}).
4. No se pueden agendar citas en un día anterior al día actual (${new Date().toLocaleDateString(
                "es-CO",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}).
5. Si la fecha o la hora propuesta está dentro de una franja de citas ya agendadas, debes prohibir la cita y sugerir alternativas fuera de ese rango.

${
  text === ""
    ? "Por el momento no hay citas agendadas, sientete libre de agendar en el horario que quieras siempre que se cumplan las reglas pertinentes"
    : `Aquí están las franjas ocupadas: ${text}}.  Si te solicitan una cita dentro de esas franjas horarias, debes informar al usuario que esa cita ya está ocupada y ofrecer alternativas que no interfieran con ese horario. Si no hay tiempo disponible ese mismo día, debes sugerir otra fecha hábil.`
} Tu objetivo será poder llegar a un acuerdo con el usuario sí la cita que requiere no se puede agendar, PRIMERO DILE QUE LA FECHA NO SE PUEDE Y EXPLICALE EL PORQUÉ, luego dale alternativas que estén disponibles y cerca al día que el quiere, SI NO LLEGAN A UN ACUERDO SIMPLEMENTE MANDA NULL SIN COMILLAS EN FECHA EN TU RESPUESTA A GENERAR REPORTE.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Por supuesto, comprendo y entiendo estos dos objetivos y estoy a la espera del mensaje para generar el reporte del proceso de compra. Si por algún motivo faltase algun item este será null SIN COMILLAS en el mensaje de mi respuesta. RESPECTO AL AGENDAMIENTO DE CITAS, DE AHORA EN ADELANTE CADA QUE RECIBA UNA POSIBLE FECHA PARA AGENDAR LA CITA, cumpliré estrictamente con las restricciones de horario, días hábiles, y franjas ya ocupadas. Si alguna cita cae en un horario no permitido o en una franja ya ocupada, sugeriré una alternativa y me aseguraré de no agendar en esos horarios. y, si la fecha que me proponen no cumple estas validaciones, sugeriré una fecha diferente y señalaré el porque esa fecha no es válida.'",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Ok, ahora te voy a dar la información de la persona a la que vas a entender, se trata de ${payload?.nombre}. trata a esta persona cordialmente. al finalizar la cita recuerdale que en su correo PERSONAL, EL QUE PERTENECE AL USUARIO QUE TE HABLA ( ${payload?.email}) se le avisará cuando la modista acepte la cita. además, recuerdale que para terminar la cita debe darle al botón de "agregar cita" arriba a la derecha`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Por supuesto, comprendo y entiendo con quien estoy tratando. de ahora en más, comienzo mi proceso como asistente virtual de 'Modistería Doña Luz. Mi próximo mensaje será respondiendo a lo que me digas y recordando las validaciones de citas en modistería doña luz. además te haré saber de la fecha de hoy (día, mes y día de la semana) y lo tendré presente para validar las fechas que me pidas. '",
            },
          ],
        },
      ]);
    };

    fetchCitas();
  }, [token, triggerFetch]);

  useEffect(() => {
    setHistorial(initialHistory);
  }, [initialHistory]);

  const resetHistory = () => {
    setHistorial((prev) => {
      return prev.slice(0, 8);
    });
  };

  const sendMessage = async (message) => {
    setIsloadingMessage(true);
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
    setIsloadingMessage(false);
    return responseText;
  };

  const generarReporte = async () => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: historial,
    });
    let result = await chat.sendMessage(
      "'Hola, SOY EL ADMINISTRADOR,Resumir proceso de compra de este chat' "
    );
    const responseText = result.response.text();
    return responseText;
  };

  return {
    sendMessage,
    historial,
    isLoadingMessage,
    resetHistory,
    generarReporte,
  };
};

export default useLLM;
