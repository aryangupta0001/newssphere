import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import articleContext from '../context/notes/articleContext'


const Signup = () => {

    const HOST = "http://127.0.0.1:5173";

    const context = useContext(articleContext);
    const navigate = useNavigate();

    const { showAlert, setToggleLogin } = context;

    const [credentials, setCred] = useState({ username: "", email: "", password: "", cnfpassword: "" });

    const onChange = (e) => {
        setCred({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password } = credentials;

        setCred({ username: "", email: "", password: "", cnfpassword: "" });

        const response = await fetch(`${HOST}/api/auth/createuser`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ username, email, password })
        });

        const json = await response.json();

        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            showAlert({ type: "User", operation: "Signup" });
            document.getElementById("signUpForm").reset();
        }
        else {
            alert(json.error);
            document.getElementById("signUpForm").reset();
            navigate("/");
        }
    }


    return (
        <div className="w-50 m-auto">
            <h1 className="mt-5 fw-bold fs-1 mb-0"><center>Welcome To NotesCloud</center></h1>
            <div className='container my-5 m-auto mb-0'>
                <form onSubmit={handleOnSubmit} id='signUpForm'>
                    <div className='py-5 m-auto' style={{ width: "50%", boxShadow: "0 10px 24px hsla(0,0%,0%,0.05), 0 20px 48px hsla(0, 0%, 0%, 0.05), 0 1px 4px hsla(0, 0%, 0%, 0.1)", }}  >
                        <div className="m-auto" style={{ width: "90%" }}>
                            <label htmlFor="name" className="form-label fw-semibold fs-5 d-inline" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }}>User Name</label>
                            <span className={`${credentials.username.length >= 5 && 'd-none'} text-danger`}>&emsp;[Min. 5 characters]</span>
                            <input type="text" className="form-control m-auto" id="username" name="username" aria-describedby="username" value={credentials.username} onChange={onChange} />
                        </div>

                        <div className="m-auto mt-3 mb-3" style={{ width: "90%" }}>
                            <label htmlFor="email" className="form-label fw-semibold fs-5 d-inline" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }}>Email address</label>
                            <input type="email" className="form-control m-auto" id="email" name="email" aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                        </div>

                        <div className="m-auto mt-3 mb-3" style={{ width: "90%" }}>
                            <label htmlFor="password" className="form-label fw-semibold fs-5 d-inline" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }}>Password</label>
                            <span className={`${credentials.password.length >= 5 && 'd-none'} text-danger`}>&emsp;[Min. 5 characters]</span>
                            <input type="password" className="form-control m-auto" id="password" name='password' value={credentials.password} onChange={onChange} autoComplete='on' />
                        </div>

                        <div className="m-auto mt-3 mb-3" style={{ width: "90%" }}>
                            <label htmlFor="password" className="form-label fw-semibold fs-5 d-inline" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI Adjusted", "Segoe UI", "Liberation Sans", sans-serif' }}>Confirm Password</label>
                            <span className={`${credentials.cnfpassword.length >= 5 && 'd-none'} text-danger`}>&emsp;[Min. 5 characters]</span>
                            <span className={`${(credentials.cnfpassword.length > 0 && credentials.password !== credentials.cnfpassword) ? "d-inline" : "d-none"} text-danger`}>&emsp;[Password & Confirm Password do not match]</span>
                            <input type="password" className="form-control m-auto" id="cnfpassword" name='cnfpassword' value={credentials.cnfpassword} onChange={onChange} autoComplete='on' />
                        </div>

                        <button type="submit" className="btn btn-primary m-auto d-block mt-3" style={{ width: "83%" }}>Submit</button>
                    </div>
                </form>

                <center className='mt-5'>
                    Already have an account ?
                    <button className="navbar-brand text-primary" onClick={() => { setToggleLogin(true) }} style={{ border: "none", background: "none" }}>&nbsp; Login In</button>

                </center>

            </div >
        </div >
    )
}

export default Signup