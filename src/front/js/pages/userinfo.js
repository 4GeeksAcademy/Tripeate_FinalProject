import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/navuser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";

export const PerfilUser = () => {
  const { store, actions } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreTrip: "",
    ubicacionTrip: "",
    descripcionTrip: "",
    categoria: "",
    fotosTrip: null,
    horaSalida: "",
    horaLlegada: "",
    fechaTrip: "",
    ubicacionSalida: "",
    capacidad: "",
    ubicacionLlegada: "",
    nombreEmpresa: "",
    logoEmpresa: null,
    rif: "",
    descripcionEmpresa: "",
    email: "",
    telefono: "",
    instagram: "",
    facebook: "",
    paquete: "",
  });

  const toggleNavbar = () => {
    setCollapsed(!collapsed); // Alternar estado de colapso
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/api/create_plan", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        alert("Formulario enviado con éxito");
        console.log("Datos enviados:", result);
      } else {
        alert(`Error: ${result.msg || "Ocurrió un problema al enviar el formulario."}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
  };

  return (
    <div style={{ display: "flex", marginTop: "0", paddingTop: "0" }}>
      <nav
        className={`navbar bg-body-tertiary fixed-left ${collapsed ? "collapsed" : ""} d-block ps-2 pt-5 text-end pe-4 nav-user mt-5`}
        style={{
          backgroundColor: "white",
          borderBlockEnd: "rgb(165, 68, 65)",
          height: "100vh",
          width: "170px",
          transition: "transform 0.3s ease",
          margin: "0",
          transform: collapsed ? "translateX(-30%)" : "translateX(0)",
          left: "0",
          top: "0",
          position: "relative",
          color: "rgb(165, 68, 65)",
        }}
      >
        <div>
          <button
            className="btn"
            onClick={toggleNavbar}
            style={{
              boxShadow: "none",
              color: "rgb(165, 68, 65)",
              marginBottom: "",
              paddingLeft: "",
            }}
          >
            {collapsed ? (
              <FontAwesomeIcon icon={faBars} className="fa-2x" />
            ) : (
              <>
                <FontAwesomeIcon icon={faBars} />
                <br />
              </>
            )}
          </button>
        </div>
        {!collapsed && (
          <div>
            <ul className="navbar-nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  <p>
                    <strong>Mi Perfil</strong>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Compras
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Favoritos
                </a>
              </li>
              <hr className="dropdown-divider border border-dark" style={{ width: "135px" }} />
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Ventas
                </a>
              </li>
              <li className="nav-item">
                <button className="btn btn-new" onClick={toggleForm} type="submit">
                  <FontAwesomeIcon icon={faPlus} /> Nuevo trip
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="container mt-5 text-center">
        {showForm ? (
        <div
        style={{
          margin: "30px auto",
          maxWidth: "900px",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e6e6e6",
        }}
      >
        <h2
          style={{
            color: "#6a4e30",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Registrar Nuevo Trip
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Sección: Datos del Trip */}
          <h3
            style={{
              marginBottom: "15px",
              color: "#a44a3f",
              fontWeight: "bold",
              borderBottom: "2px solid #e6e6e6",
              paddingBottom: "8px",
            }}
          >
            Datos del Trip
          </h3>
      
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Nombre del Trip
              </label>
              <input
                type="text"
                name="nombreTrip"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Ejemplo: Full Day a Cayo Sombrero"
              />
            </div>
      
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Ubicación del Trip
              </label>
              <input
                type="text"
                name="ubicacionTrip"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Ubicación del trip"
              />
            </div>
          </div>
      
          <div style={{ margin: "20px 0" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
                color: "#333",
              }}
            >
              Descripción del Trip
            </label>
            <textarea
              name="descripcionTrip"
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
              }}
              placeholder="Describa los detalles del trip..."
            />
          </div>
      
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Hora de Salida
              </label>
              <input
                type="time"
                name="horaSalida"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
      
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Hora de Llegada
              </label>
              <input
                type="time"
                name="horaLlegada"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
      
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", margin: "20px 0" }}>
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Fecha del Trip
              </label>
              <input
                type="date"
                name="fechaTrip"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
      
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Capacidad (N° de Puestos)
              </label>
              <input
                type="number"
                name="capacidad"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Ejemplo: 20"
              />
            </div>
          </div>
      
          {/* Sección: Datos de la Empresa */}
          <h3
            style={{
              marginBottom: "15px",
              color: "#a44a3f",
              fontWeight: "bold",
              borderBottom: "2px solid #e6e6e6",
              paddingBottom: "8px",
            }}
          >
            Datos de la Empresa
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                Nombre de la Empresa
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Ejemplo: Viajes XYZ"
              />
            </div>
            <div style={{ flex: "1 1 45%" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                }}
              >
                RIF de la Empresa
              </label>
              <input
                type="text"
                name="rif"
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "14px",
                }}
                placeholder="Ejemplo: J-12345678-9"
              />
            </div>
          </div>
      
          {/* Botón de envío */}
          <button
            type="submit"
            style={{
              backgroundColor: "#a44a3f",
              color: "#fff",
              fontWeight: "bold",
              padding: "15px 20px",
              border: "none",
              borderRadius: "8px",
              width: "100%",
              marginTop: "30px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#8e3932")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#a44a3f")}
          >
            Registrar Trip
          </button>
        </form>
      </div>
      
        ) : (
          <div
            style={{
              marginLeft: "-170px",
              position: "relative",
              top: "15%",
            }}
          >
            <img
              src="https://picsum.photos/300/200"
              width="125"
              height="125"
              style={{
                borderRadius: "50%",
                marginBottom: "2rem",
              }}
            />
            <h2 className="mt-0">
              ¡Hola, {store.currentUser ? `${store.currentUser.name}!` : "Invitado!"}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
