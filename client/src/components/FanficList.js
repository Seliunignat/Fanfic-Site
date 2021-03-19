import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Modal, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { Loader } from "./Loader";

export const FanficList = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { loading, request, response } = useHttp();
  const [fanficAuthors, setFanficAuthors] = useState([]);
  const [texts, setTexts] = useState([]);
  const [user, setUser] = useState(props.user);
  const [isCurrentUserAdmin, setIsCurrentAdmin] = useState(props.user)
  //const user = props.user
  const [currentTextAndIndex, setCurrentTextAndIndex] = useState({
    text: null,
    index: 0,
  });
  const message = useMessage();

  useEffect(() => {}, [props]);

  const fetchTexts = useCallback(async () => {
      setIsCurrentAdmin(props.isCurrentUserAdmin)
      setUser(props.user)
      if(user){
      try {
        //console.log(props.user);
        const fetched = await request(
          `/api/text/getUserTexts/${user._id}`,
          "GET",
          null
        );
        setTexts(fetched);
        //console.log(texts)
      } catch (e) {
        //message(e.message);
        //auth.logout();          //???????
        console.log(e.message)
      }
    }
  }, [props, request, user]);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  const redirectToTextViewPage = (id) => {
    //console.log(id)
    history.push(`/text/${id}/view`);
  };

  const redirectToTextEditPage = (id) => {
    //console.log(id)
    history.push(`/text/${id}/edit`);
  };

  const deleteTextHandler = async ({ id, index }) => {
    handleClose();
    try {
      const data = await request(`/api/text/delete/${id}`, "delete", null, {
        Authorization: `Bearer ${auth.token}`,
      });
      message(data.message);
      //console.log(texts[index])
      texts.splice(index, 1);
      setTexts(
        texts.map((text, index) => {
          return text;
        })
      );
      //console.log(deletedText)
      //console.log(data.message)
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    // console.log(currentTextAndIndex.text)
  }, [currentTextAndIndex]);

  useEffect(() => {}, [texts]);

  const toModal = () => {
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (loading) {
    return <Loader></Loader>;
  }

  if (!texts.length) {
    return <p>Фанфиков пока нет</p>;
  }

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
      Launch static backdrop modal
    </Button> */}

      <table className="table table-hover fanficListTable">
        <thead className="border-bottom-1 borderInTableOnUserPage">
          <tr>
            <th scope="col">#Title</th>
            <th scope="col">Author</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            texts.map((text, index) => {
              return (
                <>
                  <tr>
                    <th scope="row">{text.title}</th>
                    <td>{text.author.username}</td>{" "}
                    {/* <td>{getAuthorUsername(text)}</td> */}
                    <td>{new Date(text.date).toLocaleString()}</td>
                    <td>
                      <div className="d-flex">
                        {user && ((auth.username === user.username) || isCurrentUserAdmin) && (
                          <i
                            class="fa fa-pencil fanficlist"
                            onClick={
                              text && (() => redirectToTextEditPage(text._id))
                            }
                          ></i>
                        )}
                        <i
                          class="fa fa-eye fanficlist"
                          onClick={
                            text && (() => redirectToTextViewPage(text._id))
                          }
                        ></i>
                        {user && ((auth.username === user.username) || isCurrentUserAdmin) && (
                          <i
                            class="fa fa-trash fanficlist"
                            onClick={() => {
                              setCurrentTextAndIndex({ text, index });
                              toModal();
                            }}
                          ></i>
                        )}
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          {Modal && (
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header>
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body>Do you really want to delete this fanfic?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    deleteTextHandler({
                      id: currentTextAndIndex.text._id,
                      index: currentTextAndIndex.index,
                    })
                  }
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </tbody>
      </table>
    </>
  );
};
