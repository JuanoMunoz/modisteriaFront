import './catalogo.css';
import { useState } from 'react';
import Metadata from "../../components/metadata/Metadata";
import Input from '../../components/input_basico/Input'
import Modal from '../../components/modal/Modal';

export default function Catalogo() {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };




    return (
        <>
            <Metadata title={"Catálogo de Productos"}></Metadata>
            <h1>Catálogo</h1>
            <hr className='separacionCatalogo'/>

            <section className='contenedorCatalogo'>
                <div className="filtros">
                    <h4>filtrar por precio</h4>
                    <input type="range" />
                </div>
                <div className="catalogo">
                    {/*CARTA DEL PRODUCTO*/}
                    <div className="card">
                        <div className="image_container">
                            <img src="https://eldeportivo.com.co/wp-content/uploads/2023/01/Polemica-precio-camiseta-Atletico-Nacional-2023-1.png" className=' image_container'/>
                        </div>
                        <div className="title">
                            <span>Camisa del Nacional</span>
                        </div>
                        <div className="size">
                            <span>Size</span>
                            <ul className='list-size'>
                                <li className='item-list'><button className='item-list-button'>37</button></li>
                                <li className='item-list'><button className='item-list-button'>37</button></li>
                                <li className='item-list'><button className='item-list-button'>37</button></li>
                                <li className='item-list'><button className='item-list-button'>37</button></li>
                                <li className='item-list'><button className='item-list-button'>37</button></li>
                            </ul>
                        </div>
                        <div className="action">
                            <div className="price">
                                <span>$20.000</span>
                            </div>
                            
                            <div className="cantidad">
                                <span>Cantidad</span><br />
                                    <Input 
                                        type={'number'}
                                        min={'1'}
                                        placeholder={'1'}
                                        id={'cantidadProducto'}
                                    >
                                    </Input>
                            </div>
                            <button className='btnAccion'>
                                <span>Agregar</span>
                            </button>
                            <button className='btnAccion' onClick={toggleModal}>
                                <span>Ver mas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* PAGINADOR */}
            <div className="cPaginador">
                <ul className='paginador'>
                    <li><a href="#">Previous</a></li>
                    <li><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">4</a></li>
                    <li><a href="#">5</a></li>
                    <li><a href="#">6</a></li>
                    <li><a href="#">7</a></li>
                    <li><a href="#">8</a></li>
                    <li><a href="#">Next</a></li>
                    </ul>
            </div>

            {/* MODAL */}
            <Modal show={showModal} onClose={toggleModal} className="modalDetalle" customWidth="1000px">
                <section className='contenedorDetalle'>
                    <div className="imageDetalle">
                        <img src="https://eldeportivo.com.co/wp-content/uploads/2023/01/Polemica-precio-camiseta-Atletico-Nacional-2023-1.png" className='imageDetalle'/>
                    </div>
                    <div className="infoDetalle">
                        <span className='tituloPrenda'>Camisa del Nacional</span><hr className='separacionDetalle'/><br />
                        <span className='precioDetalle'>$20.000</span><br /><br />
                        <div className="detalleDetalle">
                            <span>Detalles:</span>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, adipisci. Natus corrupti repudiandae suscipit accusamus voluptas quas sapiente</p>
                        </div>
                        <div className="size">
                                <span>Talla</span>
                                <ul className='list-size'>
                                    <li className='item-list'><button className='item-list-button'>37</button></li>
                                    <li className='item-list'><button className='item-list-button'>38</button></li>
                                    <li className='item-list'><button className='item-list-button'>39</button></li>
                                    <li className='item-list'><button className='item-list-button'>40</button></li>
                                    <li className='item-list'><button className='item-list-button'>41</button></li>
                                </ul>
                        </div>
                        <div className="accionesDetalle">
                            <div className="cantidadDetalle">
                                <span>Cantidad</span><br />
                                <Input 
                                    type={'number'}
                                    min={'1'}
                                    placeholder={'1'}
                                    id={'cantidadProducto'}
                                >
                                </Input>
                            </div>
                            <button className='btnAccionDetalle'>
                                <span>Agregar al Carrito</span>
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
        </>
    )
}