import React, { useContext, useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { FaCalendarAlt } from 'react-icons/fa';
import Logout from "../auth/Logout";

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const handleAccountClick = () => {
        setShowAccount(!showAccount)
    }

    const handleInfoClick = () => {
        setShowInfo(!showInfo)
    };

    const isLoggedIn = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    return(
        <></>
    );

}


    export default NavBar;