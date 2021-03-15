import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { Loader } from './Loader'

export const FanficList = ({ texts }) => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {loading, request, response} = useHttp()
    const [fanficAuthors, setFanficAuthors] = useState([])
    const message = useMessage()

    const redirectToTextViewPage = (id) => {
        //console.log(id)
        history.push(`/text/${id}/view`)
    }

    const redirectToTextEditPage = (id) => {
        //console.log(id)
        history.push(`/text/${id}/edit`)
    }

    if(loading){
        return <Loader></Loader>
    }

    if(!texts.length){
        return <p>Фанфиков пока нет</p>
    }

    return(
        <table className="table table-hover fanficListTable">
            <thead className="border-bottom-1 borderInTableOnUserPage">
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
                            <td>
                                <div className="d-flex">
                                    <i class="fa fa-pencil" onClick={text && (() => redirectToTextEditPage(text._id))}></i>
                                    <i class="fa fa-eye" onClick={text && (() => redirectToTextViewPage(text._id))}></i>
                                    <i class="fa fa-trash"></i>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}