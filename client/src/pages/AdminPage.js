import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const AdminPage = () => {
  const jwt = require("jsonwebtoken");
  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  var isCurrentUserAdmin = false;
  if (auth.token) {
    const dataFromToken = jwt.verify(
      auth.token,
      "ignat fanfic site",
      function (error, decoded) {
        if (error) {
          message("Срок действия токена закончен");
          history.goBack();
          auth.logout();
        } else {
          isCurrentUserAdmin = decoded && decoded.isAdmin;
        }
      }
    );
  }

  const getUserData = useCallback(async () => {
    if (auth && auth.userId) {
      try {
        //console.log(userIdParams)

        const data = await request(
          `/api/auth/user/${auth.userId}`,
          "GET",
          null
        );
        //console.log(data);
        //   setForm({_id, username, avatar, email, isBanned, isAdmin, texts})
        checkUserStatus();
        setCurrentUser(data);
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [auth, request]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  if (currentUser && !currentUser.isAdmin) {
    history.goBack();
  }

  const checkUserStatus = async () => {
    if (auth && auth.userId) {
      try {
        console.log(auth.userId);
        const data = await request(
          `/api/auth/user/${auth.userId}`,
          "get",
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        console.log("data.isBanned " + data.isBanned);
        if (data.isBanned) {
          message("Вы были забанены!");
          auth.logout();
          history.push("/main");
        }
        isCurrentUserAdmin = data.isAdmin;
      } catch (e) {
        console.log(e.message);
        message("User doesn't exist");
        // auth.logout();
      }
    }
  };

  const getUsers = async () => {
    try {
      const fetched = await request("/api/auth/getAllUsers", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      });

      setUsers(fetched);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    if (auth) getUsers();
  }, [auth]);

  if (loading || (currentUser && !currentUser.isAdmin)) {
    return <Loader></Loader>;
  }

  const banSelectedUsers = async () => {
    try {
      checkUserStatus();
      selected.forEach(async (user) => {
        const data = await request(`/api/auth/updateUserBanStatus/${user._id}`, 'POST', {isBanned: true}, {
          Authorization: `Bearer ${auth.token}`,
        });
        // message(data.message);
        clearSelected();
        getUsers();
      });
      
    } catch (e) {
      message(e);
    }
  };
  const unbanSelectedUsers = async () => {
    try {
      checkUserStatus();
      selected.forEach(async (user) => {
        const data = await request(`/api/auth/updateUserBanStatus/${user._id}`, 'POST', {isBanned: false}, {
          Authorization: `Bearer ${auth.token}`,
        });
        // message(data.message);
        clearSelected();
        getUsers();
      });
    } catch (e) {
      message(e);
    }
  };

  const giveUserAdminPermission = async () => {
    try {
      checkUserStatus();
      selected.forEach(async (user) => {
        const data = await request(`/api/auth/updateUserAdminStatus/${user._id}`, 'POST', {isAdmin: true}, {
          Authorization: `Bearer ${auth.token}`,
        });
        // message(data.message);
        clearSelected();
        getUsers();
      });
    } catch (e) {
      message(e)
    }
  }

  const removeUserAdminPermission = async () => {
    try {
      checkUserStatus();
      selected.forEach(async (user) => {
        const data = await request(`/api/auth/updateUserAdminStatus/${user._id}`, 'POST', {isAdmin: false}, {
          Authorization: `Bearer ${auth.token}`,
        });
        // message(data.message);
        clearSelected();
        getUsers();
      });
    } catch (e) {
      message(e)
    }
  }

  const selectAll = (event) => {
    const checkboxes = document.querySelectorAll(".form-check-input.userSelect")
    checkboxes.forEach((e, i) => {
      if(event.target.checked) e.checked = true
      else e.checked = false;
      });
  };

  const clearSelected = () => {
    const checkboxes = document.querySelectorAll(".form-check-input.userSelect")
    checkboxes.forEach((e, i) => {
      e.checked = false
      });
    users.map((e) => {
      e.isSelected = false;
      return e
    });
  };

  let selected = [];

  return (
    !loading &&
    isCurrentUserAdmin && (
      <>
        <Navbar windowPage={"/adminPage"}></Navbar>
        <div className="d-flex justify-content-center">
          <h1>All Users</h1>
        </div>
        <div className="d-flex mx-4 mb-1">
          <button className="btn btn-danger me-1" onClick={banSelectedUsers}>
            Ban
          </button>
          <button className="btn btn-success me-1" onClick={unbanSelectedUsers}>
            UnBan
          </button>
          <button className="btn btn-dark me-1" onClick={giveUserAdminPermission}>
            Make an admin
          </button>
          <button className="btn btn-outline-primary me-1" onClick={removeUserAdminPermission}>
            UnAdmin
          </button>
        </div>
        <div className="card adminPageCard">
          <table className="table fanficListTable">
            <thead className="border-bottom-1 borderInTableOnUserPage">
              <tr>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onClick={selectAll}
                  ></input>
                </td>
                <th scope="col">#</th>
                <th scope="col">username</th>
                <th scope="col">registered</th>
                <th scope="col">isBanned</th>
                <th scope="col">isAdmin</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                users.map((user) => {
                  return (
                    <>
                      <tr>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input userSelect"
                            onClick={() => {
                              if (user.isSelected) {
                                user.isSelected = false;
                                selected.splice(
                                  selected.findIndex((e) => e._id === user._id),
                                  1
                                );
                              } else {
                                user.isSelected = true;
                                selected.push(user);
                              }
                            }}
                          ></input>
                        </td>
                        <td className="cellUserId"><span className="text-overflow">{user._id}</span></td>
                        <td>{user.username}</td>
                        <td>
                          {new Date(user.registrationDate).toLocaleString()}
                        </td>
                        <td>{user.isBanned.toString()}</td>
                        <td>{user.isAdmin.toString()}</td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </>
    )
  );
};
