"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def sign_up():
    data = request.json

    user_name = data.get("user_name")
    email = data.get("email")
    password = data.get("password")

    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if user_exist==None:
        password_hash = generate_password_hash(password)

        new_user = User(
            user_name = user_name,
            email=email,
            password_hash=password_hash,
            
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            return jsonify({"message": "Error saving user to database"}), 500

        return jsonify({
            "user": new_user.serialize(),
            "message": "Registration completed successfully, you will be redirected to the Log-in"
        }), 200
    else:
        return jsonify({"msg":"Credenciales de usuario ya existente, intenta de nuevo"}),400


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if user_exist==None:
        return jsonify({"msg":"invalid user or password"}),400

    user=user_exist[0]
    valid_password = check_password_hash(user.password_hash,password)
    if valid_password !=True :
        return jsonify ({'msg':'invalid user or password, try again'}),400
    access_token = create_access_token(identity=user.email)
    return jsonify ({'access token':access_token}),200


@api.route('/users/me', methods=['GET'])
@jwt_required()
def profile():
    email=get_jwt_identity()
    user_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    return jsonify(user_exist[0].serialize()),200