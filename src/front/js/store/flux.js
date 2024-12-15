const backendURL = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	const storedUser = localStorage.getItem("currentUser")
	return {
		store: {
			pendingPlans: [],
			user: null,
			token: localStorage.getItem("token") ?? null,
			currentUser: JSON.parse(localStorage.getItem("currentUser")) ?? null,
			users: [],
			plans: [],
			itemType: null,

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
						return true; // Éxito
					} else {
						console.error("Error al cerrar sesión");
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

			submitTrip: async (formData, token) => {
				try {
				  const response = await fetch("https://glowing-fiesta-jj4gv9j44xg6hpv5p-3001.app.github.dev/api/create_plan", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json", // Especificamos que estamos enviando JSON
					  "Authorization": `Bearer ${token}`, // Agregamos el token de autenticación
					},
					body: JSON.stringify({
					  name: formData.name,
					  caption: formData.caption,
					  image: formData.image,
					  type: formData.type,
					  available_slots: formData.available_slots,
					}), // Enviamos los datos del formulario como JSON
				  });
			  
				  if (response.ok) {
					const result = await response.json();
					alert(result.msg); // Muestra el mensaje del backend
					const store = getStore();
					setStore({
					  pendingPlans: [
						...store.pendingPlans,
						{ ...formData, status: "Pending" }, // Guarda el nuevo plan en el estado
					  ],
					});
				  } else {
					const error = await response.json();
					alert("Error al registrar el plan: " + error.msg);
				  }
				} catch (error) {
				  console.error("Error de conexión:", error);
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
			}
		}
	};
};

export default getState;
