import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navuser.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal } from "../component/modal";
import { TripCards } from "../component/tripCards";
import Swal from 'sweetalert2'



const initialTripState = {
  "nombreTrip": "",
  "destinoTrip": "",
  "descripcionTrip": "",
  "categoria": "",
  "imageDestino": "",
  "horaSalida": "",
  "horaLlegada": "",
  "fechaTrip": "",
  "ubicacionSalida": "",
  "ubicacionLlegada": "",
  "nombreEmpresa": "",
  "logoEmpresa": "",
  "rif": "",
  "descripcionEmpresa": "",
  "telefono": "",
  "instagram": "",
  "facebook": "",
  "capacidad": "",
}

export const PerfilUser = () => {
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [userPlans, setUserPlans] = useState([]);
  const [activeSection, setActiveSection] = useState('favoritos');
  const [userFavorites, setUserFavorites] = useState([]);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const navigate = useNavigate();


  const [trip, setTrip] = useState(initialTripState)

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setShowNewTripForm(false);
  };


  const handleChangeTrip = ({ target }) => {
    setTrip({
      ...trip,
      [target.name]: target.value
    })
  }

  const handleSubmitTrip = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append("nombreTrip", trip.nombreTrip)
    formData.append("destinoTrip", trip.destinoTrip)
    formData.append("descripcionTrip", trip.descripcionTrip)
    formData.append("categoria", trip.categoria)
    formData.append("horaSalida", trip.horaSalida)
    formData.append("horaLlegada", trip.horaLlegada)
    formData.append("fechaTrip", trip.fechaTrip)
    formData.append("ubicacionSalida", trip.ubicacionSalida)
    formData.append("ubicacionLlegada", trip.ubicacionLlegada)
    formData.append("nombreEmpresa", trip.nombreEmpresa)
    formData.append("logoEmpresa", trip.logoEmpresa)
    formData.append("rif", trip.rif)
    formData.append("descripcionEmpresa", trip.descripcionEmpresa)
    formData.append("telefono", trip.telefono)
    formData.append("instagram", trip.instagram)
    formData.append("facebook", trip.facebook)
    formData.append("capacidad", trip.capacidad)
    formData.append("imageDestino", trip.imageDestino)
    formData.append("precioTrip", trip.precioTrip)

    console.log("Datos del trip a enviar:", trip);
    const response = await actions.registerTrip(formData)


    if (response == 201) {
      Swal.fire({
        title: "Registrado!",
        text: "Da click para continuar!",
        icon: "success"
      });
      setTrip(initialTripState)


    } else {
      alert("error")
    }
  }


  const [userData, setUserData] = useState({
    name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    if (store.currentUser) {
      setUserData({
        name: store.currentUser.name || '',
        last_name: store.currentUser.last_name || '',
        email: store.currentUser.email || '',
      });
    }
  }, [store.currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", userData);
    const token = localStorage.getItem("token");
    try {
      await actions.updateUser(store.currentUser.id,
        userData.name,
        userData.last_name,
        userData.email,
        token);
      setUserData({
        name: userData.name,
        last_name: userData.last_name,
        email: userData.email
      });
      Swal.fire({
        title: "Información actualizada con éxito",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        title: "Error al actualizar la información",
        icon: "error",
        draggable: true
      });
    }
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  }

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (store.currentUser) {
        const favorites = await actions.getFavorites();
        setUserFavorites(favorites);
      }
    };
    fetchUserFavorites();
  }, [store.currentUser]);

  useEffect(() => {
    const fetchUserPlans = async () => {
      if (store.currentUser) {
        const plans = await actions.getPlansList();
        const filteredPlans = plans.filter(plan => plan.user_id === store.currentUser.id); // Filtrar por el ID del usuario
        setUserPlans(filteredPlans);
      }
    };
    fetchUserPlans();
  }, [store.currentUser]);

  const openModal = (id, type) => {
    setItemId(id);
    setItemType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlerDelete = async () => {
    if (!itemId || !itemType) return;
    try {
      if (itemType === 'plan') {
        await actions.deletePlan(itemId);
      }
      closeModal();
      const plans = await actions.getPlansList();
      const filteredPlans = plans.filter(plan => plan.user_id === store.currentUser.id);
      setUserPlans(filteredPlans);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleRemoveFavorite = async (planId) => {
    const response = await actions.removeFavorite(planId);
    try {
      setUserFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.id !== planId));
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en la solicitud");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/plans/${id}`);
  };

  return (
    <div style={{ display: "flex", marginTop: "0", paddingTop: "0" }}>
      <nav className={`navbar bg-body-tertiary fixed-left ${collapsed ? 'collapsed' : ''} d-block ps-2 pt-5 text-end pe-4 nav-user mt-5`}
        style={{
          backgroundColor: "white", borderBlockEnd: "rgb(165, 68, 65)", height: "100vh", width: "170px", transition: "transform 0.3s ease", margin: "0",
          transform: collapsed ? "translateX(-60%)" : "translateX(0)", left: "0", top: "0", position: "relative", color: "rgb(165, 68, 65)"
        }}>

        <div>
          <button className="btn" onClick={toggleNavbar} style={{ boxShadow: "none", color: "rgb(165, 68, 65)", width: "", marginBottom: "", paddingLeft: "" }}>
            {collapsed ? <FontAwesomeIcon icon={faBars} className="fa-2x" /> : <><FontAwesomeIcon icon={faBars} /><br></br></>}
          </button>
        </div>
        {!collapsed && (
          <div>

            <ul className="navbar-nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#" onClick={() => handleSectionChange('perfil')}><p><strong>Mi Perfil</strong></p></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Compras</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => handleSectionChange('favoritos')}>Favoritos</a>
              </li>
              <hr className="dropdown-divider border border-dark" style={{ width: "135px" }} />
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => handleSectionChange('ventas')}>Ventas</a>
              </li>
              {!showNewTripForm && (
                <li className="nav-item">
                  <button className="btn btn-new" onClick={() => {
                    handleSectionChange('ventas');
                    setShowNewTripForm(true)
                  }}><FontAwesomeIcon icon={faPlus} /> Nuevo trip</button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
      <div className="container">
        {!showNewTripForm && (
          <div className="container mt-5 text-center" >
            <img src="https://picsum.photos/300/200" width="125" height="125" style={{ borderRadius: "50%" }} />
            <h1 className="mt-0">¡Hola, {userData.name ? `${userData.name}!` : 'Invitado!'}</h1>
            <h5>{store.currentUser ? `${userData.email}` : 'email'}</h5>
          </div>
        )}
        {activeSection === 'perfil' && (
          <div className="container mt-5 p-4" style={{ backgroundColor: "white", maxWidth: "800px", borderRadius: "10px" }}>
            <form onSubmit={handleSubmit}>
              <div className="pt-2">
                <label style={{ color: "rgb(165, 68, 65)" }}><strong>Nombre:</strong></label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} required />
              </div>
              <div className="pt-2">
                <label style={{ color: "rgb(165, 68, 65)" }}><strong>Apellido:</strong></label>
                <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} />
              </div>
              <div className="pt-2">
                <label style={{ color: "rgb(165, 68, 65)" }}><strong>Correo electrónico:</strong></label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} required />
              </div>
              <div className="text-center mt-5">
                <button className="btn btn-new" type="submit">Actualizar Información</button>
              </div>
            </form>
          </div>
        )}
        {activeSection === 'favoritos' && (
          <div className="container mt-5">
            <h1 className="text-center">Mis Favoritos</h1>
            <div className="row">
              {userFavorites.length > 0 ? (
                userFavorites.map((favorite) => (
                  <div className="col-md-4" key={favorite.id}>
                    <TripCards
                      name={favorite.name}
                      image={favorite.image_location}
                      caption={favorite.caption}
                      onClick={() => handleCardClick(favorite.id)}
                      isFavorite={true}
                      onToggleFavorite={() => handleRemoveFavorite(favorite.id)}
                    />
                  </div>
                ))
              ) : (
                <div><p className="text-center mt-5">No tienes favoritos disponibles</p>
                  <div className="d-flex align-items-center justify-content-end mt-5">
                    <Link to="/">
                      <span href="#" className="btn btn-new rounded-pill">Ir al Home</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeSection === 'ventas' && (
          <div className="container mt-5">
            <h1 className="text-center">Mis Trips</h1>
            <table className="table" style={{ backgroundColor: "white", borderRadius: "10px" }}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre del Trip</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {userPlans.length > 0 ? (
                  userPlans.map((plan, index) => (
                    <tr key={plan.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.name}</td>
                      <td>{plan.status}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openModal(plan.id, 'plan')}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No tienes planes disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showNewTripForm && (
              <div className="text-center mt-5">
                <button className="btn btn-new" onClick={() =>
                  setShowNewTripForm(true)}>
                  <FontAwesomeIcon icon={faPlus} /> Agregar nuevo trip</button>
              </div>
            )}
          </div>
        )}
        {activeSection === 'ventas' && showNewTripForm && (
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

            <form
              onSubmit={handleSubmitTrip}
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del trip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreTrip"
                    placeholder="Full Day a Cayo Sombrero"
                    value={trip.nombreTrip}
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ubicación del trip</label>
                  <input
                    type="text"
                    className="form-control"
                    name="destinoTrip"
                    placeholder="una ubicación"
                    onChange={handleChangeTrip}


                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción del trip</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="descripcionTrip"
                  name="descripcionTrip"
                  value={trip.descripcionTrip}
                  onChange={handleChangeTrip}

                />
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-control"
                    name="categoria"
                    onChange={handleChangeTrip}

                  >
                    <option value="">Selecciona</option>
                    <option value="1">Playa</option>
                    <option value="2">Montaña</option>
                    <option value="3">Aventura</option>
                    <option value="4">Religioso</option>
                    <option value="5">Bienestar</option>
                    <option value="6">Ciudad</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0.00"
                      name="precioTrip"
                      value={trip.precioTrip}
                      onChange={handleChangeTrip}
                      aria-label="Dollar amount (with dot and two decimal places)"
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Fotos del trip</label>
                  <input
                    type="file"
                    className="form-control"
                    name="imageDestino"
                    onChange={(event) => {
                      setTrip({
                        ...trip, imageDestino: event.target.files[0]
                      })
                    }}
                  //revisar imagen
                  // multiple
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
                    value={trip.horaSalida}
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Hora Llegada</label>
                  <input
                    type="time"
                    className="form-control"
                    name="horaLlegada"
                    value={trip.horaLlegada}
                    onChange={handleChangeTrip}


                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaTrip"
                    value={trip.fechaTrip}
                    onChange={handleChangeTrip}

                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Ubicación de salida</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Punto de partida"
                    name="ubicacionSalida"
                    value={trip.ubicacionSalida}
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Capacidad/Puestos</label>
                  <select
                    className="form-control"
                    name="capacidad"
                    onChange={handleChangeTrip}

                  >
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
                    placeholder="Destino final"
                    value={trip.ubicacionLlegada}
                    onChange={handleChangeTrip}

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
                    placeholder="Nombre empresa"
                    value={trip.nombreEmpresa}
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Logo de la empresa</label>
                  <input
                    type="file"
                    className="form-control"
                    name="logoEmpresa"
                    onChange={(event) => {
                      setTrip({
                        ...trip, logoEmpresa: event.target.files[0]
                      })
                    }}
                  // revisar
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
                    placeholder="rif"
                    value={trip.rif}
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción de la empresa</label>
                  <textarea
                    className="form-control"
                    name="descripcionEmpresa"
                    rows="2"
                    placeholder="Descripción"
                    value={trip.descripcion}
                    onChange={handleChangeTrip}

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
                    placeholder="empresa@ejemplo.com"
                    onChange={handleChangeTrip}

                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefono"
                    placeholder="+58 XXX-XXXXXXX"
                    value={trip.telefono}
                    onChange={handleChangeTrip}

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
                      placeholder="usuario_instagram"
                      value={trip.instagram}
                      onChange={handleChangeTrip}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Facebook</label>
                  <input
                    type="text"
                    className="form-control"
                    name="facebook"
                    placeholder="facebook.com/pagina"
                    value={trip.facebook}
                    onChange={handleChangeTrip}
                  />
                </div>
              </div>

              {/* <h2 className="mt-4 mb-3">Paquetes</h2>
                <div
                  className="row"
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    marginBottom: "2rem",
                  }}
                > */}
              {/* <div className="col" style={{ flex: "1", maxWidth: "300px" }}>
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
                </div> */}

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
        )}
        <Modal
          showModal={showModal}
          handlerClose={closeModal}
          handlerDelete={handlerDelete}
        />
      </div>
    </div>
  )
};
