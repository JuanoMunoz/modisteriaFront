import './sesion.css'
import { useState } from 'react';
import Modal from'../../components/modal/Modal'
import foto2 from "/foto2.jfif";
import Input from '../../components/input_basico/Input';
import Metadata from '../../components/metadata/Metadata';
export default function  InicioSesion() {

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

    const handleSendCode = () => {
        toggleModal();
        toggleModal2();
    };

    const handleVerifyCode = () => {
        toggleModal2();
        toggleModal3();
    };


    return (
        <>
        <Metadata title={"Inicio Sesión - Modistería Doña Luz"}></Metadata>
            <br /><br />
            <span className="blackSesion">Inicia </span><span className="blackSesion">Sesión</span>
            <hr className="separacionSesion"/>
            <br />

            <div className="contenedorSesion">
                <div className="formSesion">
                    <form action="#">
                        <div className="inputSesion">
                            <Input
                                type={'text'}
                                placeholder={'Correo'}
                                description={'Descripción descripción'}
                            ></Input>
                            <Input
                                type={'password'}
                                placeholder={'Contraseña'}
                                description={'Descripción descripción'}
                                canHidden
                            ></Input>
                        </div>

                        <button className="btn-registroSesion">
                            <span>Inicia Sesión</span>
                        </button>
                    </form>
                    <hr className='separacionForgot'/>
                    <button className='forgotPass' onClick={toggleModal}>¿Olvidaste tu Contraseña?</button>
                </div>

                <div className="imagenSesion">
                    <img src={foto2} alt="" className='imagenFormSesion' />
                </div>
            </div>

            {/* MODAL */}
            <Modal show={showModal} onClose={toggleModal} className="modalPass">
                <h2>Recupera tu Contraseña</h2>
                <div className="inputModal">
                <Input
                    type={'text'}
                    placeholder={'Correo'}
                    description={'Ingresa tu correo electrónico para recuperar tu contraseña'}
                >
                </Input>
                </div>

                <button className="btn-registroSesion" onClick={handleSendCode}>
                    <span>Enviar Código</span>
                </button>
            </Modal> 


            {/* MODAL CÓDIGO*/}
            <Modal show={showModal2} onClose={toggleModal2} className="modalPass">
                <h2>Ingresa el Código</h2>
                <div className="inputModal">
                    {/* INPUT PARA JUAN */}
                </div>

                <button className="btn-registroSesion" onClick={handleVerifyCode}>
                    <span>Verificar Código</span>
                </button>
            </Modal>

            {/* MODAL CAMBIAR CONTRASEÑA */}
            <Modal show={showModal3} onClose={toggleModal3} className="modalPass">
                <h2>Cambiar Contraseña</h2>
                <div className="inputModalPassword">
                    <Input
                        type={'password'}
                        placeholder={'Nueva Contraseña'}
                        description={'Ingresa tu nueva contraseña'}
                        canHidden
                    />
                    <Input
                        type={'password'}
                        placeholder={'Confirmar Contraseña'}
                        description={'Confirma tu nueva contraseña'}
                        canHidden
                    />
                </div>

                <button className="btn-registroSesion">
                    <span>Cambiar Contraseña</span>
                </button>
            </Modal>
        </>
    )
}