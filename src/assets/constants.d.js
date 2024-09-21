  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^3\d{9}$/;
  
const constants = {
    EMAIL_REGEX,
    PHONE_REGEX
}

export const postSession = [
    {
      title:
        "Bienvenido a Modisteria Doña Luz. Agenda una cita con nosotros!",
      img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
      published: "Modisteria D.L",
      linkText: "Agendar Cita",
      tag: "Cita",
      type: "article",
      link: "/cita",
    },
    {
      title:
        "Visita tu perfil y administra tu información! ",
      img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
      tag: "Perfil",
      published: "Modisteria D.L",
      linkText: "Ir a mi Perfil",
      type: "article",
      link: "/perfil",
    },
    {
      title:
        "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
      img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
      tag: "Catálogo",
      published: "Modisteria D.L",
      linkText: "Catálogo",
      type: "article",
      link: "/catalogo",
    },
  ];
export const postsNoSession = [
    {
      title:
        "Bienvenido a Modisteria Doña Luz. Si aún no tienes una cuenta, puedes Registrarte",
      img: "https://i.pinimg.com/1200x/6d/fa/0b/6dfa0bc796ef1ef2560a7c832f361e14.jpg",
      published: "Modisteria D.L",
      linkText: "Registrate",
      tag: "Registrate",
      type: "article",
      link: "/registro",
    },
    {
      title:
        "Si ya habias ingresado a Modisteria Doña Luz, puedes Iniciar Sesión y hacer uso de nuestros servicios",
      img: "https://i.pinimg.com/1200x/19/af/0c/19af0cc06f7dc0cebbbafbf649f4cda4.jpg",
      tag: "Inicia Sesión",
      published: "Modisteria D.L",
      linkText: "Inicia Sesión",
      type: "article",
      link: "/sesion",
    },
    {
      title:
        "Si deseas ver una muestra de nuestros servicios, puedes ver las prendas disponibles en nuestro catálogo",
      img: "https://i.pinimg.com/1200x/55/7f/34/557f3472cc354a2387040322b6d2e5f2.jpg",
      tag: "Catálogo",
      published: "Modisteria D.L",
      linkText: "Catálogo",
      type: "article",
      link: "/catalogo",
    },
  ];
export default constants