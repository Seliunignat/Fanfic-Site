import { data } from "jquery";
import React, { useContext, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiCornerDownLeft } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const CreateTextPage = () => {
  const message = useMessage();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { loading, request, error, clearError } = useHttp();
  const [numberOfChapters, setNumberOfChapters] = useState(0);
  const [chpatersImages, setChaptersImages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [summary, setSummary] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const theme = localStorage.getItem("theme-color");

  const [form, setForm] = useState({
    title: "",
    author: auth.userId,
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
    console.log(chapters);
    chpatersImages.push(null);
    setChaptersImages(
      chpatersImages.map((chapterImage) => {
        return chapterImage;
      })
    );
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
    console.log("chpatersImages: ");
    console.log(chpatersImages);
    console.log(chapters);
  }, [chpatersImages]);

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
          author: auth.userId,
          chapters: chapters,
        },
        { Authorization: `Bearer ${auth.token}` }
      );
      console.log(data);
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
    const { event, index } = props;
    const file = event.target.files[0];
    console.log("index: " + index);
    console.log("event.files[0]: ");
    console.log(event.target.files[0]);

    uploadImage(file, index);

    // console.log("URLOfUploadedImage: " + URLOfUploadedImage);
  };

  const uploadImage = async (file, index) => {
    if (file) {
      try {
        console.log(file);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "fanficSiteImages");

        // console.log(data.getAll('file'))

        // const jsonedData = JSON.stringify(data)

        // console.log(jsonedData)

        // const reader = new FileReader()
        // reader.readAsDataURL(file)
        // reader.onloadend = () => {
        //    console.log(reader.result)
        // }

        //const data = reader.result

        // console.log(JSON.stringify(reader.result))

        console.log(data);

        // const upload = await request('/api/image/uploadChapterImage', 'POST', )
        setImageLoading(true)

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ignatcloud/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const upload = await response.json();

        setImageLoading(false)

        console.log(upload.secure_url);

        chpatersImages[index] = upload.secure_url;
        setChaptersImages(
          chpatersImages.map((chapterImage) => {
            return chapterImage;
          })
        );

        setChapters(chapters.map((chapter, index) => {
          chapter.chapterImage = chpatersImages[index]
          return chapter
        }))

      } catch (e) {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    console.log("imageLoading: " + imageLoading)
  }, [imageLoading])

  return (
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
                                              name={
                                                "chapterTitle" + (index + 1)
                                              }
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
                                    {chapter &&
                                      (chapter.chapterImage == null ? (
                                        <input
                                          className="my-auto"
                                          id={`chapterImage${index + 1}`}
                                          type="file"
                                          onChange={(e) =>
                                            addImagetoChapterHandler({
                                              index,
                                              event: e,
                                            })
                                          }
                                        ></input>
                                      ) : (
                                        "Loaded"
                                      ))}
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
  );
};
