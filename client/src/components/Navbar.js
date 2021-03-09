import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../context/AuthContext"
import {NavLink, Redirect, Route, Switch, useHistory} from 'react-router-dom'
import {AuthPage} from '../pages/AuthPage'
import { useAuth } from '../hooks/auth.hook'

export const Navbar = (props) => {
    //const isUserAuthenticated = props.isAuthenticated
    const history = useHistory()

    // const {token, login, logout, userId, username, email, isBanned} =  useAuth()
    
    const [currentUserName, setCurrentUserName] = useState(null)

    const auth = useContext(AuthContext)
    const isUserAuthenticated = !!auth.token
    //console.log("auth: " + JSON.stringify(auth))
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
       // window.location.href = "/main"
       history.push("/main")
    }

    const goToUserPage = () => {
        //window.location.href = "/user"
        history.push("/user")
    }
    
    useEffect(() => {
        if (auth.username) {
            console.log('auth: '+ auth.username)
            //console.log(JSON.stringify(auth.username))
            setCurrentUserName(auth.username)
            return;
        }
    }, [auth.username]);
        

    useEffect(() => {
        console.log("currentWindowPage: " + currentWindowPage)
        const data = JSON.parse(localStorage.getItem('userData'))
        if(data && data.token) {
            //currentUserName = JSON.parse(localStorage.getItem('userData')).username
            //console.log(data)
        }
    }, [currentWindowPage])

    return (
        <nav className="navbar navbar-light dShadow" style={{background: '#e3f2fd', zIndex: 1} }>
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
                    <div className="row align-items-center" >
                        {currentWindowPage === "/main" && 
                            <>
                                <div className="col mx-auto my-auto ">
                                    <h5 align-items-center>{currentUserName}</h5>                                    
                                </div>
                                <div className="col mx-auto my-auto">
                                    <NavLink to="/user"><i className="fa fa-user" ></i></NavLink>
                                </div>
                            </>
                        }
                        {currentWindowPage !== "/main" && 
                            <div className="col mx-auto my-auto">
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