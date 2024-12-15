import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navuser.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
//import { Modal } from "../component/modal";



export const PerfilUser = () => {
  const { store, actions } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  // Añadir estos estados al inicio del componente, junto a los otros useState
  const [formData, setFormData] = useState({
    name: '',
    caption: '',
    image: '',
    type: '',
    available_slots: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  /*const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData);
    const token = localStorage.getItem("token");
    try {
      await actions.submitTrip(store.currentUser.id,
        formData.name,
        formData.caption,
        formData.image,
        formData.type,
        formData.available_slots,
        token);
      setFormData({
        name: formData.name,
        caption: formData.caption,
        image: formData.image,
        type: formData.type,
        available_slots: formData.available_slots
      });
      setFormData({});
      alert("Plan creado con éxito");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar el trip");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed); // Alternar el estado de colapso
  };

  useEffect(() => {
    actions.getPlansList()
  }, []);

  return (
    <div style={{ display: "flex", marginTop: "0", paddingTop: "0" }}>
      <nav
        className={`navbar bg-body-tertiary fixed-left ${collapsed ? "collapsed" : ""
          } d-block ps-2 pt-5 text-end pe-4 nav-user mt-5`}
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
              <hr
                className="dropdown-divider border border-dark"
                style={{ width: "135px" }}
              />
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Ventas
                </a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-new"
                  onClick={toggleForm}
                  type="submit"
                >
                  <FontAwesomeIcon icon={faPlus} /> Nuevo Trip
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="container mt-5 text-center">

        {showForm ? (
          <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f4f7fb',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '24px',
              color: '#333',
              marginBottom: '20px',
            }}>Crear Nuevo Plan</h2>
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <label htmlFor="name" style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '5px',
                }}>Destino:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <label htmlFor="caption" style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '5px',
                }}>Descripción:</label>
                <textarea
                  id="caption"
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <label htmlFor="image" style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '5px',
                }}>Imagen (URL):</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <label htmlFor="type" style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '5px',
                }}>Tipo:</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <label htmlFor="available_slots" style={{
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '5px',
                }}>Cantidad de lugares disponibles:</label>
                <input
                  type="number"
                  id="available_slots"
                  name="available_slots"
                  value={formData.available_slots}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s',
                  }}
                />
              </div>

              <button type="submit" style={{
                padding: '12px 20px',
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}>Crear Plan</button>
            </form>
          </div>
          /*<>
          FORMULARIO COMPLETO
          <div
            className="form-container"
            style={{
              margin: "30px auto",
              maxWidth: "900px",
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e6e6e6",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Datos del Trip</h2>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del trip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreTrip"
                    onChange={handleChange}
                    placeholder="Full Day a Cayo Sombrero"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ubicación del trip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ubicacionTrip"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción del trip</label>
                <textarea
                  className="form-control"
                  name="descripcionTrip"
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-control"
                    name="categoria"
                    onChange={handleChange}
                  >
                    <option value="">Selecciona</option>
                    <option value="playa">Playa</option>
                    <option value="montaña">Montaña</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fotos del trip</label>
                  <input
                    type="file"
                    className="form-control"
                    name="fotosTrip"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Hora Salida</label>
                  <input
                    type="time"
                    className="form-control"
                    name="horaSalida"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Hora Llegada</label>
                  <input
                    type="time"
                    className="form-control"
                    name="horaLlegada"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaTrip"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Ubicación de salida</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ubicacionSalida"
                    onChange={handleChange}
                    placeholder="Punto de partida"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Capacidad/Puestos</label>
                  <select className="form-control" name="capacidad" onChange={handleChange}>
                    <option value="">Selecciona</option>
                    {[...Array(50)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Ubicación de llegada</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ubicacionLlegada"
                    onChange={handleChange}
                    placeholder="Destino final"
                  />
                </div>
              </div>
              <h2 className="mt-4 mb-3">Datos de Empresa</h2>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre de la empresa</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreEmpresa"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Logo de la empresa</label>
                  <input
                    type="file"
                    className="form-control"
                    name="logoEmpresa"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">RIF</label>
                  <input
                    type="text"
                    className="form-control"
                    name="rif"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción de la empresa</label>
                  <textarea
                    className="form-control"
                    name="descripcionEmpresa"
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    placeholder="empresa@ejemplo.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefono"
                    onChange={handleChange}
                    placeholder="+58 XXX-XXXXXXX"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Instagram</label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="text"
                      className="form-control"
                      name="instagram"
                      onChange={handleChange}
                      placeholder="usuario_instagram"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Facebook</label>
                  <input
                    type="text"
                    className="form-control"
                    name="facebook"
                    onChange={handleChange}
                    placeholder="facebook.com/pagina"
                  />
                </div>
              </div>

              <h2 className="mt-4 mb-3">Paquetes</h2>
              <div
                className="row"
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  marginBottom: "2rem",
                }}
              >
                <div className="col" style={{ flex: "1", maxWidth: "300px" }}>
                  <div
                    className="card"
                    style={{ height: "100%", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{
                          color: "#a44a3f",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                        }}
                      >
                        Paquete Básico
                      </h5>
                      <ul className="list-unstyled" style={{ marginBottom: "1rem" }}>
                        <li>Transporte</li>
                        <li>Agua potable</li>
                      </ul>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          color: "#a44a3f",
                          textAlign: "center",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          backgroundColor: "#f8f9fa",
                          margin: "1rem 0",
                        }}
                      >
                        <strong>$40.00</strong>
                      </div>
                      <div className="form-check" style={{ marginTop: "1rem" }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paqueteSeleccionado"
                          value="basico"
                          id="paqueteBasico"
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="paqueteBasico"
                          style={{ cursor: "pointer" }}
                        >
                          Seleccionar paquete básico
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col" style={{ flex: "1", maxWidth: "300px" }}>
                  <div
                    className="card"
                    style={{ height: "100%", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{
                          color: "#a44a3f",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                        }}
                      >
                        Paquete Medio
                      </h5>
                      <ul className="list-unstyled" style={{ marginBottom: "1rem" }}>
                        <li>Transporte</li>
                        <li>Desayuno</li>
                        <li>Agua potable</li>
                        <li>Refrigerios</li>
                        <li>Bebidas (6)</li>
                      </ul>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          color: "#a44a3f",
                          textAlign: "center",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          backgroundColor: "#f8f9fa",
                          margin: "1rem 0",
                        }}
                      >
                        <strong>$70.00</strong>
                      </div>
                      <div className="form-check" style={{ marginTop: "1rem" }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paqueteSeleccionado"
                          value="medio"
                          id="paqueteMedio"
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="paqueteMedio"
                          style={{ cursor: "pointer" }}
                        >
                          Seleccionar paquete medio
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col" style={{ flex: "1", maxWidth: "300px" }}>
                  <div
                    className="card"
                    style={{ height: "100%", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{
                          color: "#a44a3f",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                        }}
                      >
                        Paquete Full
                      </h5>
                      <ul className="list-unstyled" style={{ marginBottom: "1rem" }}>
                        <li>Transporte</li>
                        <li>Desayuno</li>
                        <li>Agua potable</li>
                        <li>Refrigerios</li>
                        <li>Bebidas ilimitadas</li>
                        <li>Almuerzo</li>
                        <li>Masaje</li>
                      </ul>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          color: "#a44a3f",
                          textAlign: "center",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          backgroundColor: "#f8f9fa",
                          margin: "1rem 0",
                        }}
                      >
                        <strong>$120.00</strong>
                      </div>
                      <div className="form-check" style={{ marginTop: "1rem" }}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paqueteSeleccionado"
                          value="full"
                          id="paqueteFull"
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="paqueteFull"
                          style={{ cursor: "pointer" }}
                        >
                          Seleccionar paquete full
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                style={{
                  backgroundColor: "#a44a3f",
                  border: "none",
                  padding: "10px",
                  fontSize: "1.1em",
                }}
              >
                Registrar Trip
              </button>
            </form>
          </div>
          </>*/
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
              ¡Hola, {store.currentUser ? `${store.currentUser.name}` : "Invitado"}!
            </h2>
          </div>
        )}
      </div>
    </div>
  )

};