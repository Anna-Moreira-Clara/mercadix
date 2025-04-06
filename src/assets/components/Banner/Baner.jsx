import React from "react";
import banner from "../Banner/verao-banner.jpg";
import "./baner.css"

const Baner = () => {

    return(
        <div className="banner-container">
            
            <img src={banner} alt="banner" className="banner" width={500} height={500} dis />
            
        </div>
    )
}

export default Baner;