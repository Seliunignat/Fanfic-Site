import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../context/AuthContext"
import {NavLink, Redirect, Route, Switch, useHistory} from 'react-router-dom'
import {AuthPage} from '../pages/AuthPage'
import { useAuth } from '../hooks/auth.hook'

export const Navbar = (props) => {
    const history = useHistory()
    
    const [currentUserName, setCurrentUserName] = useState(null)

    const auth = useContext(AuthContext)
    const isUserAuthenticated = !!auth.token
    const currentWindowPage = props.windowPage


    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push("/main")
    }

    const redirectToLoginPage = () => {
        window.location.href = "/login"
    }
    
    const redirectToMainPage = () => {
       history.push("/main")
    }

    const goToUserPage = () => {
        history.push("/user")
    }
    
    useEffect(() => {
        if (auth.username) {
            console.log('auth: '+ auth.username)
            setCurrentUserName(auth.username)
            return;
        }
    }, [auth.username]);
        

    // useEffect(() => {
    //     console.log("currentWindowPage: " + currentWindowPage)
    //     const data = JSON.parse(localStorage.getItem('userData'))
    //     if(data && data.token) {
    //         //currentUserName = JSON.parse(localStorage.getItem('userData')).username
    //         //console.log(data)
    //     }
    // }, [currentWindowPage])

    return (
        <nav className="navbar sticky-top navbar-light dShadow" style={{background: 'white', zIndex: 1} }>
            <div className="container-fluid">
                <h1 className="navbar-brand" style={{fontSize: 40}}>Мордор</h1>
                <form className="d-flex">
                {!(currentWindowPage === "/login" || currentWindowPage === "/registration") && 
                    <>
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button className="btn btn-outline-success me-2">Search</button>
                    </>
                }
                </form>
                {/* {console.log('isAuthenticated: ' + JSON.stringify(isAuthenticated))} */}
                
                {isUserAuthenticated && 
                    <div className="d-flex" >
                        {currentWindowPage === "/main" && 
                            <>
                                <div className="col mx-auto my-auto ">
                                    <h5 className="mt-2 me-1">{currentUserName}</h5>                                    
                                </div>
                                <div className="col me-2">
                                    <NavLink to="/user"><i className="fa fa-user" ></i></NavLink>
                                </div>
                            </>
                        }
                        {currentWindowPage !== "/main" && 
                            <div className="col me-2">
                                <NavLink to="/main"><i className="fa fa-home" ></i></NavLink>
                            </div>
                        }
                        <div className="col mx-auto">
                            <a href="/">
                                <button className="btn btn-outline-primary" onClick = {logoutHandler}>
                                    Logout
                                </button></a>
                        </div>
                    </div>
                }
                {(currentWindowPage === "/login" || currentWindowPage === "/registration") && 
                    (!isUserAuthenticated.value && <button className="btn btn-outline-primary" onClick={redirectToMainPage}
                    >To Main</button>)
                }
                {!isUserAuthenticated && 
                !(currentWindowPage === "/login" || currentWindowPage === "/registration") && <NavLink to="/login"><button className="btn btn-outline-primary"
                >Login</button></NavLink>
                }
            </div>
        </nav>
    )
}