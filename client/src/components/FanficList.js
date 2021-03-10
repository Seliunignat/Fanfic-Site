import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { Loader } from './Loader'

export const FanficList = ({ texts }) => {
    const auth = useContext(AuthContext)
    const {loading, request, response} = useHttp()
    const [fanficAuthors, setFanficAuthors] = useState([])
    const message = useMessage()

    const getAuthorUsername = async (text) => {
        try {
            console.log(text.author)
            const data = await request(`/api/auth/user/${text.author}`, "GET", null)
            console.log(data)   
            return(data.username)
            fanficAuthors.push(data.username)
            setFanficAuthors(fanficAuthors)
            console.log(fanficAuthors)
        } catch (e) {
            message(e.message)
        } 
    }

    useEffect(() => {
        console.log(texts)
    }, [texts])

    // useEffect(() => {
    //     getAuthorUsername()
    //     //console.log("texts changed")
    // }, [getAuthorUsername])

    // useEffect(() => {
    //     console.log("fanficAuthors changed")
    //     getAuthorUsername()
    // }, [fanficAuthors])

    if(loading){
        return <Loader></Loader>
    }

    if(!texts.length){
        return <p>Фанфиков пока нет</p>
    }

    return(
        <table className="table table-hover">
            <thead className="border-bottom border-dark">
                <tr>
                    <th scope="col">#Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Created</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {!loading && texts.map((text, index) => {
                    return(
                        <tr>
                            <th scope="row">{text.title}</th>                                
                            <td>{text.author.username}</td> {/* <td>{getAuthorUsername(text)}</td> */}
                            <td>{text.date}</td>
                            <td></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}