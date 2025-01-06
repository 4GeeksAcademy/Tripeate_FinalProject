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
						console.log("Usuario registrado:")
						return data;
					} else {
						const errorData = await response.json();
						console.error("Error en el registro:", errorData.msg);
						return { error: true, msg: errorData.msg }; 
					}
				} catch (error) {
					console.error("Error en el registro:", error);
					return { error: true, msg: "Error en la solicitud" }; 
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
						console.log("Inicio de sesión exitoso");
						setStore({ currentUser: data.user, token: data.token })
						localStorage.setItem("currentUser", JSON.stringify(data.user));
						return { success: true, token: data.token, userId: data.Id, is_admin: data.is_admin };
					} else {
						const errorData = await response.json();
						console.error("Error en el inicio de sesión:", errorData.msg);
						return { error: true, msg: errorData.msg }; 
					}
				} catch (error) {
					console.error("Error en la solicitud de inicio de sesión:", error);
					return { error: true, msg: "Error en la solicitud" };
				}
			},

			logoutUser: async () => {
				const store = getStore();
				try {
					const response = await fetch(backendURL + "/logout", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.token}` 
						}
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ token: null, user: null }); 
						localStorage.removeItem('currentUser')
						localStorage.removeItem('token')
						return true; 
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
					const response = await fetch(backendURL + "/requestpasswordrecovery", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email }),
					});
					if (response.ok) {
						const data = await response.json();
						console.log("Solicitud de recuperación de contraseña enviada");
						return { success: true };
					} else {
						const errorData = await response.json();
						console.error("Error en la solicitud de recuperación de contraseña:", errorData.msg);
						return { success: false, msg: errorData.msg };  
					}
				} catch (error) {
					console.error("Error en la solicitud de recuperación de contraseña:", error);
					return { success: false, msg: "Hubo un error al procesar tu solicitud. Intenta nuevamente." };
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

			setCurrentUser: (newUserData) => {
                const store = getStore();
                setStore({ currentUser: { ...store.currentUser, ...newUserData } });
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
						console.log("Plan creado");
						return data; // Devuelve los datos si la creación fue exitosa
					} else {
						const errorData = await response.json();
						console.error("Error al crear el plan:", errorData.msg);
						return { error: true, msg: errorData.msg };
					}
				} catch (error) {
					console.error("Error en la creación del plan:", error);
					return { error: true, msg: "Error en la solicitud" };
				}
			},

			getPlansList: async () => {
				try {
					let resp = await fetch(backendURL + "/plans", {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (resp.ok) {
						const dataPlans = await resp.json();
						setStore({ plans: dataPlans.plans })
						console.log("Planes en el store:", getStore().plans);
						return dataPlans.plans

					} else {
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
					const bodyRequest = { "action": action }
					const headers = {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					}
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
						method: "POST", 
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
						alert("Error al eliminar favorito");
					}
				} catch (error) {
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
