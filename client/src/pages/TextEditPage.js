import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const TextEditPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();
  const { loading, request, error, clearError } = useHttp();
  const [numberOfChapters, setNumberOfChapters] = useState(0);
  const [chapters, setChapters] = useState([]);
  const theme = localStorage.getItem("theme-color");
  const [text, setText] = useState(null);
  const [textTitle, setTextTitle] = useState("");
  const [summary, setSummary] = useState("")
  const textId = useParams().id;

  var isCurrentUserAdmin = false;
  if(auth.token){
    const jwt = require('jsonwebtoken')
    const dataFromToken = jwt.verify(auth.token, "ignat fanfic site")
    isCurrentUserAdmin = dataFromToken.isAdmin
  }

  const getText = useCallback(async () => {
    try {
      const fetched = await request(`/api/text/${textId}`, "GET", null);
      setText(fetched);
      setTextTitle(fetched.title);
      setChapters(fetched.chapters);
      setNumberOfChapters(fetched.chapters.length);
      setSummary(fetched.summary)
    } catch (e) {}
  }, [textId, request]);

  useEffect(() => {
    getText();
  }, [getText]);

  useEffect(() => {
    console.log("Error", error);
    message(error);
    clearError();
  }, [error, message, clearError]);

  const addNewChapter = () => {
    chapters.push({
      id: numberOfChapters,
      chapterTitle: "",
      chapterContent: "",
      order: 0,
      likes: 0,
    });
    setNumberOfChapters(chapters.length);
    setChapters(
      chapters.map((chapter) => {
        return chapter;
      })
    );
  };

  useEffect(() => {
    // console.log(numberOfChapters);
    //console.log(chapters);
    //console.log(summary)
  }, [chapters, numberOfChapters, summary]);

  const redirectToUserPage = () => {
    history.push("/user");
  };

  const goBackHandler = () => {
    history.goBack();
  };

  const changeChapterHandler = (event) => {
    //console.log("changeChapterTitleHandler: " + event.target.name)
    var chapterId = event.target.name;
    if (chapterId.includes("chapterTitle")) {
      chapterId = chapterId.replace("chapterTitle", "");
      const chapter = chapters.find((chapter) => chapter.id === chapterId - 1);
      if (chapter) chapter.chapterTitle = event.target.value;
    } else if (chapterId.includes("chapterContent")) {
      chapterId = chapterId.replace("chapterContent", "");
      const chapter = chapters.find((chapter) => chapter.id === chapterId - 1);
      chapter.chapterContent = event.target.value;
    }
    setChapters(
      chapters.map((chapter) => {
        return chapter;
      })
    );
    //console.log(chapters)
  };

  const changeTitleHandler = (event) => {
    text.title = event.target.value;
    setTextTitle(text.title);
    // console.log(text)
  };

  const changeSummaryhandler = (event) => {
    text.summary = event.target.value
    console.log(text.summary)
    setSummary(text.summary)
  };


  const saveChangesHandler = async () => {
    try {
      const data_req = await request(
        `/api/text/update/${text._id}`,
        "POST",
        { text },
        { Authorization: `Bearer ${auth.token}` }
      );
      message(data_req.message);
      if (data_req.message === "Фанфик успешно отредактирован")
        history.goBack();
      //console.log(data_req)
    } catch (e) {
      console.log(e.message);
    }
  };

  
  const deleteChapterButtonHandler = (index) => {
    chapters.splice(index, 1);
    setNumberOfChapters(chapters.length);
    setChapters(
      chapters.map((chapter, index) => {
        // console.log(chapter)
        chapter.id = index;
        return chapter;
      })
    );
  };

  const dontHavePermission = () => {
    message("You don't have permission");
    setTimeout(history.goBack(), 50);
  };

  if (text && (auth.username !== text.author.username && !isCurrentUserAdmin)) {
    dontHavePermission();
  }

  if (loading) {
    return <Loader />;
  }

  // return((text && (auth.username === text.author.username)) &&
  //     <div>
  //         <h1 className="d-flex justify-content-center">Text Edit Page</h1>
  //         <h3 className="d-flex justify-content-center">Title: {text && text.title}</h3>
  //     </div>
  // )

  return (
    <DragDropContext
      onDragEnd={(params) => {
        const srcI = params.source.index;
        const desI = params.destination.index;
        chapters.splice(desI, 0, chapters.splice(srcI, 1)[0]);
        setChapters(
          chapters.map((chapter, index) => {
            chapter.id = index;
            return chapter;
          })
        );
      }}
    >
      <div className="centeredElement my-3">
        <div className="card mainCard_CreatePage rounded dShadow">
          {/* Card Head */}
          <div className="card-head" style={{ textAlign: "center" }}>
            <h1>Edit fanfic</h1>
          </div>
          {/* Card Body */}
          <div className="card-body">
            <div className="container ">
              <div className="d-flex justify-content-center mb-3">
                <h5 style={{ marginTop: "0.45rem", marginRight: "0.5rem" }}>
                  Title:{" "}
                </h5>
                <input
                  className="form-control"
                  id="textTitle"
                  name="title"
                  type="text"
                  placeholder="Title"
                  style={{ width: "18rem" }}
                  required={true}
                  value={textTitle && textTitle}
                  onChange={changeTitleHandler}
                ></input>
              </div>
            </div>
            <div className="container ">
              <div className="d-flex justify-content-center mb-3">
                <h5 style={{ marginTop: "0.45rem", marginRight: "0.5rem" }}>
                  Summary:{" "}
                </h5>
                <textarea
                  className="form-control"
                  id="summary"
                  name="summary"
                  type="text"
                  placeholder="Summary"
                  value={summary}
                  style={{
                    width: "30rem",
                    minHeight: "3rem",
                    maxHeight: "7rem",
                    minWidth: "10rem",
                    maxWidth: "30rem",
                  }}
                  required={true}
                  onChange={changeSummaryhandler}
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-start ms-5 mb-3">
              <h3 className="me-4">Chapters: </h3>
              <button
                className="btn btn-outline-primary py-auto"
                onClick={addNewChapter}
              >
                Add chapter
              </button>
            </div>
            <Droppable droppableId="droppable-1">
              {(provided, _) => (
                <div
                  id="chapters"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {chapters &&
                    chapters.map((chapter, index) => {
                      return (
                        <Draggable
                          key={chapter.id}
                          draggableId={"draggable-" + chapter.id}
                          index={index}
                        >
                          {(provided, _) => (
                            <div
                              className="accordion"
                              id={"chapter" + (index + 1)}
                              style={{
                                width: "40rem",
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="accordion-item">
                                <div
                                  className="accordion-header"
                                  id={"heading" + (index + 1)}
                                >
                                  <div className="d-flex">
                                    <div className="card chapterCardOnCreatePage py-2 ps-3 mb-1">
                                      <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                          <h6 className="pt-2">
                                            Глава {index + 1}:{" "}
                                          </h6>
                                          <input
                                            className="form-control "
                                            id={"chapterTitle" + (index + 1)}
                                            name={"chapterTitle" + (index + 1)}
                                            type="text"
                                            placeholder="Title"
                                            style={{
                                              width: "18rem",
                                              marginLeft: "1rem",
                                              height: "2.5rem",
                                            }}
                                            // required={true}
                                            onChange={changeChapterHandler}
                                            value={
                                              chapter.chapterTitle &&
                                              chapter.chapterTitle
                                            }
                                          ></input>
                                        </div>
                                        <button
                                          className="accordion-button collapsed rounded-circle me-2 d-flex justify-content-center"
                                          type="button"
                                          draggable={true}
                                          data-bs-toggle="collapse"
                                          data-bs-target={
                                            "#collapse" + (index + 1)
                                          }
                                          aria-expanded="false"
                                          aria-controls={
                                            "collapse" + (index + 1)
                                          }
                                          style={{
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            border: "none",
                                            alignContent: "center",
                                          }}
                                        ></button>
                                      </div>
                                    </div>
                                    {theme === "dark" ? (
                                      <button
                                        type="button"
                                        class="btn-close btn-close-white my-auto ms-2"
                                        aria-label="Close"
                                        onClick={
                                          chapter &&
                                          (() =>
                                            deleteChapterButtonHandler(index))
                                        }
                                      ></button>
                                    ) : (
                                      <button
                                        type="button"
                                        class="btn-close my-auto ms-2"
                                        aria-label="Close"
                                        onClick={
                                          chapter &&
                                          (() =>
                                            deleteChapterButtonHandler(index))
                                        }
                                      ></button>
                                    )}
                                  </div>
                                </div>
                                <div
                                  id={"collapse" + (index + 1)}
                                  className="accordion-collapse collapse mb-1"
                                  aria-labelledby={"heading" + (index + 1)}
                                  data-bs-parent={
                                    "#chaptersAccordion" + (index + 1)
                                  }
                                  style={{ width: "40rem" }}
                                >
                                  <div className="accordion-body">
                                    <textarea
                                      id={"chapterContent" + (index + 1)}
                                      name={"chapterContent" + (index + 1)}
                                      className="form-control"
                                      type="text"
                                      onChange={changeChapterHandler}
                                      style={{
                                        width: "40rem",
                                        marginLeft: "-1.3rem",
                                        marginTop: "-1rem",
                                        marginBottom: "-1rem",
                                      }}
                                      placeholder={`Chapter ${
                                        index + 1
                                      } content`}
                                      value={
                                        chapter.chapterContent &&
                                        chapter.chapterContent
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                                {/* <div
                                      id={"collapse" + (index + 1)}
                                      className="accordion-collapse collapse"
                                      aria-labelledby={"heading" + (index + 1)}
                                      data-bs-parent={
                                        "#chaptersAccordion" + (index + 1)
                                      }
                                    >
                                      <div className="accordion-body">
                                        <textarea
                                          id={"chapterContent" + (index + 1)}
                                          name={"chapterContent" + (index + 1)}
                                          className="form-control"
                                          type="text"
                                          onChange={changeChapterHandler}
                                          style={{
                                            width: "40rem",
                                            marginLeft: "-1.4rem",
                                            marginTop: "-1rem",
                                            marginBottom: "-1rem",
                                          }}
                                        ></textarea>
                                      </div>
                                    </div> */}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="d-flex justify-content-end mt-1">
              <button
                className="btn btn-outline-primary me-1"
                onClick={goBackHandler}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveChangesHandler}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};
