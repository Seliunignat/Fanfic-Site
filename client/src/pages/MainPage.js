import React, { useContext } from 'react'
import {Navbar} from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import { useAuth } from '../hooks/auth.hook'

export const MainPage = () => {
    //const {token} = useAuth()
    //const isAuthenticated = !!token

    return(
        <>
        <Navbar windowPage={"/main"}></Navbar>
        <div className="bg-light">
            <h1>Main Page</h1>
            <button className="btn btn-primary">Action</button>
        </div>
        </>
    )
}