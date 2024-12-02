import PropTypes from "prop-types";
import React, { useContext, useState, useEffect } from "react";
import "../../styles/home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Context } from "../store/appContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "./modal";


export const PerfilAdmin = () => {
  const { store, actions, setStore } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [acceptedPlans, setAcceptedPlans] = useState([]);
  const [rejectedPlans, setRejectedPlans] = useState([]);
  const [pendingPlans, setPendingPlans] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

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


  useEffect(() => {
    const fetchUserEmails = async () => {
      const emails = {};
      const allPlans = [...acceptedPlans, ...rejectedPlans, ...pendingPlans]
      for (const plan of allPlans) {
        const email = await actions.getUserEmailPlan(plan.id);
        emails[plan.id] = email
        console.log("Email del usuario:", email)
      }
      setUserEmails(emails)
    }
    if (acceptedPlans.length > 0 || rejectedPlans.length > 0 || pendingPlans.length > 0) {
      fetchUserEmails();
    }
  }, [acceptedPlans, rejectedPlans, pendingPlans])


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
                <a className="nav-link active" aria-current="page" href="#"><p><strong>Mi Perfil</strong></p></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Compras</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Favoritos</a>
              </li>
              <hr className="dropdown-divider border border-dark" style={{ width: "135px" }} />
              <li className="nav-item">
                <a className="nav-link" href="#">Ventas</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-new" type="submit"><FontAwesomeIcon icon={faPlus} /> Nuevo trip</button>
              </li>
            </ul>
          </div>
        )}
        
      </nav>

      <div className="container mt-5" >
        <h1 className="text-center">Administrador</h1>
        <h1>Bienvenido, {store.currentUser ? `${store.currentUser.name} ${store.currentUser.last_name}` : 'Invitado'}</h1>

        {/* Sección de Usuarios */}
        <h3>Usuarios registrados en la plataforma</h3>
        {store.users.length > 0 ? (
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
              {store.users.map((user, index) => (
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

        {/* Sección de Planes */}
        {/* Sección de Planes Aceptados */}
        <h3>Planes Aceptados</h3>
        {acceptedPlans.length > 0 ? (
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
              {acceptedPlans.map((plan, index) => (
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
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay planes aceptados.</p>
        )}

        {/* Sección de Planes Rechazados */}
        <h3>Planes Rechazados</h3>
        {rejectedPlans.length > 0 ? (
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
              {rejectedPlans.map((plan, index) => (
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
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay planes rechazados.</p>
        )}

        {/* Sección de Planes Pendientes */}
        <h3>Planes Pendientes</h3>
        {pendingPlans.length > 0 ? (
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
              {pendingPlans.map((plan, index) => (
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

        <Modal
          showModal={showModal}
          handlerClose={closeModal}
          handlerDelete={handlerDelete}
        />
      </div>
      </div>
      )
};