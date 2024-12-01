import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "../../styles/detailTrip.css";
import TripArte2 from "../../img/arte-detailTrip.png";

export const DetailTrip = () => {



    return (

        <div className="container">

            {/* Carrusel */}
            <div id="carouselExampleFade" className="carousel slide carousel-fade mt-5" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://fastly.picsum.photos/id/13/1000/582.jpg?hmac=Kw-aT9zpQOU2V8LIgXHgdex9cp8m9YISBpljSCiTDRw" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://fastly.picsum.photos/id/27/1000/582.jpg?hmac=rtEWz-S_4aHi8XAT9M6bPdkzjiYHoz59vTEH1Ros4JU" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://fastly.picsum.photos/id/12/1000/582.jpg?hmac=1t5iIB2aCmRWbj92W9KdMeAN7kUgRrjszZUc10pGvWk" className="d-block w-100" alt="..." />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>



            {/* Info de lugar */}
            <div className="card border-0 rounded-0 infoCard">
                <div className="card-body">
                    <h3 className="card-title">Cayo Sombrero</h3>
                    <span className="card-subtitle mb-2 text-muted">
                        <i className="fa-solid fa-location-dot me-1"></i>
                        <a href="#" className="card-link">Paque nacional Mochima - Venezuela</a> </span>
                    <p className="card-text my-3">Es el nombre de una isla del mar Caribe que pertenece al parque nacional Morrocoy está incluida en la parte más oriental del Municipio Monseñor Iturriza del estado Falcón,​ en el oeste de Venezuela.</p>

                    <div className="container border-bottom my-3 linea"></div>



                    {/* Info de Empresa */}
                    <div className="card-body d-flex">
                        <div className="me-5 text-center">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy6U8APLewA6Lae1YGyu1dY8Vwe7BFt1ZbJA&s" className="card-img-top" alt="..." />
                            <p className="card-text dniSeller">J-65655644894-0</p>
                        </div>

                        <div className="card border-0 sellerInfo">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title d-inline-flex">Tu Full Day Venezuela</h4>

                                <div className="d-flex flex-row  rrSS">
                                    <i className="fa-brands fa-instagram mx-1"></i>
                                    <i className="fa-brands fa-facebook"></i>
                                </div>

                            </div>
                            <p className="card-text"> Empresa dedicada a los full-day en venezuela, contamos con mas de 15 años realizando los viajes mas fantasticos de la region, ven y disfruta de una experiencia unica.</p>

                            <div className="card-group">

                                <div className="card-body text-center mt-4">
                                    <i className="card-img-top fa-solid fa-van-shuttle"></i>
                                    <p className="card-text">Capacidad/Puestos</p>
                                    <p>8</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i className="card-img-top fa-regular fa-calendar-check"></i>
                                    <p>Salida/Llegada</p>
                                    <p>8-11-24 /<br /> 8-11-24</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i class="fa-solid fa-stopwatch"></i>
                                    <p>Salida/Llegada</p>
                                    <p>6:30 AM /<br /> 6:00 PM</p>
                                </div>

                                <div className="card-body d-block text-center mt-4">
                                    <i className="card-img-top fa-solid fa-map-location"></i>
                                    <p>Capacidad/Puestos</p>
                                    <p>Pza. Venezuela</p>
                                </div>
                            </div>  
                        </div>   
                    </div>
                    <img src={TripArte2} className="imgPlanes card-img" />
                </div>
            </div>
            

            {/* Compra de Planes */}
            <div className="card-group text-center">
                <div className=" planBasico card">
                    <div className="card-body">
                        <h1 className="card-title">Basico</h1>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Transporte</li>
                            <li className="list-group-item">Ague potable</li>
                            <li className="list-group-item">Refrigerios</li>
                        </ul>
                        <div className="btn-group mt-5">
                            <button type="button" className="btn btn-custom rounded-pill dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                ver precio
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="list-item text-black">$40,00 (USD)</a></li>
                                <li className=''><hr className="dropdown-divider" /></li>
                                <Link to="/buyTrip">
                                    <a type="button" className="btn btn-link text-black"><strong>Comprar</strong></a>
                                </Link>
                            </ul>
                        </div>
                    </div> 
                </div>

                <div className=" planMedio card">
                    <div className="card-body">
                        <h1 className="card-title">Medio</h1>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Transporte</li>
                            <li className="list-group-item">Desayuno</li>
                            <li className="list-group-item">Agua potable</li>
                            <li className="list-group-item">Refrigerios</li>
                            <li className="list-group-item">Bebidas(6)</li>
                        </ul>
                        <div className="btn-group mt-5">
                            <button type="button" className="btn btn-custom rounded-pill dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                ver precio
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="list-item text-black">$70,00 (USD)</a></li>
                                <li className=''><hr className="dropdown-divider" /></li> 
                                <Link to="/buyTrip">
                                    <a type="button" className="btn btn-link text-black"><strong>Comprar</strong></a>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className=" planFull card">
                    <div className="card-body"> 
                        <h1 className="card-title">Full-Trip</h1>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Transporte</li>
                            <li className="list-group-item">Desayuno</li>
                            <li className="list-group-item">Agua potable</li> 
                            <li className="list-group-item">Refrigerios</li>
                            <li className="list-group-item">Bebidas ilimitadas</li>
                            <li className="list-group-item">Almuerzo</li>
                            <li className="list-group-item">Masaje</li>
                        </ul>
                        <div className="btn-group mt-5">
                            <button type="button" className="btn btn-custom rounded-pill dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                ver precio
                            </button>
                            <ul className="dropdown-menu">     
                                <li><a className="list-item text-black">$120,00 (USD)</a></li>
                                <li className=''><hr className="dropdown-divider" /></li>
                                <Link to="/buyTrip">
                                    <a type="button" className="btn btn-link text-black"><strong>Comprar</strong></a>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

