import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";






const Navbar = () => {
    // let location = useLocation();
    // const navigate = useNavigate();
    // const [logo, setLogo] = useState(false);
    // const [profile, setProfile] = useState(false)


    // useEffect(() => {
    //     let target1 = document.getElementById("userProfile");
    //     let target2 = document.getElementById("logo");

    //     const handleOutsideClick = (event) => {
    //         if (profile) {
    //             if (!target1.contains(event.target)) {
    //                 setProfile(false);
    //             }
    //         }
    //         else {
    //             if (target2.contains(event.target)) {
    //                 setProfile(true);
    //             }
    //         }
    //     }

    //     document.addEventListener("click", handleOutsideClick);

    //     return () => {
    //         document.removeEventListener('click', handleOutsideClick);
    //     };

    // })

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     showAlert({ type: "User", operation: "Logout" });
    //     navigate("/");
    //     setProfile(false);
    // }

    // const handleCreateNotes = () => {
    //     navigate("/");

    //     setTimeout(() => {
    //         const target = document.getElementById("title");
    //         console.log(target);

    //         if (target) {
    //             target.focus();
    //             setProfile(false);
    //         }
    //     }, 0);

    // }


    // const handleChangePassword = () => {
    //     navigate("/changePass");

    //     setTimeout(() => {
    //         const target = document.getElementById("password");
    //         console.log(target);

    //         if (target) {
    //             target.focus();
    //             setProfile(false);
    //         }
    //     }, 0);
    // }


    return (
        <nav className="navbar bg-primary" data-bs-theme="light">
            <div className="container-fluid">
                <Link className="navbar-brand" style={{ color: 'white' }}>NewsSphere</Link>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit" style={{ color: 'white', borderColor: 'white' }}>Search</button>
                </form>
            </div>
        </nav>
    )
}

export default Navbar