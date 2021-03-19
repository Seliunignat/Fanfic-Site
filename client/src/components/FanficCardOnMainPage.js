/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ReactMarkdown from "react-markdown";
import ReactStars from 'react-stars'

export const FanficCardOnMainPage = (props) => {
  const history = useHistory();
  const text = props.text;
  if (text) {
    //console.log(text)
    //console.log(text._id)
  }

  useEffect(() => {}, [text]);

  const ratingForm = {
    size: 20,
    value: text.avarageRating,
    edit: false
  }

  const goToUserPage = () => {
    history.push(`/user/${text.author._id}`);
  };

  return (
    <div className="card cardFanficMainPage dShadow p-1 m-3">
      <div className="border-bottom d-flex justify-content-between">
        <div></div>
        <a>
          <h3
            className="text-center"
            onClick={() => history.push(`/text/${text._id}/view`)}
          >
            {text && text.title}
          </h3>
        </a>
        <div className="my-auto me-2">
            <ReactStars {...ratingForm}></ReactStars>
          </div>
        {/* <button className="btn btn-dark ms-5 w-auto my-auto" >button</button> */}
      </div>
      <div className="container border-bottom">
        <ReactMarkdown source={text && text.summary}></ReactMarkdown>
      </div>
      <div className="d-flex justify-content-between my-2 me-2">
        <div className="d-flex justfy-content-between align-items-center">
          <div
            className="px-2 py-1 userAvatarUsernameOnFanficCard rounded-3"
            onClick={goToUserPage}
          >
            <img
              src={text && text.author.avatar}
              className="rounded-circle"
              style={{ width: "30px", height: "30px" }}
            ></img>
            <span className="ps-1">{text && text.author.username}</span>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => history.push(`/text/${text._id}/view`)}
        >
          Read
        </button>
      </div>
    </div>
  );
};
