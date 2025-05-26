import React, { createContext, useState, useContext, useEffect } from "react"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext({
    user: null,
    handleLogin: (token) => {},
    handleLogout: () => {}
})

// 🔐 Funkcija za proveru isteka tokena
const isTokenExpired = (decodedToken) => {
    const currentTime = Date.now() / 1000
    return decodedToken.exp < currentTime
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decodedUser = jwt_decode(token)

                // ✅ Pozivamo proveru isteka tokena
                if (isTokenExpired(decodedUser)) {
                    console.warn("Token je istekao.")
                    handleLogout() // Ako je token istekao, izloguj korisnika
                } else {
                    setUser(decodedUser) // Ako nije, postavi korisnika
                }
            } catch (error) {
                console.error("Nevalidan token:", error)
                handleLogout() // Ako je token nevalidan, izloguj korisnika
            }
        }
    }, [])

    const handleLogin = (token) => {
        const decodedUser = jwt_decode(token)
        localStorage.setItem("userId", decodedUser.sub)
        localStorage.setItem("userRole", decodedUser.roles) // Ovdje se dodaje ulogu korisnika
        localStorage.setItem("token", token) // Spremamo token u localStorage
        setUser(decodedUser) // Postavljanje korisnika u state
    }

    const handleLogout = () => {
        localStorage.removeItem("userId")
        localStorage.removeItem("userRole")
        localStorage.removeItem("token")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}