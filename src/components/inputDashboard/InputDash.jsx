import './inputDash.css';

const InputDash = ({label, description, type, width, descriptionColor}) => {
    return(
        <>
            <div className="input-groupDash">
                <label className="labelDash">{label}</label>
                <input autocomplete="off" name="Email" id="Email" className="inputDash" type={type} style={{ width: width || "535px" }} />
                <div></div>
            </div>
            <span className='descripcionDash' style={{color: descriptionColor || "rgb(250, 24, 24)"}}>
                {description}
            </span>
        </>
    )
}

export default InputDash;