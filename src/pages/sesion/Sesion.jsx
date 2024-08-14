import './sesion.css'
import foto2 from "/foto2.jfif";
import Input from '../../components/input_basico/Input';
import Metadata from '../../components/metadata/Metadata';
export default function  InicioSesion() {
    
    return (
        <>
        <Metadata title={"Inicio Sesión - Modistería Doña Luz"}></Metadata>
            <br /><br />
            <span className="blackSesion">Inicia </span><span className="purpleSesion">Sesión</span>
            <hr className="separacionSesion"/>
            <br />

            <div className="contenedorSesion">
                <div className="formSesion">
                    <form action="#">
                        <Input
                            type={'text'}
                            placeholder={'Correo'}
                            description={'Descripción descripción descripción'}
                        ></Input>
                        <Input
                            type={'password'}
                            placeholder={'Contraseña'}
                            description={'Descripción descripción descripción'}
                        ></Input>

                        <button className="btn-registroSesion">
                            <span>Inicia Sesión</span>
                        </button>
                    </form>
                    <hr className='separacionForgot'/>
                    <button className='forgotPass'>¿Olvidaste tu Contraseña?</button>
                </div>

                <div className="imagenSesion">
                    <img src={foto2} alt="" className='imagenFormSesion' />
                </div>
            </div>
        </>
    )
}