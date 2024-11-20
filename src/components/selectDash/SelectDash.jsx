import './selectDash.css';

const SelectDash = ({label, width, description, descriptionColor}) =>{
    return(
        <>
            <div className="select-groupDash">
                <label className="labelSelectDash">{label}</label>
                <select name="" id="" className='selectDash' style={{width: width || "535px"}}>
                    <option value="">1</option>
                    <option value="">2</option>
                    <option value="">3</option>
                </select>
                <div></div>
            </div>
            <span className='descripcionSelectDash' style={{color: descriptionColor || "rgb(250, 24, 24)"}}>
                {description}
            </span>
        </>
    )
}

export default SelectDash;