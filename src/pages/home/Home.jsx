import Metadata from "../../components/metadata/Metadata";
import React, { useState, useEffect } from "react";
import "./home.css";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [postIndex, setPostIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const posts = [
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          updatePostIndex();
          return 0;
        }
        return prevProgress + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [postIndex]);

  const updatePostIndex = () => {
    setPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const handlePostClick = (index) => {
    setProgress(0);
    setPostIndex(index);
  };

  return (
    <>
      <Metadata title={"Inicio"}></Metadata>

      <div className="carousel">
        <div className="progress-bar progress-bar--primary hide-on-desktop">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <header className="main-post-wrapper">
          <div className="slides">
            {posts.map((post, index) => (
              <article
                key={index}
                className={`main-post ${
                  index === postIndex
                    ? "main-post--active"
                    : "main-post--not-active"
                }`}
              >
                <div className="main-post__image">
                  <img src={post.img} alt={post.title} loading="lazy" />
                </div>
                <div className="main-post__content">
                  <div className="main-post__tag-wrapper">
                    <span className="main-post__tag">{post.tag}</span>
                  </div>
                  <h1 className="main-post__title">{post.title}</h1>
                  <a className="main-post__link" href={post.link}>
                    <span className="main-post__link-text">
                      {post.linkText}
                    </span>
                    {post.type === "article" ? (
                      <svg
                        className="main-post__link-icon main-post__link-icon--arrow"
                        width="37"
                        height="12"
                        viewBox="0 0 37 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 6H36.0001M36.0001 6L31.0001 1M36.0001 6L31.0001 11"
                          stroke="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="main-post__link-icon main-post__link-icon--play-btn"
                        width="30"
                        height="30"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="9"
                          stroke="#C20000"
                          strokeWidth="2"
                        />
                        <path d="M14 10L8 6V14L14 10Z" fill="white" />
                      </svg>
                    )}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </header>

        <div className="posts-wrapper hide-on-mobile">
          {posts.map((post, index) => (
            <article
              key={index}
              className={`post ${index === postIndex ? "post--active" : ""}`}
              onClick={() => handlePostClick(index)}
            >
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${index === postIndex ? progress : 0}%` }}
                ></div>
              </div>
              <header className="post__header">
                <span className="post__tag">{post.tag}</span>
                <p className="post__published">{post.published}</p>
              </header>
              <h2 className="post__title">{post.title}</h2>
            </article>
          ))}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
