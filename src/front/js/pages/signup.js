import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Signup = () => {
    const { store, actions } = useContext(Context);
    const [ validEmail, setValidEmail ] = useState(true)
    const [ validName, setValidName ] = useState(true)
    const [ validPassword, setValidPassword ] = useState(true)
    const [ validPswConf, setValidPswConf ] = useState(true)
    const [ validUser, setValidUser ] = useState(true)
    const [ userLoginMsg, setUserLoginMsg ] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{
        store.whereiam="Signup";
    },[])

    const clearStates = () => {
        setValidEmail(true);
        setValidName(true);
        setValidPassword(true);
        setValidPswConf(true);
        return
    }

    const verifyForm = (email,userName,password) => {
        const regex = /[a-zA-Z]/
        const atChar = email.includes('@');
        const dotChar = email.includes('.');
        const alphaEmail = regex.test(email)
        
        if (userName.length ==0){
            setValidName(false);
            document.getElementById('userName').focus();
            return false}
        else { setValidName(true)}

        if (!alphaEmail || !atChar || !dotChar ) {
            setValidEmail(false)
            document.getElementById('email').focus();
            return false} 
        else { setValidEmail(true); }

        if (password.length < 6 || !password.match(/\d/) || !regex.test(password)) {
            setValidPassword(false);
            document.getElementById('inputPassword').focus();
            return
        }
                 
        return true
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userName = e.target.userName.value;
        const email=e.target.email.value;
        const password=e.target.inputPassword.value;
        const confirmPassword = e.target.confirmPassword.value;
        clearStates();

        if (password != confirmPassword ) {
            setValidPswConf(false)
            document.getElementById('confirmPassword').focus();
            return
        }

        const formOk = verifyForm(email,userName,password);
        if (!formOk) {
            return
        }

        const signUpBody = JSON.stringify({'user_name':userName,'email':email,'password':password});
            const response = await fetch(`${backend}api/signin`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: signUpBody
                })
            const signUpResponse = await response.json();
            if (response.status != 200) {
                setUserLoginMsg(signUpResponse.msg);
                document.getElementById('userName').focus();
                return
                } else {
                    setUserLoginMsg('Usuario creado exitosamente')
                    store.whereiam="Login";
                    setTimeout(() => navigate('/login'), 2000);
                }
            
            return
            }    

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
            <div className="card-body text-center">
                <Navbar />
                <h1 className="mb-3">Cree su Cuenta</h1>
    
                <form noValidate onSubmit={handleSignUp}>
                    <div className="mb-3 text-start">
                        <label htmlFor="userName" className="form-label fw-bold">Nombre de usuario</label>
                        <input type="text" className="form-control" id="userName" />
                        {!validName && <div className="alert alert-danger mt-2 p-2">Ingresa un nombre de usuario</div>}
                    </div>
    
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label fw-bold">Correo</label>
                        <input type="email" className="form-control" id="email"/>
                        {!validEmail && <div className="alert alert-danger mt-2 p-2">Formato de Email inválido, inténtalo de nuevo</div>}
                    </div>
    
                    <div className="mb-3 text-start">
                        <label htmlFor="inputPassword" className="form-label fw-bold">Contraseña</label>
                        <input type="password" className="form-control" id="inputPassword" />
                        {!validPassword 
                            ? <div className="alert alert-danger mt-2 p-2">La contraseña debe ser mayor de 6 caracteres y contener letras y números</div> 
                            : <div className="alert alert-info mt-2 p-2">Contraseña mayor de 6 caracteres, incluyendo letras y números</div>}
                    </div>
    
                    <div className="mb-3 text-start">
                        <label htmlFor="confirmPassword" className="form-label fw-bold">Confirma tu contraseña</label>
                        <input type="password" className="form-control" id="confirmPassword" />
                        {!validPswConf && <div className="alert alert-danger mt-2 p-2">Las contraseñas no coinciden, inténtalo de nuevo</div>}
                    </div>
    
                    <button type="submit" className="btn btn-primary w-100">Darse de alta</button>
    
                    {userLoginMsg && <div className="alert alert-success mt-3">{userLoginMsg}</div>}
                </form>
            </div>
        </div>
    </div>
    
    )
}