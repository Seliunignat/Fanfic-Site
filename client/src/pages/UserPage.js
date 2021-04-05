import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Loader } from "../components/Loader";
import { FanficList } from "../components/FanficList";
import { Next } from "react-bootstrap/esm/PageItem";

export const UserPage = () => {
  //   const config = require('config')
  const jwt = require("jsonwebtoken");
  const auth = useContext(AuthContext);
  const history = useHistory();
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("theme-color") || "light"
  );
  const [user, setUser] = useState(null);
  const userIdParams = useParams().id;
  const [drag, setDrag] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  //    const dataFromToken = jwt.verify(auth.token, config.get('jwtSecret'))
  var isCurrentUserAdmin = false;
  if (auth.token) {
    const dataFromToken = jwt.verify(
      auth.token,
      process.env.REACT_APP_jwtSecret,
      function (error, decoded) {
        if (error) {
          console.log("Срок действия токена закончен");
          message("Срок действия токена закончен")
          history.goBack();
          auth.logout();
        } else {
          isCurrentUserAdmin = decoded && decoded.isAdmin;
        }
      }
    );

    // console.log(dataFromToken)
  }

  // console.log("isCurrentUserAdmin" + isCurrentUserAdmin);

  const getUserData = useCallback(async () => {
    try {
      //console.log(userIdParams)

      const data = await request(`/api/auth/user/${userIdParams}`, "GET", null);
      //console.log(data);
      //   setForm({_id, username, avatar, email, isBanned, isAdmin, texts})
      checkUserStatus();
      setUser(data);
    } catch (e) {
      console.log(e.message);
    }
  }, [request, userIdParams]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const checkUserStatus = async () => {
    if (auth && auth.userId) {
      try {
        const data = await request(
          `/api/auth/user/${auth.userId}`,
          "get",
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        if (data.isBanned) {
          message("Вы были забанены!");
          auth.logout();
          history.push("/main");
        }
      } catch (e) {
        message("User doesn't exist");
        auth.logout();
      }
    }
  };

  useEffect(() => {
    // console.log(currentTextAndIndex.text)
    //console.log(user)
  }, [user]);

  function dragStartHandler(e) {
    e.preventDefault();
    setDrag(true);
  }

  function dragLeaveHandler(e) {
    e.preventDefault();
    setDrag(false);
  }

  function onDropHandler(e) {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    // console.log(files);
    uploadAvatarImage(files[0]);
    setDrag(false);
  }

  const uploadAvatarImage = async (file) => {
    if (file) {
      try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "fanficSiteAvatars");

        setAvatarUploading(true);

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ignatcloud/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const upload = await response.json();

        // console.log(upload.secure_url);

        const updateUserAvatar = await request(
          `/api/auth/updateAvatar/${auth.userId}`,
          "POST",
          { url: upload.secure_url },
          { Authorization: `Bearer ${auth.token}` }
        );

        setAvatarUploading(false);

        getUserData();

        message(updateUserAvatar.message);
      } catch (e) {
        console.log(e.message);
        setAvatarUploading(false);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  //   useEffect(() => {
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
    history.push(`/createTextPage/${user._id}`);
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
              {user && auth && auth.username === user.username ? (
                drag ? (
                  <>
                    <div
                      className="drag-area"
                      style={{ position: "absolute", marginLeft: "-168px" }}
                      onDragStart={(e) => dragStartHandler(e)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragOver={(e) => dragStartHandler(e)}
                      onDrop={(e) => onDropHandler(e)}
                    >
                      <span className="drag-area-text">dragging</span>
                      <img
                        src={
                          user && user.avatar
                            ? user.avatar
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        alt=""
                        className="rounded-circle  position-absolute avatar drag-area"
                      ></img>
                    </div>
                  </>
                ) : (
                  <div
                    className=""
                    style={{ position: "absolute", marginLeft: "-168px" }}
                    onDragStart={(e) => dragStartHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragOver={(e) => dragStartHandler(e)}
                    onDrop={(e) => onDropHandler(e)}
                  >
                    {avatarUploading ? (
                      <Loader></Loader>
                    ) : (
                      <img
                        src={
                          user && user.avatar
                            ? user.avatar
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        alt="Not Found"
                        className="rounded-circle  position-absolute avatar"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                      ></img>
                    )}
                  </div>
                )
              ) : (
                <img
                  src={
                    user && user.avatar
                      ? user.avatar
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt=""
                  className="rounded-circle  position-absolute avatar"
                  onDragStart={(e) => dragStartHandler(e)}
                  onDragLeave={(e) => dragLeaveHandler(e)}
                  onDragOver={(e) => dragStartHandler(e)}
                ></img>
              )}

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
                {user && auth && auth.username === user.username
                  ? "My "
                  : user
                  ? user.username + "'s "
                  : ""}
                Fanfics
              </h1>
              {user && (auth.username === user.username || isCurrentUserAdmin) && (
                <button
                  className="btn btn-dark ms-5 w-auto my-auto"
                  onClick={redirectToCreateTextPage}
                >
                  Create new
                </button>
              )}
            </div>
            <div className="container">
              {!loading && (
                <FanficList
                  user={user}
                  isCurrentUserAdmin={isCurrentUserAdmin}
                ></FanficList>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
