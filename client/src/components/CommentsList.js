import React, { useCallback, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";

export const CommentsList = (props) => {
  const textId = props.textId;
  const [comments, setComments] = useState([]);
  const { loading, error, request } = useHttp();

  const getComments = useCallback(async () => {
    try {
      // console.log("textId" + textId);
      const fethcedComments = await request(
        `/api/comment/getCommentsOfText/${textId}`,
        "GET",
        null
      );
      // console.log(fethcedComments)

      setComments(fethcedComments);
    } catch (e) {
      console.log(e.message);
    }
  }, [request, textId]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    // console.log(comments);
  }, [comments]);

  return (
    <div className="">
      {comments &&
        comments.map((comment) => {
          return (
            <div className="card shadow-sm mb-2 px-2 commentCardInCommentSection">
              <div className="d-flex border-bottom py-2">
                <img
                  className="rounded-circle"
                  src={comment && comment.author.avatar}
                  style={{ width: "35px", height: "35px" }}
                ></img>
                <span className="ms-1 my-auto">{comment && comment.author.username}</span>
              </div>
              <div className="mx-2 mt-2">
                {comment.content}
              </div>
                <div className="d-flex justify-content-end mb-2">
                    <text style={{opacity: 0.8, fontSize: '0.9rem'}}>{comment && new Date(comment.date).toLocaleString()}</text>
                </div>
            </div>
          );
        })}
    </div>
  );
};
