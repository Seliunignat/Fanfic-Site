import React, {useCallback, useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/Navbar'
import { NavLink, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { Loader } from '../components/Loader'
import { FanficList } from '../components/FanficList';

export const UserPage = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const message = useMessage();
    const { loading, request, error, clearError } = useHttp()
    const [texts, setTexts] = useState([])
    const theme = localStorage.getItem("theme-color");

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

    const fetchTexts = useCallback(async () => {
        try {
            const fetched = await request("/api/text", "GET", null, {
                Authorization: `Bearer ${auth.token}`,
            });
            setTexts(fetched);
            //console.log(texts)
        } catch (e) {
            message(e.message)
            auth.logout();
            //console.log(e.message)
        }
    }, [auth.token, message, request])

    useEffect(() => {
        fetchTexts()
    }, [fetchTexts])

    if(loading) {
        return <Loader />
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
        history.push('/createTextPage')
    }

    return(
        <>
        <Navbar windowPage={"/user"}></Navbar>
        <main>
            <section className="userImageSection" >
                <section className="border-bottom">
                    <div className="container">
                        <div 
                        className="p-5 text-center bg-image rounded-bottom shadow-lg"                         
                        >
                        </div>                    
                    </div>  
                    <div className="d-flex justify-content-center">
                        <img
                        src="data:image/jpeg;base64,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" alt="" 
                        className="rounded-circle  position-absolute avatar" 
                        ></img>                      
                        <div className="container text-center shadow-sm" style={{width: '35rem', height: '4rem', marginTop: '1.5rem'}}>
                            <h2 className="pt-3">{auth.username}</h2>
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
                                <h1 className="text-center">My Fanfics</h1> 
                                {theme === 'dark' ? <button className="btn btn-light ms-5 w-auto my-auto" onClick={redirectToCreateTextPage}>Create new</button> : <button className="btn btn-dark ms-5 w-auto my-auto" onClick={redirectToCreateTextPage}>Create new</button>}
                            </div>   
                            <div className="container">
                                {!loading &&
                                    <FanficList texts={texts}></FanficList>
                                }
                            </div>                        
                            
                        </div> 
            </section>
        </main>
        </>
    )
}