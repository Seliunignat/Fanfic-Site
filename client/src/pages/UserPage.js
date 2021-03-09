import React, {useContext, useEffect} from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/Navbar'
import { NavLink, useHistory } from 'react-router-dom';

export const UserPage = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    // useEffect(() => {
    //     if (auth.token) {
    //         //checkUserStatus();
    //         return;
    //     }
    //     window.location.pathname = "/main"
    // }, [auth.token]);
    const redirectToCreateTextPage = () => {
        history.push('/createTextPage')
    }

    return(
        <>
        <Navbar windowPage={"/user"}></Navbar>
        <section>
            <div className="card customCard dShadow">
                <h1>User Page</h1>
                <button className="btn btn-primary" onClick={redirectToCreateTextPage}>Create new fanfic</button>
            </div>
            <div className="card customCard dShadow">
                <a>Hey</a>
            </div>
        </section>
        </>
    )
}