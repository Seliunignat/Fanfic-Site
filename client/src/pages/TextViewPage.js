import React, { useCallback, useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';

export const TextViewPage = () => {
    const {token} = useContext(AuthContext)
    const isAuthenticated = !!token
    const {request, loading} = useHttp()
    const [text, setText] = useState(null)
    const textId = useParams().id

    const getText = useCallback( async () => {
        try {
            const fetched = await request(`/api/text/${textId}`, 'GET', null)
            setText(fetched)
        } catch (e) {}
    }, [textId, request])

    useEffect( () => {
        getText()
    }, [getText])

    if(loading){
        return <Loader />
    }

    return(
        <div className="fanficViewPageContainer">
            <h1 className="d-flex justify-content-center">Fanfic View Page</h1>
            <h3 className="d-flex justify-content-center">Title: {text && text.title}</h3>
            <h5 className="d-flex justify-content-center">Author: {text&& text.author.username}</h5>
            <h5 className="d-flex justify-content-center">You are {!isAuthenticated && "not"} authenticated</h5>
            {/* <nav id="navbar-example2" className="navbar navbar-light bg-light px-3">
            <a className="navbar-brand" href="#">Navbar</a>
            <ul className="nav nav-pills">
                <li className="nav-item">
                <a className="nav-link" href="#fat">@fat</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="#mdo">@mdo</a>
                </li>
                <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#one">one</a></li>
                    <li><a className="dropdown-item" href="#two">two</a></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><a className="dropdown-item" href="#three">three</a></li>
                </ul>
                </li>
            </ul>
            </nav>
            <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-offset="0" tabindex="0">
            <h4 id="fat">@fat</h4>
            <p>...</p>
            <h4 id="mdo">@mdo</h4>
            <p>...</p>
            <h4 id="one">one</h4>
            <p>...</p>
            <h4 id="two">two</h4>
            <p>...</p>
            <h4 id="three">three</h4>
            <p>...</p>
            </div> */}
        </div>
    )
}