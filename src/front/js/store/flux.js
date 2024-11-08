const backendURL = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			users: [],
			plans: []
			
		},
		actions: {

			registerUser: async (userData) => {
				try {
				  const response = await fetch("", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json"
					},
					body: JSON.stringify(userData)
				  });
				  if (!response.ok) throw new Error("Error al registrar usuario");	
				  const data = await response.json();
				  console.log("Usuario registrado con éxito:", data);
				  // Actualiza el estado del usuario en el store
				  setStore({ user: data });
				  return data;
				} catch (error) {
				  console.error("Error en el registro:", error);
				  return null;
				}
			  },

			getUsersList: async () => {
				let resp = await fetch(backendURL + "/users", {
					method: "GET",
					headers: {
						"Content-Type":"aplication/json",
					  }
				});
				if (resp.ok) {
					let dataUsers = await resp.json();
					console.log({dataUsers})
					setStore({users: dataUsers.users})
				}
			},

			getPlansList: async () => {
				let resp = await fetch(backendURL + "/plans", {
					method: "GET",
					headers: {
						"Content-Type":"aplication/json",
					}
				});
				if (resp.ok) {
					let dataPlans = await resp.json();
					console.log({dataPlans})
					setStore({plans: dataPlans.plans})
				}
			},
		}
	};
};

export default getState;
