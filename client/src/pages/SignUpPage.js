import React, { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Navbar } from '../components/Navbar'

export const SignupPage = () => {
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
      username: "",
      password: "",
      email: "",
      isBanned: false,
      isAdmin: false
  });

  const changeHandler = (event) => {
      setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
      try {
          const data = await request("/api/auth/register", "POST", {
              ...form,
          });
          message(data.message);
          if (data.message === "Пользователь создан")
              setTimeout(() => (window.location.href = "/login"), 1000);
      } catch (e) {}
      clearInputs();
  };

  useEffect(() => {
      console.log('Error', error)
      message(error);
      clearError();
  }, [error, message, clearError]);

  const clearInputs = () => {
      document.querySelectorAll("input").forEach((e) => {
          e.value = null;
      });
  };

  return(
      <>
        <Navbar windowPage="/login"></Navbar>
      <div className="cCenter">
          <div className="card dShadow boRa mW548 w100 mB10">
              <div className="card-body"  style={{textAlign: 'center'}}>
                  <h3 className="mB20">Registration</h3>
                  <form>
                      <input
                          id="username"
                          name="username"
                          type="text"
                          className="form-control mB10 "
                          placeholder="Enter your username"
                          required
                          onChange={changeHandler}    
                      />
                      <input
                          id="email"
                          name="email"
                          type="email"
                          className="form-control mB10 "
                          placeholder="Enter your email adress"
                          required
                          onChange={changeHandler}
                      />
                      <input
                          id="password"
                          name="password"
                          type="password"
                          className="form-control mB10"
                          placeholder="Enter your password"
                          required
                          onChange={changeHandler}                          
                      />
                      <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={registerHandler}
                          disabled={loading}
                      >
                          Create an account
                      </button>
                  </form>
              </div>
          </div>
          <p className="text-center">
              Already have an account?&nbsp;
              <NavLink to="/login" className="link-primary">
                  Sign in
              </NavLink>
          </p>
      </div>
      </>
  )
}