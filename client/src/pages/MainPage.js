import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FanficCardOnMainPage } from '../components/FanficCardOnMainPage'
import { Loader } from '../components/Loader'
import {Navbar} from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const MainPage = () => {
    const { loading, request, error, clearError } = useHttp()
    const {token} = useContext(AuthContext)
    const auth = useContext(AuthContext)
    const message = useMessage()
    const [texts, setTexts] = useState([])

    const getTexts = useCallback( async () => {
        try {
            const fetched = await request('/api/text/latest', 'GET', null)
            setTexts(fetched)
            //console.log(fetched)
        } catch (e) {
            
        }
    }, [request])

    useEffect( () => {
        getTexts()
    }, [getTexts])

    if(loading) {
        return <Loader />
    }

    return(
        <>
        {!loading && 
            <>
            <Navbar windowPage={"/main"}></Navbar>
            <div className="mainPageSection">
                <h1>Main Page</h1>
                <button className="btn btn-primary">Action</button>
                <section className="cCenterMainPage">
                    {texts && texts.map((text, index) => {
                        return(<FanficCardOnMainPage text={text}></FanficCardOnMainPage>)
                    })}
                </section>
            </div>
            </>
        }
        </>
        

    )
}