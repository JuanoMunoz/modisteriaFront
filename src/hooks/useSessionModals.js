import axios from "axios";
import { useState } from "react";
export default function useModals(canSendCode,email) {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  };

  const toggleModal3 = () => {
    setShowModal3(!showModal3);
  };

    const handleSendCode = async() => {
    if (!canSendCode) return;
    console.log("estás dentro");
    axios.post("https://modisteria-back.onrender.com/api/forgotPassword",{email}).then(response=>{console.log(response).catch(err=>{console.log(err);
    });
    })
    toggleModal();
    toggleModal2();
  };
  const changeMail = () => {
    toggleModal2();
    toggleModal();
  };

  const handleVerifyCode = () => {
    toggleModal2();
    toggleModal3();
  };
  return {
    showModal,
    showModal2,
    showModal3,
    toggleModal,
    toggleModal2,
    toggleModal3,
    handleSendCode,
    changeMail,
    handleVerifyCode,
  };
}