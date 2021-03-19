import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Loader } from "../components/Loader";
import { FanficList } from "../components/FanficList";



export const UserPage = () => {
//   const config = require('config')
  const jwt = require('jsonwebtoken')
  const auth = useContext(AuthContext);
  const history = useHistory();
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const theme = localStorage.getItem("theme-color");
  const [user, setUser] = useState(null);
  const userIdParams = useParams().id;

//    const dataFromToken = jwt.verify(auth.token, config.get('jwtSecret'))
    var isCurrentUserAdmin = false;
    if(auth.token){
      const dataFromToken = jwt.verify(auth.token, "ignat fanfic site")

      isCurrentUserAdmin = dataFromToken.isAdmin
    }
    
    //console.log(isCurrentUserAdmin)

  // const checkUserStatus = async () => {
  //     try {
  //         const data = await request(
  //             `/api/auth/user/${auth.userId}`,
  //             "get",
  //             null,
  //             {
  //                 Authorization: `Bearer ${auth.token}`,
  //             }
  //         );
  //         if (data.isBanned) auth.logout();
  //     } catch (e) {
  //         message("User doesn't exist");
  //         auth.logout();
  //     }
  // };

  const getUserData = useCallback(async () => {
    try {
        //console.log(userIdParams)
      const data = await request(`/api/auth/user/${userIdParams}`, 'GET', null);
      //console.log(data);
    //   setForm({_id, username, avatar, email, isBanned, isAdmin, texts})
        setUser(data);
    } catch (e) {
      console.log(e.message);
    }
  }, [request, userIdParams]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(()=>{
    // console.log(currentTextAndIndex.text)
    //console.log(user)
  }, [user])


  if (loading) {
    return <Loader />;
  }

  // useEffect(() => {
  //     if (auth.userId) {
  //         checkUserStatus();
  //         return;
  //     }
  // }, [auth]);

 

  // useEffect(() => {
  //     message(error);
  //     clearError();
  //     GetAllTexts();
  // }, [error, message, clearError]);

  const redirectToCreateTextPage = () => {
    history.push("/createTextPage");
  };

  return (
    <>
      <Navbar windowPage={"/user"}></Navbar>
      <main>
        <section className="userImageSection">
          <section className="border-bottom">
            <div className="container">
              <div className="p-5 text-center bg-image rounded-bottom shadow-lg"></div>
            </div>
            <div className="d-flex justify-content-center">
              <img
                src={(user && user.avatar) ? user.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" }
                alt=""
                className="rounded-circle  position-absolute avatar"
              ></img>
              <div
                className="container text-center shadow-sm"
                style={{ width: "35rem", height: "4rem", marginTop: "1.5rem" }}
              >
                <h2 className="pt-3">{user && user.username}</h2>
              </div>
            </div>
          </section>
          {/* <section className="d-flex justify-content-center my-1">
                    <button className="btn btn-dark" onClick={redirectToCreateTextPage}>Create new fanfic</button>
                </section>                                */}
        </section>
        <section className="userFanficsSection ml-2  d-flex justify-content-center mb-4">
          <div className="card cardFanfics dShadow">
            <div className="border-bottom d-flex justify-content-center">
              <div></div>
              <h1 className="text-center">
                {user && auth && (auth.username === user.username)
                  ? "My "
                  : (user ? user.username + "'s " : "")}
                Fanfics
              </h1>
              {user &&
                ((auth.username === user.username) || isCurrentUserAdmin) &&
                (theme === "dark" ? (
                  <button
                    className="btn btn-light ms-5 w-auto my-auto"
                    onClick={redirectToCreateTextPage}
                  >
                    Create new
                  </button>
                ) : (
                  <button
                    className="btn btn-dark ms-5 w-auto my-auto"
                    onClick={redirectToCreateTextPage}
                  >
                    Create new
                  </button>
                ))}
            </div>
            <div className="container">
              {!loading && <FanficList user={user} isCurrentUserAdmin={isCurrentUserAdmin}></FanficList>}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
