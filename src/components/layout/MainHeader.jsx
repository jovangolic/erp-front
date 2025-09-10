
import React from "react";
import "./MainHeader.css"; // Ako koristiš dodatni CSS

const MainHeader = () => {
    return (
        <header className="header-banner">
            <div className="overlay"></div>
            <div className="animated-texts overlay-content">
                <h1 className="animated-title">
                    Welcome to <span className="hotel-color">G-Soft ERP System</span>
                </h1>
            </div>
        </header>
    );
};

export default MainHeader;