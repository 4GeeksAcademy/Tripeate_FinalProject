const backendURL = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	const storedUser = localStorage.getItem("currentUser")
	return {
		store: {

			user: null,
			token: localStorage.getItem("token") ?? null,
			currentUser: JSON.parse(localStorage.getItem("currentUser")) ?? null,
			users: [],
			plans: [],
			itemType: null,
			favorites: []

		},
		actions: {
			signupUser: async (name, last_name, email, password) => {
				try {
					const response = await fetch(backendURL + "/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name,
							last_name: last_name,
							email: email,
							password: password,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Usuario registrado:", data.user);
						return data; // Devuelve los datos si el registro fue exitoso
					} else {
						const errorData = await response.json();
						console.error("Error en el registro:", errorData.msg);
						return { error: true, msg: errorData.msg }; // Devuelve un mensaje de error si falló
					}
				} catch (error) {
					console.error("Error en el registro:", error);
					return { error: true, msg: "Error en la solicitud" }; // Indica un error de red u otro tipo de error
				}
			},

			loginUser: async (email, password) => {
				try {
					const response = await fetch(backendURL + "/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						},
						body: JSON.stringify({
							email,
							password,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Inicio de sesión exitoso:", data);
						console.log({ "Email del usuario": data.user.email });
						setStore({ currentUser: data.user, token: data.token })
						localStorage.setItem("currentUser", JSON.stringify(data.user));
						// Devuelve los datos recibidos, como el token y el ID de usuario
						return { success: true, token: data.token, userId: data.Id, is_admin: data.is_admin };
					} else {
						const errorData = await response.json();
						console.error("Error en el inicio de sesión:", errorData.msg);
						return { error: true, msg: errorData.msg }; // Retorna el mensaje de error si el login falla
					}
				} catch (error) {
					console.error("Error en la solicitud de inicio de sesión:", error);
					return { error: true, msg: "Error en la solicitud" }; // Indica un error de red u otro tipo de error
				}
			},

			logoutUser: async () => {
				const store = getStore();

				try {
					// Llamada a la API para cerrar sesión
					const response = await fetch(backendURL + "/logout", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.token}` // Pasar el token del usuario
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data.msg); // Mensaje de confirmación
						setStore({ token: null, user: null }); // Eliminar token y usuario del estado
						localStorage.removeItem('currentUser')
						localStorage.removeItem('token')
						return true; // Éxito
					} else {
						console.error("Error al cerrar sesión", error);
						return false;
					}
				} catch (error) {
					console.error("Error de red:", error);
					return false;
				}
			},
			requestPasswordRecovery: async (email) => {
				try {
					// Realizamos una solicitud POST al servidor para iniciar el proceso de recuperación de la contraseña
					const response = await fetch(backendURL + "/requestpasswordrecovery", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email }),
					});

					// Si la respuesta es exitosa
					if (response.ok) {
						const data = await response.json();
						console.log("Solicitud de recuperación de contraseña enviada:", data);
						return { success: true };  // Retornamos éxito si la respuesta es positiva
					} else {
						// Si hay un error, obtenemos el mensaje de error del servidor
						const errorData = await response.json();
						console.error("Error en la solicitud de recuperación de contraseña:", errorData.msg);
						return { success: false, msg: errorData.msg };  // Devolvemos el mensaje de error
					}
				} catch (error) {
					// Si ocurre un error en la red o un problema de servidor
					console.error("Error en la solicitud de recuperación de contraseña:", error);
					return { success: false, msg: "Hubo un error al procesar tu solicitud. Intenta nuevamente." }; // Mensaje genérico de error
				}
			},

			changePassword: async (newPassword, token) => {
				try {
					const response = await fetch(backendURL + "/changepassword", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,

						},
						body: JSON.stringify({ "new_password": newPassword }),
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(data.msg || "Error al cambiar la contraseña");
					}

					return { success: true, msg: data.msg };
				} catch (error) {
					console.error("Error en changePassword:", error)
					return { success: false, msg: error.message };
				}
			},


			updateUser: async (user_id, name, last_name, email, token) => {
				try {
					console.log("Datos a enviar:", { user_id, name, last_name, email });
					const response = await fetch(`${backendURL}/update_user/${user_id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({
							name: name,
							last_name: last_name,
							email: email,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Usuario actualizado:", data.user);
						return data;
					} else {
						const errorData = await response.json();
						console.error("Error en la actualización:", errorData.msg);
						return { error: true, msg: errorData.msg };
					}
				} catch (error) {
					console.error("Error en la actualización:", error);
					return { error: true, msg: "Error en la solicitud" };
				}
			},

			getUsersList: async () => {
				let resp = await fetch(backendURL + "/users", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				if (resp.ok) {
					let dataUsers = await resp.json();
					setStore({ users: dataUsers.users })
					console.log({ dataUsers })
				}
			},

			createPlan: async (name, caption, image, available_slots) => {
				const token = localStorage.getItem("token");
				try {
					const response = await fetch(`${backendURL}/create_plan`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
						body: JSON.stringify({
							name,
							caption,
							image,
							available_slots,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Plan creado:", data);
						return data; // Devuelve los datos si la creación fue exitosa
					} else {
						const errorData = await response.json();
						console.error("Error al crear el plan:", errorData.msg);
						return { error: true, msg: errorData.msg }; // Devuelve un mensaje de error si falló
					}
				} catch (error) {
					console.error("Error en la creación del plan:", error);
					return { error: true, msg: "Error en la solicitud" }; // Indica un error de red u otro tipo de error
				}
			},

			getPlansList: async () => {
				try {
					let resp = await fetch(backendURL + "/plans", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							// "Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					if (resp.ok) {
						const dataPlans = await resp.json();
						setStore({ plans: dataPlans.plans })
						console.log("Planes en el store:", getStore().plans);
						return dataPlans.plans

					} else {
						// Manejo de errores si la respuesta no es exitosa
						const errorData = await resp.json();
						console.error("Error al obtener planes:", errorData);
						setStore({ plans: [] });
					}
				} catch (error) {
					console.error("Error en la llamada a la API:", error);
					setStore({ plans: [] });
				}
			},

			getPlan: async (planId) => {
				try {
					const response = await fetch(`${backendURL}/plans/${planId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					if (response.ok) {
						const data = await response.json();
						console.log(data)
						return data.plan;
					} else {
						const errorData = await response.json();
						console.error("Error al obtener detalles del plan:", errorData);
						return null;
					}
				} catch (error) {
					console.error("Error en la llamada a la API:", error);
					return null;
				}
			},


			getUserEmailPlan: async (planId) => {
				try {
					const response = await fetch(`${backendURL}/plans/${planId}/user_email`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});
					if (!response.ok) {
						throw new Error('Error al obtener el correo electrónico del usuario');
					}
					const data = await response.json();
					return data.user_email;
				} catch (error) {
					console.error(error);
					return null;
				}
			},

			managePlan: async (planId, action) => {
				try {
					console.log({ planId, action })
					const bodyRequest = { "action": action }
					const headers = {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
					console.log(headers)
					let resp = await fetch(`${backendURL}/manage_plan/${planId}`, {
						method: "POST",
						body: JSON.stringify(bodyRequest),
						headers
					})
					if (!resp.ok) {
						console.error(resp.statusText)
						return false
					}
					return true
				} catch (error) {
					console.log(error)
				}
			},

			deleteUser: async (id, type) => {
				let resp = await fetch(`${backendURL}/delete_user/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				if (resp.status === 404) {
					console.log("No se puede eliminar el usuario");
					console.log(`No se puede eliminar el ${type}`);
				}
				if (resp.status === 200) {
					let data = await resp.json();
					console.log({ data });
					setStore({ users: data });
				}
			},

			deletePlan: async (id, type) => {
				let resp = await fetch(`${backendURL}/delete_plan/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				if (resp.status === 404) {
					console.log("No se puede eliminar el Plan");
					console.log(`No se puede eliminar el ${type}`);
				}
				if (resp.status === 200) {
					let dataPlans = await resp.json();
					console.log({ dataPlans });
					setStore({ plans: dataPlans });
				}
			},
			getFavorites: async () => {
				try {
					const response = await fetch(`${backendURL}/favorites`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${localStorage.getItem("token")}`
						}
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Planes favoritos:", data.favorites);
						return data.favorites;
					} else {
						const errorData = await response.json();
						console.error("Error al obtener favoritos:", errorData.msg);
						return [];
					}
				} catch (error) {
					console.error("Error en la solicitud:", error);
					return [];
				}
			},

			addFavorite: async (planId) => {
				const token = localStorage.getItem("token");
				try {
					const response = await fetch(`${backendURL}/favorites/${planId}`, {
						method: "POST", // Cambiar a POST para agregar un favorito
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});

					if (response.ok) {
						console.log("Favorito agregado exitosamente");
					} else {
						const errorData = await response.json();
						console.error("Error al agregar favorito:", errorData.msg);
						alert("Error al agregar favorito");
					}
				} catch (error) {
					console.error("Error en la solicitud:", error);
					alert("Error en la solicitud");
				}
			},

			removeFavorite: async (planId) => {
				const token = localStorage.getItem("token");
				try {
					const response = await fetch(`${backendURL}/favorites/${planId}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});

					if (response.ok) {
						console.log("Favorito eliminado exitosamente");
					} else {
						const errorData = await response.json();
						console.error("Error al eliminar favorito:", errorData.msg);
						alert("Error al eliminar favorito");
					}
				} catch (error) {
					console.error("Error en la solicitud:", error);
					alert("Error en la solicitud");
				}
			},
			registerTrip: async (tripPlan) => {

				
				try {
					const store = getStore()
					const response = await fetch(`${process.env.BACKEND_URL}/create-plan`, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${store.token}`
						},
						body: tripPlan
					})

					if (response.ok) {
						getActions().getPlansList()
					}
					return response.status

				} catch (error) {
					console.log(error)
				}
			}
		}
	}
};

export default getState;
