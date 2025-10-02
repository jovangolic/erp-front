import React, { useState } from "react";
import { Link } from "react-router-dom"
import { registerUser } from "../utils/AppFunction";
import { useAuth } from './AuthProvider';
import RequireAdminAuth from "./RequireAdminAuth";

const Registration = () => {

    const[registration, setRegistration] = useState({
        firstName:"", lastName:"", email:"", password:"",username:"",address:"",phoneNumber:"",roleIds:""
    });
    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        setRegistration({...registration, [e.target.name] : e.target.value});
    };

    //funkcija za registraciju
    const handleRegistration = async (e) => {
    e.preventDefault();
    try {
        
        const result = await registerUser({
            ...registration,
            roleIds: registration.roleIds.split(",").map(id => parseInt(id.trim()))
        });
        
        setSuccessMessage(result);
        setErrorMessage("");   
        
        setRegistration({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            username: "",
            address: "",
            phoneNumber: "",
            roleIds: ""
        });
    } catch (error) {
        setSuccessMessage("");
        setErrorMessage(`Registration error ${error.message}`);
    }
    // Resetovanje poruka nakon 5 sekundi
    setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
    }, 5000);
};
    

    return(
        <RequireAdminAuth>
                <section className="container col-6 mt-5 mb-5">
                    {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                    {successMessage && <p className="alert alert-success">{successMessage}</p>}
                    <h2>Register</h2>
                    <form onSubmit={handleRegistration}>
                        <div className="mb-3 row">
                            <label htmlFor="firstName" className="col-sm-2 col-form-label">
                                First Name
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-control"
                                    value={registration.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="lastName" className="col-sm-2 col-form-label">
                                Last Name
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-control"
                                    value={registration.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="email" className="col-sm-2 col-form-label">
                                Email
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={registration.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="username" className="col-sm-2 col-form-label">
                                Username
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className="form-control"
                                    value={registration.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="password" className="col-sm-2 col-form-label">
                                Password
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={registration.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="address" className="col-sm-2 col-form-label">
                                Address
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={registration.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="username" className="col-sm-2 col-form-label">
                                PhoneNumber
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    className="form-control"
                                    value={registration.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="roleIds" className="col-sm-2 col-form-label">
                                Role IDs
                            </label>
                            <div className="col-sm-10">
                                <input
                                    id="roleIds"
                                    name="roleIds"
                                    type="text"
                                    className="form-control"
                                    value={registration.roleIds}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
                                Register
                            </button>
                            <span style={{ marginLeft: "10px" }}>
                                Already have an account? <Link to={"/login"}>Login</Link>
                            </span>
                        </div>
                    </form>
                </section>
        </RequireAdminAuth>
    );

};

export default Registration;