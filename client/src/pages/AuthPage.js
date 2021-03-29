import { event } from 'jquery'
import React, {useContext, useState , useEffect} from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState({
        username: '', password: ''
    })

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const loginHandler = async () => {
        try {
            const data = await request("/api/auth/login", "POST", { ...form });
            if (data.isBanned) {
                message("User is banned");
                return;
            }
            // console.log(data.isBanned)
            auth.login(data.token, data.userId, form.username, "", data.isBanned, data.isAdmin, data.themeColor);
        } catch (e) {
            message(e);
        }
        clearInputs();
    };

    const returnHandler = () => {
        return(<Redirect to="/main"></Redirect>)
    }

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
                <div className="card-body">
                    <h3 className="mB20"  style={{textAlign: 'center'}}>Authorization</h3>
                    <form>
                        <input
                            id="username"
                            name="username"
                            type="username"
                            className="form-control mB10 "
                            placeholder="Enter your username"
                            //required
                            value={form.username}
                            onChange={changeHandler}
                        />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="on"
                            className="form-control mB10"
                            placeholder="Enter your password"
                            value={form.password}
                            //required
                            onChange={changeHandler}
                        />
                        <div className="row">
                            <div className="col mx-auto"  style={{textAlign: 'center'}}>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={loading}
                                    onClick={loginHandler}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <p className="text-center">
                Don't have an account?&nbsp;
                <NavLink to="/registration" className="link-primary">
                    Sign up
                </NavLink>
            </p>
        </div>
        </>
    )
}