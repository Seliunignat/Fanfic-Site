import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const TextEditPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage();
    const history = useHistory()
    const {loading, request} = useHttp()
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
    
    const dontHavePermission = () => {
        message("You don't have permission");
        setTimeout(history.goBack(), 50)
    }

    if(text && (auth.username !== text.author.username)){
        dontHavePermission()
    }

    if(loading){
        return <Loader/>
    }

    return((text && (auth.username === text.author.username)) &&
        <div>
            <h1 className="d-flex justify-content-center">Text Edit Page</h1>
            <h3 className="d-flex justify-content-center">Title: {text && text.title}</h3>
        </div>
    )
}