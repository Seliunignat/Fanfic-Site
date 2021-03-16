import React, { useCallback, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components/Loader";

export const TextViewPage = () => {
  const history = useHistory();
  const { username, token } = useContext(AuthContext);
  const isAuthenticated = !!token;
  const { request, loading } = useHttp();
  const [text, setText] = useState(null);
  const [chapters, setChapters] = useState([]);
  const textId = useParams().id;

  const getText = useCallback(async () => {
    try {
      const fetched = await request(`/api/text/${textId}`, "GET", null);
      setText(fetched);
      setChapters(fetched.chapters);
    } catch (e) {}
  }, [textId, request]);

  useEffect(() => {
    getText();
  }, [getText]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="fanficViewPageContainer">
      <h1 className="d-flex justify-content-center">Fanfic View Page</h1>
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
                      <div
                        className="overflow-scroll"
                        style={{ minHeight: "6rem", maxHeight: "27rem" }}
                      >
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
        <div className="d-flex justify-content-end my-3 me-4">
          {text && username && username === text.author.username && (
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
