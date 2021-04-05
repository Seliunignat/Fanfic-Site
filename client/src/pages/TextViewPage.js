import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { render } from "react-dom";
import ReactMarkdown from "react-markdown";
import Scrollspy from "react-scrollspy";
import jwt from "jsonwebtoken";
import { FiHeart } from "react-icons/fi";
import { useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { useAuth } from "../hooks/auth.hook";
import { useMessage } from "../hooks/message.hook";
import { CommentsSection } from "../components/CommentsSection";
import { Navbar } from "../components/Navbar";

export const TextViewPage = () => {
  const auth = useAuth();
  const history = useHistory();
  const message = useMessage();
  //const jwt = require("jsonwebtoken");
  const { username, token } = useContext(AuthContext);
  const isAuthenticated = !!token;
  const { request, loading } = useHttp();
  const [text, setText] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [rateValue, setRateValue] = useState(0);
  const [avarageRateValue, setAvarageRateValue] = useState(0);
  const textId = useParams().id;
  const [userIdAndRateValue, setUserIdAndRateValue] = useState({
    userId: auth.userId,
    rateValue: rateValue,
  });

  const [firstExample, setFirstExample] = useState({
    size: 40,
    value: 0,
    onChange: (newValue) => {
      // console.log(`Example 2: new value is ${newValue}`);
      setUserIdAndRateValue({ user: auth.userId, rateValue: newValue });
      //postRateValue();
      //setUserIdAndRateValue({userId: auth.userId, rateValue: newValue})
    },
    //edit: false
  });

  const withoutAuth = {
    size: 40,
    value: avarageRateValue,
    edit: false,
  };

  var isCurrentUserAdmin = false;
  if (auth.token) {
    const dataFromToken = jwt.verify(
      auth.token,
      process.env.REACT_APP_jwtSecret,
      function (error, decoded) {
        if (error) {
          console.log("Срок действия токена закончен");
          message("Срок действия токена закончен");
          history.goBack();
          auth.logout();
        } else {
          isCurrentUserAdmin = decoded.isAdmin;
        }
      }
    );
  }

  const getText = useCallback(async () => {
    try {
      const fetched = await request(`/api/text/${textId}`, "GET", null);
      //console.log(fetched);
      setText(fetched);
      setChapters(fetched.chapters);
      setAvarageRateValue(fetched.avarageRating);
      const finded = fetched.rateValues.find(
        (rateValue) => rateValue.user === auth.userId
      );
      //console.log(finded);
      if (finded) {
        setUserIdAndRateValue({
          userId: auth.userId,
          rateValue: finded.rateValue,
        });
      }
    } catch (e) {}
  }, [request, textId, auth.userId]);

  useEffect(() => {
    getText();
  }, [getText]);

  const postRateValue = async (object) => {
    try {
      // console.log(object.user);
      // console.log(object.rateValue);
      const response = await request(
        `/api/text/setRateValueOnText/${textId}`,
        "POST",
        { ...object },
        { Authorization: `Bearer ${auth.token}` }
      );
      // console.log(response);
    } catch (e) {
      console.log(e.message);
    }
  };

  const likeHandler = async (chapter) => {
    if (auth.token) {
      var userIndex = -1;
      chapter.likes.forEach((userId, index) => {
        if (auth.userId === userId) {
          userIndex = index;
        }
      });
      if (userIndex !== -1) {
        chapter.likes.splice(userIndex, 1);
      } else {
        chapter.likes.push(auth.userId);
      }
      setChapters(
        chapters.map((chapter) => {
          return chapter;
        })
      );
      try {
        const data = await request(
          `/api/text/updateChapterLikesInText/${text._id}`,
          "POST",
          { chapter },
          { Authorization: `Bearer ${auth.token}` }
        );
        // console.log(data.message)
      } catch (e) {
        console.log(e.message);
      }
    } else {
      message("Вы не авторизованы!");
    }
  };

  useEffect(() => {
    //console.log(userIdAndRateValue.rateValue);
    setFirstExample({
      size: 40,
      value: userIdAndRateValue.rateValue,
      onChange: (newValue) => {
        // console.log(`Example 2: new value is ${newValue}`);
        setUserIdAndRateValue({ user: auth.userId, rateValue: newValue });
        postRateValue({ userId: auth.userId, rateValue: newValue });
      },
      // edit: false
    });
  }, [auth.userId, userIdAndRateValue]);

  useEffect(() => {
    //console.log(firstExample);
    //console.log(userIdAndRateValue.rateValue)
    // console.log(chapters);
  }, [chapters]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar windowPage="/textViewPage"></Navbar>
      <div className="fanficViewPageContainer">
        <h1 className="d-flex justify-content-center">Fanfic View Page</h1>
        <h3 className="d-flex justify-content-center">
          Title: {text && text.title}
        </h3>
        {/* <h5 className="d-flex justify-content-center">
        Author: {text && text.author.username}
      </h5> */}
        {/* <h5 className="d-flex justify-content-center">
        You are {!isAuthenticated && "not"} authenticated
      </h5> */}
        <div className="d-flex justify-content-center">
          <div className="card cardSummaryOnTextViewPage">
            <div className="border-bottom d-flex justify-content-center">
              <h3>Fanfic summary:</h3>
            </div>
            <div className="mx-2">
              <ReactMarkdown source={text && text.summary}></ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="card cardOnTextViewPage">
          <div className="border-bottom d-flex justify-content-between">
            <h1 className="ms-2">{text && text.title}</h1>
            <div className="my-auto">
              {isAuthenticated ? (
                <ReactStars
                  {...firstExample}
                  className="ratingStars"
                ></ReactStars>
              ) : (
                <ReactStars {...withoutAuth}></ReactStars>
              )}
            </div>
            <div className="d-flex justify-content-end userAvatarUsernameOnCommentCard my-auto me-2" onClick={() => history.push(`/user/${text.author._id}`)}>
              <i className="fa fa-user onTextEditPage my-auto p-0 me-1"></i>
              <text className="">
                {text && text.author.username}
              </text>
            </div>
          </div>

          <div className="d-flex my-2 mx-1">
            <div className="col-4 col-md-2 col-lg-2">
              <div className="d-flex border-end" style={{ maxHeight: "20rem" }}>
                <div
                  className="list-group"
                  id="list-tab"
                  role="tablist"
                  style={{ overflowY: "auto" }}
                >
                  {text &&
                    chapters &&
                    chapters.map((chapter, index) => {
                      return (
                        <>
                          <a
                            className={`list-group-item list-group-item-action d-flex ${
                              index === 0 && "active"
                            }`}
                            id={`list-${index + 1}-list`}
                            data-bs-toggle="list"
                            href={`#list-${index + 1}`}
                            role="tab"
                            aria-controls={`${index + 1}`}
                          >
                            {index + 1 + ". " + chapter.chapterTitle}
                          </a>
                        </>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="col-8 col-md-10 col-lg-10">
              <div className="tab-content " id="nav-tabContent">
                {text &&
                  chapters &&
                  chapters.map((chapter, index) => {
                    return (
                      <>
                        <div
                          className={`tab-pane fade show ${
                            index === 0 && "active"
                          }`}
                          id={`list-${index + 1}`}
                          role="tabpanel"
                          aria-labelledby={`list-${index + 1}-list`}
                        >
                          <div className="scrollspyChapters d-flex justify-content-between">
                            <div className="chapterContentArea">
                              <h2 className="border-bottom">
                                Глава {index + 1}.{" "}
                                {chapter && chapter.chapterTitle}
                              </h2>
                              <ReactMarkdown
                                source={chapter.chapterContent}
                              ></ReactMarkdown>
                            </div>
                            <div
                              className="card border-0 rounded-md rounded-lg mt-1 mb-auto p-md-1 p-lg-1"
                              style={{ position: "sticky", top: 0 }}
                            >
                              <img
                                src={
                                  chapter &&
                                  chapter.chapterImage &&
                                  chapter.chapterImage.url
                                }
                                alt="hhh"
                                style={{ maxWidth: "7rem" }}
                              ></img>
                            </div>
                          </div>
                          <div className="d-flex justify-content-start border-top border-2">
                            <div className="my-2 ms-1 likeButtonOnTextView d-flex">
                              <div
                                className={`heartSvgContainer ${
                                  chapter &&
                                  chapter.likes.find(
                                    (userId) => userId === auth.userId
                                  )
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => likeHandler(chapter)}
                              >
                                <svg
                                  viewBox="-15 -28 540.00002 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0" />
                                </svg>
                              </div>
                              <span className="ms-1">
                                {chapter && chapter.likes.length === 0
                                  ? "0"
                                  : chapter.likes.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="border-bottom"></div>

          <div className="d-flex justify-content-end my-2 me-3">
            {text &&
              username &&
              (username === text.author.username || isCurrentUserAdmin) && (
                <button
                  className="btn btn-primary me-2"
                  onClick={() => history.push(`/text/${text._id}/edit`)}
                >
                  <i className="fa fa-pencil editPencilOnViewPage"></i>
                  Edit
                </button>
              )}
            <button
              className="btn btn-outline-primary me-1"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {textId && <CommentsSection textId={textId}></CommentsSection>}
    </>
  );
};
