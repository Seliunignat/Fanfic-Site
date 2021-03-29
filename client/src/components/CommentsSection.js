import React, { useCallback, useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";
import { useAuth } from "../hooks/auth.hook";
import { useHttp } from "../hooks/http.hook";
import { Loader } from "./Loader";
import { CommentsList } from "./CommentsList";

export const CommentsSection = (props) => {
  const { textId } = props;
  const { loading, error, request } = useHttp();
  const auth = useContext(AuthContext);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const history = useHistory();

  const [leavingComment, setLeavingComment] = useState({
    author: auth.userId,
    content: "",
    onFanfic: textId,
  });

  const getComments = useCallback(async () => {
    try {
      // console.log("get comments...")
      //   console.log("textId" + textId);
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
    setTimeout(getCommentsInInterval, 5000);
  }, [comments]);

  const getCommentsInInterval = async () => {
    try {
      // console.log("get comments...")
      //   console.log("textId" + textId);
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
  };

  const changehandler = (event) => {
    setCommentContent(event.target.value);
  };

  useEffect(() => {
    // console.log(commentContent);
  }, [commentContent]);

  const leaveCommentHandler = async () => {
    try {
      const commentFetched = await request(
        "/api/comment/create",
        "POST",
        { author: auth.userId, textId: textId, content: commentContent },
        { Authorization: `Bearer ${auth.token}` }
      );
      // console.log(commentFetched.message);

      setCommentContent("");

      getComments();
    } catch (e) {
      console.log(e.message);
    }
  };

  // if(loading){
  //     <Loader></Loader>
  // }

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="card leaveCommentCard shadow-sm mb-4 mx-auto">
          <h4 className="ms-3 mt-2">Add comment</h4>
          <div className="d-flex ms-3 mb-3 me-3">
            <input
              className="form-control my-auto"
              name="content"
              type="text"
              placeholder={auth.isAuthenticated ? "Enter comment" : "Войдите, чтобы оставлять комментарии"}
              value={commentContent && commentContent}
              onChange={changehandler}
              disabled={!auth.isAuthenticated}
            ></input>
            <button
              className="btn btn-primary my-auto ms-2"
              onClick={leaveCommentHandler}
              disabled={!auth.isAuthenticated}
            >
              <FaArrowRight></FaArrowRight>
            </button>
          </div>
        </div>
      </div>
      <div className="cCenterCommentSection">
        <div className="">
          {comments &&
            comments.map((comment) => {
              return (
                <div className="card commentCardInCommentSection shadow-sm mb-2 px-2">
                  <div
                    className="d-flex border-bottom py-1"
                    onClick={() =>
                      history.push(`/user/${comment && comment.author._id}`)
                    }
                  >
                    <div className="userAvatarUsernameOnCommentCard">
                      <img
                        className="rounded-circle"
                        src={comment && comment.author.avatar}
                        style={{ width: "35px", height: "35px" }}
                      ></img>
                      <text className="ms-1 my-auto">
                        {comment && comment.author.username}
                      </text>
                    </div>
                  </div>
                  <div className="mx-2 mt-2">
                    <text>{comment.content}</text>
                  </div>
                  <div className="d-flex justify-content-end mb-2">
                    <text style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                      {comment && new Date(comment.date).toLocaleString()}
                    </text>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
