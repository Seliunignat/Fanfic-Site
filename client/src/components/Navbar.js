import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, Redirect, Route, Switch, useHistory } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";
import { useAuth } from "../hooks/auth.hook";
import { set } from "mongoose";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";

export const Navbar = (props) => {
  const history = useHistory();
  const message = useMessage();
  const [currentUserName, setCurrentUserName] = useState(null);
  const auth = useContext(AuthContext);
  const [queryStringValue, setQueryStringValue] = useState("");
  const [results, setResults] = useState(null);
  const useauth = useAuth();
  const { loading, request } = useHttp();
  const isUserAuthenticated = !!auth.token;
  const currentWindowPage = props.windowPage;

  const [theme, setTheme] = useState(
    localStorage.getItem("theme-color") || "light"
  );

  // console.log(auth)

  if (auth && auth.isBanned) {
    // console.log("isBanned: " + auth.isBanned);
    message("Вы были ЗАБАНЕНЫ!");
    auth.logout();
  }

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/main");
  };

  const redirectToLoginPage = () => {
    window.location.href = "/login";
  };

  const redirectToMainPage = () => {
    history.push("/main");
  };

  const goToUserPage = () => {
    history.push("/user");
  };

  useEffect(() => {
    if (auth.username) {
      // console.log("auth: " + auth.username);
      setCurrentUserName(auth.username);
      return;
    }
  }, [auth.username]);

  useEffect(() => {
    // console.log("themeColor: " + theme);
    localStorage.setItem("theme-color", theme);
    updateUserTheme();
    if (document.body.className === "dark" && theme === "light") {
      document.body.className = "";
    } else if (document.body.className === "" && theme === "dark") {
      document.body.className = "dark";
    }
  }, [theme]);

  const changeModeHandler = () => {
    document.body.classList.toggle("dark");
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    //localStorage.setItem('theme-color', theme)
  };

  const updateUserTheme = async () => {
    if (auth && auth.userId) {
      try {
        // console.log(theme);
        const response = await request(
          `/api/auth/updateTheme/${auth.userId}`,
          "POST",
          { theme },
          { Authorization: `Bearer ${auth.token}` }
        );
        // console.log(response.message);
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const changeHandler = (event) => {
    setQueryStringValue(event.target.value);
  };

  useEffect(() => {
    // console.log(queryStringValue);
  }, [queryStringValue]);

  const searchHandler = (event) => {
    event.preventDefault();
    // console.log(queryStringValue);
    history.push(`/search/results/${queryStringValue}`);
    //event.target.reset()
  };

  return (
    <nav className="navbar sticky-top navbar-light mainNavBar dShadow">
      <div className="container-fluid">
        <h1 className="navbar-brand" onClick={() => history.push("/main")}>
          Мордор
        </h1>
        <form className="d-flex" onSubmit={searchHandler}>
          {!(
            currentWindowPage === "/login" ||
            currentWindowPage === "/registration"
          ) && (
            <>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={queryStringValue}
                onChange={changeHandler}
              ></input>
              <button className="btn btn-outline-success me-2" type="submit">
                Search
              </button>
            </>
          )}
        </form>
        {/* {console.log('isAuthenticated: ' + JSON.stringify(isAuthenticated))} */}
        {isUserAuthenticated && (
          <div className="d-flex">
            {currentWindowPage === "/main" && (
              <>
                <div className="col mx-auto my-auto ">
                  <h5 className="mt-2 me-1">{currentUserName}</h5>
                </div>
                <div className="col me-2">
                  <NavLink to={`/user/${auth.userId}`}>
                    <i className="fa fa-user"></i>
                  </NavLink>
                </div>
              </>
            )}
            {currentWindowPage !== "/main" && (
              <div className="col me-2">
                <NavLink to="/main">
                  <i className="fa fa-home"></i>
                </NavLink>
              </div>
            )}
            <div class="dropdown me-1">
              <button
                class="btn btn-dark dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {/* <li><a className="dropdown-item" href="#">Action</a></li> */}
                <li>
                  <a className="dropdown-item">
                    <input
                      type="checkbox"
                      className="modeCheckBox"
                      id="modeCheckBox"
                      onClick={changeModeHandler}
                    />
                    <label for="modeCheckBox" className="modeLabel">
                      {theme === "dark" ? "Light" : "Dark"}-Mode
                    </label>
                  </a>
                </li>
                {auth && auth.isAdmin && (
                  <li>
                    <label className="dropdown-item" onClick={() => history.push("/adminPage")}>
                      adminPage
                    </label>
                  </li>
                )}

                {/* <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li> */}
              </ul>
            </div>
            <div className="col mx-auto">
              <a href="/">
                <button
                  className="btn btn-outline-primary"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </a>
            </div>
          </div>
        )}
        {(currentWindowPage === "/login" ||
          currentWindowPage === "/registration") &&
          !isUserAuthenticated.value && (
            <button
              className="btn btn-outline-primary"
              onClick={redirectToMainPage}
            >
              To Main
            </button>
          )}
        {!isUserAuthenticated &&
          !(
            currentWindowPage === "/login" ||
            currentWindowPage === "/registration"
          ) && (
            <NavLink to="/login">
              <button className="btn btn-outline-primary">Login</button>
            </NavLink>
          )}
      </div>
    </nav>
  );
};
