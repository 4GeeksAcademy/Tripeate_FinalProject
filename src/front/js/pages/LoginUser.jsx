import React, { useContext, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Context } from "../store/appContext";
import ErrorModal from "../component/modalError";
import "../../styles/modalError.css";

export const LoginUser = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isEmailSent, sentisEmailSent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await actions.loginUser(email, password);
        if (response.token) {
            localStorage.setItem("token", response.token);
        }
        if (response.success) {
            navigate(response.is_admin ? "/perfiladmin" : "/userinfo");
        } else {
            setError(response.msg);
            setEmail("");
            setIsModalOpen(true);
        }
    };

    const handleForgotPassword = () => {
        setIsRecoveryModalOpen(true);
        setSuccessMessage("");
    };

    const handleRecoverySubmit = async (recoveryEmail) => {
        const response = await actions.requestPasswordRecovery(recoveryEmail);
        if (response.success) {
            setSuccessMessage("Revise su correo para el cambio de clave");
            sentisEmailSent(true);
            setEmail("");
        } else {
            setError(response.msg);
            setEmail("");
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-5" style={{ maxWidth: "500px", width: "100%", borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}>
                    <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "500", fontSize: "1.8rem" }}>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label htmlFor="email" style={{ color: "#555", fontSize: "1rem" }}>Correo Electrónico</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa tu correo" required />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password" style={{ color: "#555", fontSize: "1rem" }}>Contraseña</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#007bff", border: "none", borderRadius: "10px", padding: "14px", fontSize: "1.2rem", fontWeight: "600" }}>
                            Iniciar Sesión
                        </button>
                    </form>
                    <p className="text-center mt-4" style={{ color: "#777", fontSize: "1rem" }}>
                        ¿No tienes una cuenta? <Link to="/register"><button className="text-primary border-0" style={{ fontWeight: "500", background: "transparent" }}>Regístrate</button></Link>
                    </p>
                    <p className="text-center mt-2">
                        <button onClick={handleForgotPassword} style={{ fontSize: "1rem", color: "#007BFF", background: "transparent", border: "none", fontWeight: "500" }}>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </p>
                    <ErrorModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} errorMessage={error} />

                    <div className="m-auto">
                        {isRecoveryModalOpen && (
                            <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
                                <div className="modal-content" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '10000px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} >
                                    <div className="modal-header" >
                                        <h3>Recuperar Contraseña</h3>
                                        <button onClick={() => setIsRecoveryModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#aaa', cursor: 'pointer' }}>
                                            &times;
                                        </button>
                                    </div>
                                    <form onSubmit={(e) => { e.preventDefault(); handleRecoverySubmit(email); }}>
                                        <div className="modal-body">
                                            {!isEmailSent ? (
                                                <>
                                                    <label htmlFor="recoveryEmail">Correo Electrónico</label>
                                                    <input type="email" className="form-control" id="recoveryEmail" value={email} placeholder="Ingresa tu correo" onChange={(e) => setEmail(e.target.value)} required />
                                                </>
                                            ) : (
                                                <div className="alert alert-success mt-3">{successMessage}</div>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            {isEmailSent ? (
                                                <div className="m-auto">
                                                    <button className="btn btn-primary" onClick={() => setIsRecoveryModalOpen(false)}>Cerrar</button>
                                                </div>
                                            ) : (
                                                <div className="m-auto">
                                                    <button className="btn btn-primary" type="submit">Obtener enlace de recuperación de contraseña</button>
                                                </div>
                                            )}

                                        </div>

                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};