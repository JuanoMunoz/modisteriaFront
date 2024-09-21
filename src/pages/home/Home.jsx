import Metadata from "../../components/metadata/Metadata";
import React, { useState, useEffect } from "react";
import "./home.css";
import { ToastContainer } from "react-toastify";
import { useJwt } from "../../context/JWTContext";
import { postSession, postsNoSession } from "../../assets/constants.d";

export default function Home() {
  const [postIndex, setPostIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { token } = useJwt();
  const posts = token ? postSession : postsNoSession;
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
