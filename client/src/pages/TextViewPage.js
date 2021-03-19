import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { render } from "react-dom";
import ReactMarkdown from "react-markdown";
import Scrollspy from "react-scrollspy";
import { useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { useAuth } from "../hooks/auth.hook";

export const TextViewPage = () => {
  const auth = useAuth();
  const history = useHistory();
  const jwt = require("jsonwebtoken");
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
      console.log(`Example 2: new value is ${newValue}`);
      setUserIdAndRateValue({ user: auth.userId, rateValue: newValue });
      //postRateValue();
      //setUserIdAndRateValue({userId: auth.userId, rateValue: newValue})
    },
    //edit: false
  });

  const withoutAuth = {
    size: 40,
    value: avarageRateValue,
    edit: false
  }

  var isCurrentUserAdmin = false;
  if (auth.token) {
    const dataFromToken = jwt.verify(auth.token, "ignat fanfic site");

    isCurrentUserAdmin = dataFromToken.isAdmin;
  }

  const getText = useCallback(async () => {
    try {
      const fetched = await request(`/api/text/${textId}`, "GET", null);
      //console.log(fetched);
      setText(fetched);
      setChapters(fetched.chapters);
      setAvarageRateValue(fetched.avarageRating)
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
        console.log(object.user)
        console.log(object.rateValue);
        const response = await request(
          `/api/text/setRateValueOnText/${textId}`,
          "POST",
          { ...object },
          { Authorization: `Bearer ${auth.token}` }
        );
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
  };

  useEffect(() => {
    //console.log(userIdAndRateValue.rateValue);
    setFirstExample({
      size: 40,
      value: userIdAndRateValue.rateValue,
      onChange: (newValue) => {
        console.log(`Example 2: new value is ${newValue}`);
        setUserIdAndRateValue({ user: auth.userId, rateValue: newValue });
        postRateValue({userId: auth.userId, rateValue: newValue})
      },
      // edit: false
    });
  }, [auth.userId, userIdAndRateValue]);

  useEffect(() => {
    //console.log(firstExample);
    //console.log(userIdAndRateValue.rateValue)
  }, [firstExample, userIdAndRateValue.rateValue, avarageRateValue]);

  if (loading) {
    return <Loader />;
  }

  return (
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
      <div className="card cardOnTextViewPage">
        <div className="border-bottom d-flex justify-content-center">
          <h3>Fanfic summary:</h3>
        </div>
        <div className="">
          <ReactMarkdown source={text && text.summary}></ReactMarkdown>
        </div>
      </div>
      <div className="card cardOnTextViewPage">
        <div className="border-bottom d-flex justify-content-between">
          <h1 className="ms-2">{text && text.title}</h1>
          <div className="my-auto">
            {isAuthenticated ? <ReactStars {...firstExample}></ReactStars> : <ReactStars {...withoutAuth}></ReactStars>}
          </div>
          <text className="my-auto me-2">
            Author: {text && text.author.username}
          </text>
        </div>
        <div className="row my-2 mx-1">
          <div className="col-4">
            <div className="list-group" id="list-tab" role="tablist">
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <a
                      className={`list-group-item list-group-item-action ${
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
                  );
                })}
            </div>
          </div>
          <div className="col-8">
            <div className="tab-content " id="nav-tabContent">
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <div
                      className={`tab-pane fade show ${
                        index === 0 && "active"
                      }`}
                      id={`list-${index + 1}`}
                      role="tabpanel"
                      aria-labelledby={`list-${index + 1}-list`}
                    >
                      <div className="scrollspyChapters">
                        <ReactMarkdown
                          source={chapter.chapterContent}
                        ></ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* <h1 className="d-flex justify-content-center">Fanfic View Page</h1>
      <h3 className="d-flex justify-content-center">
        Title: {text && text.title}
      </h3>
      <h5 className="d-flex justify-content-center">
        Author: {text && text.author.username}
      </h5>
      <h5 className="d-flex justify-content-center">
        You are {!isAuthenticated && "not"} authenticated
      </h5>
      <div className="card cardOnTextViewPage">
        <div className="border-bottom d-flex justify-content-between">
          <h1>{text && text.title}</h1>
          <text className="m-auto">Author: {text && text.author.username}</text>
        </div>
        <div className="row my-2 mx-1">
          <div className="col-4">
            <Scrollspy
              items={chapters.map((chapter, index) => {
                return "list-" + (index + 1);
              })}
              currentClassName="is-current"
            >
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <a
                      //   className={`list-group-item list-group-item-action
                      //  ${ index === 0 && "active"}`
                      // }
                      //className="list-group-item list-group-item-action"
                      className=""
                      id={`list-${index + 1}-list`}
                      //data-bs-toggle="list"
                      href={`#list-${index + 1}`}
                    >
                      {index + 1 + ". " + chapter.chapterTitle}
                    </a>
                  );
                })}
            </Scrollspy>
          </div>
          <div className="col-8">
            <div className="scrollspyChapters">
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <>
                      <h3 id={`list-${index + 1}`}>
                        Глава {index + 1}. {chapter && chapter.chapterTitle}
                      </h3>
                      <p>
                        <ReactMarkdown
                          source={chapter.chapterContent}
                        ></ReactMarkdown>
                      </p>
                    </>
                  );
                })}
            </div>
          </div>
        </div> */}
        {/* <div className="row my-2 mx-1">
          <div className="col-4">
            <div className="list-group" id="list-tab">
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <a
                      //   className={`list-group-item list-group-item-action
                      //  ${ index === 0 && "active"}`
                      // }
                      className="list-group-item list-group-item-action"
                      //   id={`list-${index + 1}-list`}
                      //data-bs-toggle="list"
                      href={`#list-${index + 1}`}
                      //   role="tab"
                      // aria-controls={`${index + 1}`}
                    >
                      {index + 1 + ". " + chapter.chapterTitle}
                    </a>
                  );
                })}
            </div>
          </div>
          <div className="col-8">
            <div
              className="scrollspyChapters"
              id="nav-tabContent"
              data-spy="scroll"
              data-target="#list-tab"
              data-offset="0"
            >
              {text &&
                chapters &&
                chapters.map((chapter, index) => {
                  return (
                    <>
                      <h3 id={`list-${index + 1}`}>
                        Глава {index + 1}. {chapter && chapter.chapterTitle}
                      </h3>
                      <p>
                        <ReactMarkdown
                          source={chapter.chapterContent}
                        ></ReactMarkdown>
                      </p>
                    </>
                  );
                })}
            </div>
          </div>
        </div> */}
        <div className="d-flex justify-content-end my-3 me-4">
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
  );
};
