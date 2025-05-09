import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import articleContext from '../context/articles/articleContext';
import Home from './Home';







const Navbar = () => {


    const [query, setQuery] = useState('');
    const context = useContext(articleContext);

    const { fetchNews, toggleLogin, setToggleLogin } = context;

    const handleOnChange = async (e) => {
        setQuery(e.target.value);
    }

    const handleOnSubmit = async (e) => {

        e.preventDefault();

        const searchQuery = query.trim();
        console.log(searchQuery);

        if (query.length > 0)
            await fetchNews({ personalised: false, search: searchQuery });
    }

    const handleLogOut = async (e) => {
        localStorage.removeItem("token");
        <Home />
    }

    const handleToggleLogin = async (e) => {
        setToggleLogin(!toggleLogin);
    }


    return (
        <nav className="navbar bg-primary" data-bs-theme="light">
            <div className="container-fluid">
                <div>
                    <Link className="navbar-brand" style={{ color: 'white' }}>NewsSphere</Link>
                </div>

                {/* <div id="categories" className='d-flex'>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </div> */}

                <div className='d-flex justify-content-evenly' style={{ width: '30%' }}>
                    {
                        localStorage.getItem('token') &&
                        <form className="d-flex" role="search" onSubmit={handleOnSubmit}>
                            <input className="form-control me-2" type="search" onChange={handleOnChange} placeholder="Search" value={query} aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit" style={{ color: 'white', borderColor: 'white' }}>Search</button>
                        </form>

                    }

                    {
                        localStorage.getItem('token')
                            ?
                            <button className="btn btn-outline-success" type="submit" style={{ color: 'white', borderColor: 'white' }} onClick={handleLogOut}>Logut</button>
                            :
                            (
                                toggleLogin ?
                                    <button className="btn btn-outline-success" type="submit" style={{ color: 'white', borderColor: 'white' }} onClick={handleToggleLogin}>Sign up</button>
                                    :
                                    <button className="btn btn-outline-success" type="submit" style={{ color: 'white', borderColor: 'white' }} onClick={handleToggleLogin}>Login</button>

                            )


                    }
                </div>
            </div>
        </nav >
    )
}

export default Navbar 