/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useHistory } from 'react-router'

export const FanficCardOnMainPage = (props) => {
    const history = useHistory()
    const text = props.text
    if(text) {
        //console.log(text)
        //console.log(text._id)
    }
    return(
        <div className="card cardFanficMainPage dShadow p-1 m-3">
            <div className="border-bottom d-flex justify-content-center">
                <div></div>
                <a 
                    onClick={ () => history.push(`/text/${text._id}/view`)}
                    style={{}}
                >
                    <h1 className="text-center">{text && text.title}</h1>
                    </a>
                <button className="btn btn-dark ms-5 w-auto my-auto" >button</button>
            </div>   
            <div className="container">
                text....
            </div>                                  
        </div> 
    )
}