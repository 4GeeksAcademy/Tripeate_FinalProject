import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import "../../styles/detailTrip.css";
import TripArte2 from "../../img/arte-detailTrip.png";
import { Context } from "../store/appContext";

export const DetailTrip = () => {
    const { planId } = useParams(); // Obtener el ID del plan de la URL
    const { store, actions } = useContext(Context);
    const [plan, setPlan] = useState(null);



    useEffect(() => {
        if (planId) {
            const fetchPlan = async () => {
                const response = await actions.getPlan(planId);
                if (response) {
                    setPlan(response);
                }
            };
            fetchPlan();
        } else {
            console.error("planId es undefined");
        }
    }, [planId, actions]);


    if (!plan) {
        return <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>;
    };

    function imageError(e) {
        e.target.src = "https://fastly.picsum.photos/id/13/350/192.jpg?hmac=WL2y535NoIb9gWNgdcEs71DBlZXfkdfN6Lt7jypz_v4"
    };

    return (

        <div className="container">

            {/* Carrusel */}
            <div id="carouselExampleFade" className="carousel slide carousel-fade mt-5" data-bs-ride="carousel">
                <div className="carousel-inner">

                    <div key={plan.id}>
                        <img src={plan.image_location} onError={imageError} className="d-block w-100" alt="..." />
                    </div>

                </div>
            </div>

            {/* Info de lugar */}
            <div className="card border-0 rounded-0 infoCard">
                <div className="card-body">
                    <h3 className="card-title">{plan.name}</h3>
                    <span className="card-subtitle mb-2 text-muted">
                        <i className="fa-solid fa-location-dot me-1"></i>
                        <a href="#" className="card-link">{plan.location_trip}</a> </span>
                    <p className="card-text my-3">{plan.caption}</p>

                    <div className="container border-bottom my-3 linea"></div>



                    {/* Info de Empresa */}
                    <div className="card-body d-flex justify-content-evenly">
                        <div className="me-5 text-center">
                            <img src={plan.image_company} className="img-fluid small-image" alt="" />
                            <p className="card-text dniSeller">{plan.rif}</p>
                        </div>

                        <div className="card-body sellerInfo">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title d-inline-flex">{plan.company_name}</h4>

                                <div className="d-flex flex-row  rrSS">
                                    <i className="fa-brands fa-instagram mx-1"></i>
                                    <i className="fa-brands fa-facebook"></i>
                                </div>

                            </div>
                            <p className="card-text">{plan.description_company}</p>

                            <div className="card-group">

                                <div className="card-body text-center mt-4">
                                    <i className="card-img-top fa-solid fa-van-shuttle"></i>
                                    <p className="card-text">Capacidad de puestos</p>
                                    <p>{plan.available_slots}</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i className="card-img-top fa-regular fa-calendar-check"></i>
                                    <p>Salida/Llegada</p>
                                    <p>{plan.date_trip}/<br />{plan.date_trip}</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i className="fa-solid fa-stopwatch"></i>
                                    <p>Salida/Llegada</p>
                                    <p>{plan.time_start} /<br />{plan.time_end}</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i className="card-img-top fa-solid fa-map-location"></i>
                                    <p>Ubiación de Salida</p>
                                    <p>{plan.location_start}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer d-flex justify-content-end align-items-center" style={{ borderBottomRightRadius: '15px', borderBottomLeftRadius: '15px', boxShadow: '0px 15px 8px -9px rgba(0,0,0,0.41' }}>
                <h4 className='m-0 pe-3'>Precio:</h4>
                <h4 className='m-0 pe-5'><strong>${plan.trip_price}</strong></h4>
                <Link to={`/buyTrip/${plan.id}`}>
                    <span type="button" className="btn-custom btn btn-primary btn-lg rounded-pill"><strong>ir a Comprar</strong></span>
                </Link>
            </div>
        </div>
    )
};

