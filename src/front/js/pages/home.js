import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Navigate,useNavigate } from "react-router-dom";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";

const backend=process.env.BACKEND_URL

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	
	useEffect(()=>{
		const fetchData = async(token) => {
            const response = await fetch(`${backend}api/users/me`,{
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  }            })
			if (response.status != 200) {
				localStorage.removeItem('token');
				store.whereiam='Login';
				navigate('/login')
			} else {
					store.whereiam='Private';
					navigate('/private')}
				}
		store.whereiam='Home';
		const token=localStorage.getItem('token',token);
		if (!token) {
				store.whereiam='Login';
				navigate('/login')
		}
		fetchData(token);
		return

	},[])

	return (
		<div className="text-center mt-5">
			<Navbar />
			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);
};