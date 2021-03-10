import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const FanficList = ({ texts }) => {
    const auth = useContext(AuthContext)
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
                {texts.map(text => {
                    return(
                        <tr>
                            <th scope="row">{text.title}</th>                                
                            <td>{text.author}</td>
                            <td>{text.date}</td>
                            <td></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}