import React from "react";


const filter =  ({value, onChange}) => {
    return (
        <div>
             filter shown with <input value={value} onChange={onChange}></input>
        </div>

    )
}

export default filter;