import PropTypes from "prop-types";
import React, { useContext, useState, useEffect } from "react";
import "../../styles/nav-admin.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBars, faPlus, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "./modal";
import ErrorModal from "./modalError";


export const PerfilAdmin = () => {
  const { store, actions, setStore } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [acceptedPlans, setAcceptedPlans] = useState([]);
  const [rejectedPlans, setRejectedPlans] = useState([]);
  const [pendingPlans, setPendingPlans] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('users');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    last_name: '',
    email: ''
  });

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
      alert("Información actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar la información");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (store.currentUser) {
      setUserData({
        name: store.currentUser.name || '',
        last_name: store.currentUser.last_name || '',
        email: store.currentUser.email || '',
      });
    }
  }, [store.currentUser]);

  // Obtener usuarios y planes
  useEffect(() => {
    actions.getUsersList();
    actions.getPlansList().then(plans => {
      // Clasificar los planes en listas separadas
      setAcceptedPlans(plans.filter(plan => plan.status === 'Aceptado'));
      setRejectedPlans(plans.filter(plan => plan.status === 'Rechazado'));
      setPendingPlans(plans.filter(plan => plan.status === 'Pendiente'));
    });
  }, []);


  // Filtrar usuarios y planes según el término de búsqueda
  const filteredUsers = store.users.filter(user =>
    `${user.name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcceptedPlans = acceptedPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejectedPlans = rejectedPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingPlans = pendingPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (id, type) => {
    setItemId(id);
    setItemType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchData = async () => {
    await actions.getUsersList();
    const plans = await actions.getPlansList();
    setAcceptedPlans(plans.filter(plan => plan.status === 'Aceptado'));
    setRejectedPlans(plans.filter(plan => plan.status === 'Rechazado'));
    setPendingPlans(plans.filter(plan => plan.status === 'Pendiente'));
  };

  const handlerDelete = async () => {
    if (!itemId || !itemType) return;
    try {
      if (itemType === 'user') {
        await actions.deleteUser(itemId);
      } else if (itemType === 'plan') {
        await actions.deletePlan(itemId);
        // Actualiza el estado local eliminando el plan
        setAcceptedPlans(prevPlans => prevPlans.filter(plan => plan.id !== itemId));
        setRejectedPlans(prevPlans => prevPlans.filter(plan => plan.id !== itemId));
        setPendingPlans(prevPlans => prevPlans.filter(plan => plan.id !== itemId));
      }
      closeModal();
      await fetchData();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const managePlan = async (planId, action) => {
    const response = await actions.managePlan(planId, action);
    console.log(response);
    try {
      if (response.success) {
        // Actualiza el estado local según la acción
        if (action === 'accept') {
          setAcceptedPlans(prevPlans => [...prevPlans, response.plan]);
          setPendingPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
        } else if (action === 'rejected') {
          setRejectedPlans(prevPlans => [...prevPlans, response.plan]);
          setPendingPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
        }
      }
    } catch (error) {
      console.error(response.statusText);
    }
    await fetchData();
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed); // Alternar el estado de colapso
  };

  const fetchUserEmails = async () => {
    const emails = {};
    const allPlans = [...acceptedPlans, ...rejectedPlans, ...pendingPlans]
    for (const plan of allPlans) {
      const email = await actions.getUserEmailPlan(plan.id);
      emails[plan.id] = email
    }
    setUserEmails(emails)
  }
  useEffect(() => {
    if (acceptedPlans.length > 0 || rejectedPlans.length > 0 || pendingPlans.length > 0) {
      fetchUserEmails();
      console.log(activeSection)
    }
  }, [acceptedPlans, rejectedPlans, pendingPlans]);


  const handleLogOut = async () => {
    const result = await actions.logoutUser();
    if (result) {
      navigate("/loginuser");
    } else {
      <ErrorModal />
    }
  };


  return (
    <div style={{ display: "flex", marginTop: "0", paddingTop: "0" }}>
      <nav className={`navbar bg-body-tertiary fixed-left ${collapsed ? 'collapsed' : ''} d-block ps-2 pt-5 text-end pe-4 nav-user mt-5`}
        style={{
          backgroundColor: "white", borderBlockEnd: "rgb(165, 68, 65)", height: "100vh", width: "180px", transition: "transform 0.3s ease", margin: "0",
          transform: collapsed ? "translateX(-60%)" : "translateX(0)", left: "0", top: "0", position: "relative", color: "rgb(165, 68, 65)"
        }}>

        <div>
          <button className="btn" onClick={toggleNavbar} style={{ boxShadow: "none", color: "rgb(165, 68, 65)", width: "", marginBottom: "", paddingLeft: "" }}>
            {collapsed ? <FontAwesomeIcon icon={faBars} className="fa-2x" /> : <><FontAwesomeIcon icon={faBars} /><br></br></>}
          </button>
        </div>
        {!collapsed && (
          <div>
            <ul className="navbar-nav flex-column ">
              <li className="nav-item">
                <button className=" btn text-end navbutton" onClick={toggleForm} href="#"><p><strong>Mi Perfil</strong></p></button>
              </li>
              <li className="nav-item">
              </li>
              <button className="btn text-end navbutton" onClick={() => setActiveSection('users')}>Usuarios</button>
              <li className="nav-item">
                <button className="btn text-end navbutton" onClick={() => setActiveSection('accepted')}>Planes Aceptados</button>
              </li>
              <li className="nav-item">
                <button className="btn text-end navbutton" onClick={() => setActiveSection('rejected')}>Planes Rechazados</button>
              </li>
              <li className="nav-item">
                <button className="btn text-end navbutton" onClick={() => setActiveSection('pending')}>Planes Pendientes</button>
              </li>
              <hr className="dropdown-divider border border-dark" style={{ width: "135px" }} />
              <li className="nav-item">
                <button className="btn btn-new" type="submit"><FontAwesomeIcon icon={faPlus} /> Nuevo trip</button>
              </li>
              <hr className="dropdown-divider border border-dark" style={{ width: "135px" }} />
              <li className="nav-item">
                <button className="btn btn-new" onClick={handleLogOut} type="submit" style={{ marginTop: "225px" }}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>


        )}

      </nav>

      <div className="container mt-5" >
        <h1 className="text-center">Administrador</h1>
        <h1>Bienvenido, {userData.name ? `${userData.name} ${userData.last_name}` : 'Invitado'}</h1>


        {/* Campo de búsqueda */}
        {!showForm && (
          <input
            type="text"
            placeholder="Buscar usuarios y destinos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log("Término de búsqueda:", e.target.value);
            }}
            className="form-control mb-3 ps-4"
            style={{ maxWidth: "300px", borderRadius: "20px", padding: "5px", borderBlockEnd: "rgb(165, 68, 65)" }}
          />
        )}

        {activeSection === 'users' && !showForm && (
          <>
            {/* Sección de Usuarios */}
            <h3>Usuarios registrados en la plataforma</h3>
            {filteredUsers.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre y Apellido</th>
                    <th scope="col">Email</th>
                    <th scope="col">ID del usuario</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.id}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openModal(user.id, 'user')}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
          </>
        )}

        {activeSection === 'accepted' && !showForm && (
          <>
            {/* Sección de Planes */}
            {/* Sección de Planes Aceptados */}
            <h3>Planes Aceptados</h3>
            {filteredAcceptedPlans.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Usuario Vendedor</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAcceptedPlans.map((plan, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.name}</td>
                      <td>{userEmails[plan.id]}</td>
                      <td>{plan.type}</td>
                      <td>{plan.caption}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openModal(plan.id, 'plan')}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay planes aceptados.</p>
            )}
          </>
        )}

        {activeSection === 'rejected' && !showForm && (
          <>
            {/* Sección de Planes Rechazados */}
            <h3>Planes Rechazados</h3>
            {filteredRejectedPlans.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Usuario Vendedor</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejectedPlans.map((plan, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.name}</td>
                      <td>{userEmails[plan.id]}</td>
                      <td>{plan.type}</td>
                      <td>{plan.caption}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openModal(plan.id, 'plan')}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay planes rechazados.</p>
            )}
          </>
        )}

        {activeSection === 'pending' && !showForm && (
          <>
            {/* Sección de Planes Pendientes */}
            <h3>Planes Pendientes</h3>
            {filteredPendingPlans.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Destino</th>
                    <th scope="col">Usuario Vendedor</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingPlans.map((plan, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{plan.name}</td>
                      <td>{userEmails[plan.id]}</td>
                      <td>{plan.type}</td>
                      <td>{plan.caption}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => managePlan(plan.id, 'accept')}
                        >
                          Aceptar
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => managePlan(plan.id, 'rejected')}
                        >
                          Rechazar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => openModal(plan.id, 'plan')}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay planes pendientes.</p>
            )}
          </>
        )}
        {showForm && (
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
        <Modal
          showModal={showModal}
          handlerClose={closeModal}
          handlerDelete={handlerDelete}
        />
      </div>
    </div>
  )
};