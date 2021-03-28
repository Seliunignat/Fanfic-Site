import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import { useRoutes } from "./routes";
import{ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loader";


function App() {
    const {token, login, logout, userId, username, email, isBanned, isAdmin, ready} =  useAuth()
    console.log("token: " + token)
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if(!ready){
      return (<Loader></Loader>)
    }

    return (
      <AuthContext.Provider value={{token, login, logout, userId, isAuthenticated, isBanned, isAdmin, username}}>
        <Router>
          {/* <Navbar isAuthenticated={isAuthenticated}></Navbar> */}
          <>
            {routes}
          </>
          <ToastContainer></ToastContainer>
        </Router>
      </AuthContext.Provider>
    );
}

export default App;