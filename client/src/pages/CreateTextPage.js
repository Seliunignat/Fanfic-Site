import { data } from "jquery";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiCornerDownLeft } from "react-icons/fi";
import { useHistory, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const CreateTextPage = () => {
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const jwt = require("jsonwebtoken");
  const { loading, request, error, clearError } = useHttp();
  const [numberOfChapters, setNumberOfChapters] = useState(0);
  const [chaptersImages, setChaptersImages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [summary, setSummary] = useState("");
  const [imagesLoading, setImagesLoading] = useState([]);
  const [drag, setDrag] = useState(false);
  const theme = localStorage.getItem("theme-color");
  const author = useParams().id;

  var isCurrentUserAdmin = false;
  if (auth.token) {
    const dataFromToken = jwt.verify(
      auth.token,
      "ignat fanfic site",
      function (error, decoded) {
        if (error) {
          console.log("Срок действия токена закончен");
          message("Срок действия токена закончен")
          history.goBack();
          auth.logout();
        } else {
          isCurrentUserAdmin = decoded.isAdmin;
        }
      }
    );
  }
  //console.log(auth.username)

  if (!(auth.userId === author || isCurrentUserAdmin)) {
    history.goBack();
  }

  const getUserData = useCallback(async () => {
    try {
      //console.log(userIdParams)

      const data = await request(`/api/auth/user/${auth.userId}`, "GET", null);
      //console.log(data);
      //   setForm({_id, username, avatar, email, isBanned, isAdmin, texts})
      checkUserStatus();
    } catch (e) {
      console.log(e.message);
    }
  }, [auth.userId, request]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const checkUserStatus = async () => {
    if (auth && auth.userId) {
      try {
        const data = await request(
          `/api/auth/user/${auth.userId}`,
          "get",
          null,
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        if (data.isBanned) {
          message("Вы были забанены!");
          auth.logout();
          history.push("/main");
        }
      } catch (e) {
        message("User doesn't exist");
        auth.logout();
      }
    }
  };

  const [form, setForm] = useState({
    title: "",
    author: author,
    date: null,
    //chapters: null
  });

  const addNewChapter = () => {
    chapters.push({
      id: numberOfChapters,
      chapterTitle: "",
      chapterContent: "",
      chapterImage: null,
      order: 0,
      likes: [],
    });
    // console.log(chapters);
    chaptersImages.push({ name: null, url: null });
    setChaptersImages(
      chaptersImages.map((chapterImage) => {
        return chapterImage;
      })
    );
    imagesLoading.push(false);
    setChapters(
      chapters.map((chapter) => {
        return chapter;
      })
    );
    setNumberOfChapters(chapters.length);
  };

  useEffect(() => {
    // console.log(numberOfChapters);
    // console.log(chapters);
    setChaptersImages(
      chapters.map((chapter) => {
        return chapter.chapterImage;
      })
    );
  }, [chapters, numberOfChapters]);

  useEffect(() => {}, [summary]);

  useEffect(() => {
    // console.log("chpatersImages: ");
    // console.log(chaptersImages);
    // console.log(chapters);
  }, [chaptersImages]);

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
      chapter.chapterTitle = event.target.value;
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

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const changeSummaryhandler = (event) => {
    setSummary(event.target.value);
  };

  useEffect(() => {
    console.log("Error", error);
    message(error);
    clearError();
  }, [error, message, clearError]);

  const createHandler = async () => {
    try {
      const data_req = await request(
        "/api/text/create",
        "POST",
        {
          title: form.title,
          summary: summary,
          author: author,
          chapters: chapters,
        },
        { Authorization: `Bearer ${auth.token}` }
      );
      // console.log(data);
      message(data_req.message);
      if (data_req.message === "Фанфик успешно создан") history.push("/user");
    } catch (e) {}
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

  const addImagetoChapterHandler = (props) => {
    // const { event, index } = props;
    // const file = event.target.files[0];
    const { file, index } = props;
    // console.log("index: " + index);
    // console.log("event.files[0]: ");
    // console.log(event.target.files[0]);
    // console.log(file)

    uploadImage(file, index);

    // console.log("URLOfUploadedImage: " + URLOfUploadedImage);
  };

  const uploadImage = async (file, index) => {
    if (file) {
      try {
        // console.log(file);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "fanficSiteImages");

        // console.log(data);

        imagesLoading[index] = true;

        setImagesLoading(imagesLoading.map((imageLoading) => imageLoading));

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ignatcloud/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const upload = await response.json();

        imagesLoading[index] = false;

        setImagesLoading(imagesLoading.map((imageLoading) => imageLoading));

        // console.log(upload.secure_url);

        chaptersImages[index] = { name: file.name, url: upload.secure_url };
        setChaptersImages(
          chaptersImages.map((chapterImage) => {
            return chapterImage;
          })
        );

        setChapters(
          chapters.map((chapter, index) => {
            chapter.chapterImage = chaptersImages[index];
            return chapter;
          })
        );
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    // console.log("imagesLoading: " + imagesLoading);
  }, [imagesLoading]);

  function dragStartHandler(e) {
    e.preventDefault();
    setDrag(true);
  }

  function dragLeaveHandler(e) {
    e.preventDefault();
    setDrag(false);
  }

  function onDropHandler(props) {
    const {event, index} = props
    event.preventDefault();
    const files = [...event.dataTransfer.files];
    // console.log(files);
    // console.log("index: " + index)
    //uploadAvatarImage(files[0]);
    setDrag(false);
    addImagetoChapterHandler({file: files[0], index})
  }

  useEffect(() => {
    // console.log(drag);
  }, [drag]);

  return (
    <>
    <Navbar windowPage="/createTextPage"></Navbar>
    <DragDropContext
      onDragEnd={(params) => {
        // console.log(params.source.index + "th item isDragging to " + params.destination.index)
        // console.log(params);
        const srcI = params.source.index;
        const desI = params.destination.index;
        chapters.splice(desI, 0, chapters.splice(srcI, 1)[0]);
        setChapters(
          chapters.map((chapter, index) => {
            chapter.id = index;
            return chapter;
          })
        );
        setChaptersImages(
          chapters.map((chapter) => {
            return chapter.chapterImage;
          })
        );
      }}
    >
      <div className="centeredElement my-3">
        <div className="card mainCard_CreatePage rounded dShadow">
          {/* Card Head */}
          <div className="card-head" style={{ textAlign: "center" }}>
            <h1>Create new fanfic</h1>
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
                  onChange={changeHandler}
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
            <div className="d-flex justify-content-between ms-5 mb-3">
              <div className="d-flex justify-content-start">
                <h3 className="me-4">Chapters: </h3>
                <button
                  className="btn btn-outline-primary py-auto"
                  onClick={addNewChapter}
                >
                  Add chapter
                </button>
              </div>
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
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="accordion-item">
                                <div
                                  className="accordion-header"
                                  id={"heading" + (index + 1)}
                                >
                                  <div className="d-flex justify-content-between">
                                    <div className="d-flex my-auto">
                                      <div className="card chapterCardOnCreatePage py-2 ps-3 mb-1">
                                        <div className="d-flex justify-content-between">
                                          <div className="d-flex">
                                            <h6
                                              className="my-auto"
                                              style={{ width: "30%" }}
                                            >
                                              Глава {index + 1}:{" "}
                                            </h6>
                                            <input
                                              className="form-control my-auto chapterTitleInput"
                                              id={"chapterTitle" + (index + 1)}
                                              name={
                                                "chapterTitle" + (index + 1)
                                              }
                                              type="text"
                                              placeholder="Title"
                                              // style={{
                                              //   width: "18rem",
                                              //   marginLeft: "1rem",
                                              //   height: "2.5rem",
                                              // }}
                                              // required={true}
                                              onChange={changeChapterHandler}
                                              value={
                                                chapter.chapterTitle &&
                                                chapter.chapterTitle
                                              }
                                            ></input>
                                          </div>
                                          <div className="my-auto">
                                            {chapter &&
                                              (chapter.chapterImage == null ? (
                                                imagesLoading &&
                                                imagesLoading[index] ? (
                                                  <div className="my-auto">
                                                    <Loader></Loader>
                                                  </div>
                                                ) : drag ? (
                                                  <div
                                                    className="drag-area"
                                                    onDragStart={(e) =>
                                                      dragStartHandler(e)
                                                    }
                                                    onDragLeave={(e) =>
                                                      dragLeaveHandler(e)
                                                    }
                                                    onDragOver={(e) =>
                                                      dragStartHandler(e)
                                                    }
                                                    onDrop={(event) =>
                                                      onDropHandler({event, index})
                                                    }
                                                  >
                                                    Загрузить...                                           
                                                  </div>
                                                ) : (
                                                  <div
                                                    className=""
                                                    onDragStart={(e) =>
                                                      dragStartHandler(e)
                                                    }
                                                    onDragLeave={(e) =>
                                                      dragLeaveHandler(e)
                                                    }
                                                    onDragOver={(e) =>
                                                      dragStartHandler(e)
                                                    }
                                                    onDrop={(event) =>
                                                      onDropHandler({event, index})
                                                    }
                                                  >
                                                    <label
                                                      className="btn btn-outline-dark inputImageLabel"
                                                      for={`chapterImage${
                                                        index + 1
                                                      }file`}
                                                    >
                                                      <text>Upload Image</text>
                                                    </label>
                                                    <input
                                                      className="my-auto fileInput"
                                                      id={`chapterImage${
                                                        index + 1
                                                      }file`}
                                                      type="file"
                                                      onChange={(e) =>
                                                        addImagetoChapterHandler(
                                                          {
                                                            index,
                                                            file: e.target.files[0],
                                                          }
                                                        )
                                                      }
                                                    ></input>
                                                  </div>
                                                )
                                              ) : (
                                                <div className="">
                                                <p className="imageNameClass my-auto">
                                                  {chaptersImages[index] &&
                                                    chaptersImages[index]
                                                      .name}{" "}                                                  
                                                </p>
                                                <text className="textLoaded">Loaded</text>
                                                </div>
                                                
                                              ))}
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
                                </div>
                                <div
                                  id={"collapse" + (index + 1)}
                                  className="accordion-collapse collapse mb-1 chapterAccordionCollapse"
                                  aria-labelledby={"heading" + (index + 1)}
                                  data-bs-parent={
                                    "#chaptersAccordion" + (index + 1)
                                  }
                                >
                                  <div className="accordion-body">
                                    <textarea
                                      id={"chapterContent" + (index + 1)}
                                      name={"chapterContent" + (index + 1)}
                                      className="form-control chapterContentArea"
                                      type="text"
                                      onChange={changeChapterHandler}
                                      style={{
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
              <button className="btn btn-primary" onClick={createHandler}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
    </>
  );
};
