import React, { useContext, useEffect, useState } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

const backend=process.env.BACKEND_URL

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [ validEmail, setValidEmail ] = useState(true)
    const [ validUser, setValidUser ] = useState(true)
    const [ successLogin, setSuccessLogin ] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        store.whereiam='Login';
    },[])

    const verifyForm = (email) => {
        const regex = /[a-zA-Z]/
        const atChar = email.includes('@');
        const dotChar = email.includes('.');
        const alphaEmail = regex.test(email)
        if (!alphaEmail || !atChar || !dotChar ) {
            setValidEmail(false)
            const emailElement = document.getElementById('email');
            emailElement.focus();
            return false} 
        else {
                setValidEmail(true);
            return true }
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        const email=e.target.email.value
        const password=e.target.inputPassword.value
        const formOk = verifyForm(email)
        
        if (!formOk) {return}
        
        const signUpBody = JSON.stringify({'email':email,'password':password})
            const response = await fetch(`${backend}api/login`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: signUpBody
                })
            const logInResponse = await response.json();
            const token=logInResponse['access token']
            localStorage.setItem('token', token);
            if (response.status != 200) {
                setValidUser(false)
                document.getElementById('inputPassword').value="";
                document.getElementById('email').focus()
                } else {
                    setValidUser(true)
                    setSuccessLogin(true)
                    store.whereiam='Private';
                    setTimeout(() => navigate('/private'), 2000);
                }
            //store.whereiam='Private';
            return
            }    
        
    return (
<div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body text-center">
            <Navbar />
            <h1 className="mb-3">Iniciar sesión</h1>
            <p className="text-muted">Ingrese su correo y contraseña</p>
            
            <form noValidate onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                    <label htmlFor="email" className="form-label fw-bold">Correo</label>
                    <input type="email" className="form-control" id="email" />
                    {!validEmail && <div className="alert alert-danger mt-2 p-2">Correo inválido, inténtelo de nuevo</div>}
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="inputPassword" className="form-label fw-bold">Contrseña</label>
                    <input type="password" className="form-control" id="inputPassword" />
                </div>

                <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
            </form>

            {!validUser && <div className="alert alert-danger mt-3">Correo o contraseña inválidos, inténtelo de nuevo</div>}
            {successLogin && <div className="alert alert-success mt-3">Redirigiendo a página privada...</div>}
        </div>
    </div>
</div>

    )
}