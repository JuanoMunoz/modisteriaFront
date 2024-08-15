import './modal.css'; // Archivo CSS para estilizar el modal
import { useEffect, useState } from 'react';

const Modal = ({ show, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (show) {
            setShowModal(true);
            setTimeout(() => {
                setIsVisible(true); // Hacer visible el modal después de 10ms
            }, 10);
        } else {
            setIsVisible(false);
            setTimeout(() => {
                setShowModal(false); // Ocultar después de la animación
            }, 300); // Tiempo que coincide con la duración de la animación de salida
        }
    }, [show]);

    // Si no está visible, no renderizar el modal
    if (!showModal) {
        return null;
    }

    return (
        <div className={`modal-overlay ${isVisible ? 'show' : ''}`}>
            <div className={`modal ${isVisible ? 'show' : ''}`}>
                <button onClick={onClose} className="modal-close-button">
                    &times;
                </button>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;