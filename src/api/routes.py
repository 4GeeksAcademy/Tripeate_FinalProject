"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, current_user
from flask_bcrypt import Bcrypt
from api.models import db, User, Plan, PlanStatus, TokenBlockedList
from api.utils import generate_sitemap, APIException
from os import getenv
from itsdangerous import URLSafeTimedSerializer as Serializer
from flask_cors import CORS
import os 
import requests
import json



app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.before_request
def verify_role():
    print("Checking role")



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# Ruta para formulario de registro de usuario
@api.route('/signup', methods=['POST'])
def signup_user():
    # Se reciben los datos de la petición
    body=request.get_json()
    if body['name'] is None:
        return jsonify({"msg":"El campo nombre y apellido es obligatorio"})
    if body['email'] is None:
        return jsonify({"msg":"Por especifique un correo electrónico"}),400
    # Se valida que se esta ingresando un usuario y contraseña
    if body['password'] is None:
        return jsonify({"msg":"Por favor especifique su contraseña"}),400
    
    existing_user = User.query.filter_by(email=body['email']).first()
    if existing_user:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    # Se encripta la contraseña
    body['password']=bcrypt.generate_password_hash(body['password']).decode('utf-8')
    # Se guarda en la base de datos 
    user = User(name=body['name'], last_name=body['last_name'], email=body['email'], password=body['password'], is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg":"Usuario creado con exito", "user": user.serialize()})

#Ruta para editar el usuario
@api.route('/update_user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    body=request.get_json()
    if body['name'] is None:
        return jsonify({"msg":"El campo nombre y apellido es obligatorio"})
    if body['email'] is None:
        return jsonify({"msg":"Debe especificar un correo electrónico"}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg":"Usuario no encontrado"}), 404
    #Validaciones de los datos que se quieren actualizar
    if 'name' in body and body['name'] is None:
        return jsonify({"msg":"El campo nombre es obligatorio"}), 400
    if 'email' in body and body['email'] is None:
        return jsonify({"msg":"Debe especificar un correo electrónico"}), 400
    #Si se proporciona un nuevo correo se valida que no esté ya registrado
    if 'email' in body and body['email'] != user.email:
        existing_user = User.query.filter_by(email=body['email']).first()
        if existing_user:
            return jsonify({"msg":"El correo electrónico ya está registrado"}), 400
    #Actualización de datos
    if 'name' in body:
        user.name = body['name']
    if 'last_name' in body:
        user.last_name = body['last_name']
    if 'email' in body:
        user.email = body['email']
    if 'password' in body and body['password'] is not None:
        user.password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    if 'profile_image' in body:
        user.profile_image = body['profile_image']
    db.session.commit()
    return jsonify({"msg":"Usuario actualizado con éxito", "user": user.serialize()})
    
    
# Ruta para formulario de inicio de sesión
@api.route('/login', methods=['POST'])
def user_login():
    body = request.get_json()
    if body["email"] is None:
        return jsonify({"msg":"Debe especificar un correo electrónico"}), 400
    # Se busca el usuario en la base de datos y se verifica que exista
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg":"Usuario no encontrado"}), 401
    # Se comparar la contraseña proporcionada por el usuario con un hash de contraseña almacenado previamente
    valid_password = bcrypt.check_password_hash(user.password, body["password"])
    if not valid_password:
        return jsonify({"msg": "Contraseña incorrecta"}), 401
    # Se crea y se retorna el token de la sesión
    token = create_access_token(identity=str(user.id), additional_claims={"is_admin": user.is_admin})
    return jsonify({"msg": "Login exitoso", "token": token, "Id": user.id, "user": user.serialize(), "is_admin": user.is_admin })

# Ruta para perfil del usuario
@api.route('/userinfo', methods=["GET"]) 
# Protege una ruta con jwt_required, bloquea las peticiones sin un JWT válido
@jwt_required()
# Accede a la identidad del usuario actual con get_jwt_identity
def protected():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    return jsonify({"msg":"Perfil del usuario"}, user.serialize()), 200


# Ruta para cierre de sesión
@api.route('/logout', methods=["POST"])
@jwt_required()
def user_logout():
    token_data = get_jwt()
    token_blocked = TokenBlockedList(jti = token_data["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg":"Sesión cerrada"}), 200


# Ruta para enviar email al correo para recuperar contraseña
@api.route('/requestpasswordrecovery', methods=['POST'])
def request_password_recovery():
    email = request.get_json()['email']
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    password_token = create_access_token(
        identity = str(user.id), additional_claims = {"type": "password"})
    frontend_url = getenv("FRONTEND_URL")
    
    url = frontend_url + 'changepassword?token=' + password_token
    print(url)
    # Envío de correo 
    send_mail_url = getenv("MAIL_SEND_URL")
    private_key = getenv("MAIL_PRIVATE_KEY")
    service_id = getenv("MAIL_SERVICE_ID")
    template_id = getenv("MAIL_TEMPLATE_ID")
    # User ID del servicio de correo 
    user_id = getenv("MAIL_USER_ID")
    data = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": user_id,
        "accessToken": private_key,
        "template_params": {
            "url": url
        }
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(
        send_mail_url, headers=headers, data=json.dumps(data))
    
    print(response.text)
    if response.status_code == 200:
        return jsonify({"msg":"Revise su correo para el cambio de clave"})
    else:
        return jsonify({"msg":"Ocurrio un error con el envio de correo "})
    
@api.route('changepassword', methods=['PATCH'])
@jwt_required()
def user_change_password():
    user = User.query.get(int(get_jwt_identity()))
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    new_password = request.get_json()['new_password']
    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.add(user)

    token_data = get_jwt()
    if token_data["type"]=="password":
        token_blocked = TokenBlockedList(jti=token_data["jti"])
        db.session.add(token_blocked)

    db.session.commit()

    return jsonify({"msg":"Password update"})

# Ruta para listar todos los usuarios existentes
@api.route('/users', methods=['GET'])
@jwt_required()  # Se proteje la ruta con JWT authentication
def get_users():
    # Verificar si el usuario actual es admin
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user.is_admin:
        return jsonify({"error": "Acceso no autorizado"}), 403
    users = User.query.all()  # Fetch todos los usuarios
    print(users)
    user_data = [user.serialize() for user in users]  # Serialize la data del usuario
    return jsonify({"users": user_data}), 200

# Ruta para formulario de registro de plan
@api.route('/create_plan', methods=['POST'])
@jwt_required()
def create_plan():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    # Obtener datos del formulario o del request JSON
    body = request.get_json()
    if body["name"] is None:
        return jsonify({"msg":"Debe especificar un Destino"}), 400
    name = body.get('name')
    caption = body.get('caption')
    image = body.get('image')
    type = body.get('type')
    available_slots = body.get('available_slots')
    status = body.get('status', PlanStatus.Pending)
    
# Validación de datos
    new_plan = Plan(
        name=name,
        caption=caption,
        image=image,
        type=type,
        user_id=current_user_id,
        available_slots=available_slots,
        status=status
    )
    db.session.add(new_plan)
    db.session.commit()
    return jsonify({"msg":"Plan creado exitosamente"}), 201


# Ruta para listar todos los planes existentes
@api.route('/plans', methods=['GET'])
def get_plans():
    plans = Plan.query.all()  # Fetch todos los planes
    plan_data = [plan.serialize() for plan in plans]  # Serialize plan data
    return jsonify({"plans": plan_data}), 200

#Ruta para traer el usuario creador del plan
@api.route('/plans/<int:plan_id>/user_email', methods=['GET'])
@jwt_required()
def get_user_email(plan_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Acceso denegado. Se requiere ser administrador."}), 403 
    plan = Plan.query.get(plan_id)
    if plan is None:
        return jsonify({"error": "Plan no encontrado"}), 404 
    user_email = plan.get_user_email()
    if user_email is None: 
        return jsonify({"error": "Usuario no asociado al plan"}), 404
    return jsonify({"user_email": user_email}), 200
    
    
# Ruta para listar manejar los planes existentes
@api.route('/manage_plan/<int:plan_id>', methods=['POST'])
@jwt_required()
def manage_plan(plan_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if request.method == "OPTIONS":
        return jsonify({"error":"error en el metodo"})
    action = request.json.get('action')
    if not action:
         return jsonify({"error": "Acción no proporcionada."}), 400
    if not user.is_admin:  
         return jsonify({"error": "No tienes permisos para gestionar planes."}), 403

    plan = Plan.query.get(plan_id)
    if plan:
         if action == 'accept':
             plan.status = PlanStatus.Accepted
         elif action == 'rejected':
             plan.status = PlanStatus.Rejected
         else:
            return jsonify({"error": "Acción no válida. Debe ser 'accept' o 'rejected'."}), 400 
    try:
            db.session.commit()
            return jsonify({"message": f"Plan {plan_id} ha sido {action}."}), 200
    except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error al actualizar el plan: {str(e)}"}), 500



# Ruta para eliminar un usuario
@api.route('/delete_user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user.is_admin:
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"msg":"Usuario eliminado exitosamente"})
        else: 
            return jsonify({"error":"Usuario no encontrado"})
    else:
        return jsonify({"error":"No autorizado"})

# Ruta para eliminar un plan
@api.route('/delete_plan/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_plan(plan_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    # verifica si el usuario es admin o dueño del plan 
    
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({"error": "Plan no encontrado"}), 404 
    is_owner =  plan.user_id == int(current_user_id)
    if current_user.is_admin or is_owner:
        db.session.delete(plan)
        db.session.commit()
        return jsonify({"msg": "Plan eliminado exitosamente"})
    else:
        return jsonify({"error": "No autorizado"}), print(f"User ID del plan: {plan.user_id}, User ID actual: {current_user_id}")



 
