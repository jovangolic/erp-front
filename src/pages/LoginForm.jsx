import React, { useState } from "react";
import { loginUser } from "../components/utils/AppFunction";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

const LoginForm = ({ role }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [login, setLogin] = useState({
    identifier: "",  // umesto email
    password: "",
    role: role || ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const redirectUrl = location.state?.path || "/";

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(login); // login sadrži identifier, password, role

    if (success) {
      const token = success.token;
      auth.handleLogin(token);
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage("Neispravno korisničko ime ili lozinka.");
    }

    setTimeout(() => setErrorMessage(""), 4000);
  };

  return (
    <section className="container col-6 mt-5">
      <h2>Login za: {role.replace("ROLE_", "").replace("_", " ")}</h2>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="identifier" className="form-label">Email ili korisničko ime</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            className="form-control"
            value={login.identifier}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Lozinka</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            value={login.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Prijavi se</button>
      </form>
    </section>
  );
};

export default LoginForm;