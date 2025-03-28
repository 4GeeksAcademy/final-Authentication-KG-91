import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Private = () => {
    const { store, actions } = useContext(Context);
    const token = localStorage.getItem('token')
    const [userName, setUserName] = useState('')
    const navigate = useNavigate()

    useEffect(()=> {
        const fetchData = async(token) => {
            const response = await fetch(`${backend}api/users/me`,{
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  }            })
            const userResponse = await response.json();
            setUserName(userResponse.name);
            return
            }
        
        if (!token) { 
            store.whereiam='Home';
            navigate('/')
            
        } 
        store.whereiam='Private';
        fetchData(token);
        },[])
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4 text-center" style={{ maxWidth: "500px", width: "100%" }}>
                <Navbar />
                <div className="card-body">
                    <h1 className="fw-bold">Bienvenido, {userName}!</h1>
                    <p className="text-muted">esta es su página personal.</p>
                </div>
            </div>
        </div>

    )

}