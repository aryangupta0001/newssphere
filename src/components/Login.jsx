import React, { useState, useContext } from 'react'
import articleContext from '../context/articles/articleContext'
import { Link, useLocation } from 'react-router-dom';
import './Login.css'


const Login = () => {
    const HOST = "http://127.0.0.1:5173";

    const [credentials, setCred] = useState({ email: "", password: "" });

    const context = useContext(articleContext);
    const { setToggleLogin, userAuth } = context;


    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = credentials;
        setCred({ email: "", password: "" });

        try {
            const response = await fetch(`${HOST}/api/auth/login`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (json.success) {
                localStorage.setItem("token", json.jwtToken);
                userAuth();
                showAlert({ type: "User", operation: "Login" });
            }
            else {
                alert("Invalid Credentials")
            }
        } catch (error) {

            alert("Error in console");
            console.log("Error in logging in : ", error);
        }

    }

    const onChange = async (e) => {
        setCred({ ...credentials, [e.target.name]: e.target.value });
    }


    return (
        <>
            <div className="w-50 m-auto">
                <h1 className="mt-5 fw-bold fs-1 mb-0"><center>Welcome To NewsSphere</center></h1>
                <div className='container my-5 m-auto' >
                    <form onSubmit={handleOnSubmit}>
                        <div className='py-5 m-auto' style={{ width: "50%", boxShadow: "0 10px 24px hsla(0,0%,0%,0.05), 0 20px 48px hsla(0, 0%, 0%, 0.05), 0 1px 4px hsla(0, 0%, 0%, 0.1)" }}  >
                            <div className="m-auto" style={{ width: "83%" }}>
                                <label htmlFor="email" className="form-label d-block fw-semibold fs-5" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }}>Email</label>
                                <input type="email" className="form-control m-auto" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                            </div>
                            <div className="m-auto mt-3 mb-3 " style={{ width: "83%" }}>
                                <label htmlFor="password" className="form-label d-block fw-semibold fs-5" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }} >Password</label>
                                <input type="password" className="form-control m-auto" id="password" name='password' value={credentials.password} onChange={onChange} />
                            </div>
                            <button type="submit" className="btn btn-primary m-auto d-block mt-3" style={{ width: "83%" }}>Log In</button>
                        </div>
                    </form>

                    <center className='mt-5'>
                        Don't have an account ?
                        <button className="navbar-brand text-primary" onClick={() => { setToggleLogin(false) }} style={{ border: "none", background: "none" }}>&nbsp; Sign Up</button>
                    </center>

                </div >
            </div>
        </>
    )
}

export default Login