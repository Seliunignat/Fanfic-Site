import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const ModalWindow = (props) => {
    const { loading, request, response } = useHttp();
    const [show, setShow] = useState(false);
    const message = useMessage();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const deleteTextHandler = async ({ id, index }) => {
    //     handleClose()
    //   try {
    //     const data = await request(`/api/text/delete/${id}`, "delete", null, {
    //       Authorization: `Bearer ${props.auth.token}`,
    //     });
    //     message(data.message);
    //     //console.log(texts[index])
    //     texts.splice(index, 1);
    //     setTexts(
    //       texts.map((text, index) => {
    //         return text;
    //       })
    //     );
    //     //console.log(deletedText)
    //     //console.log(data.message)
    //   } catch (e) {
    //     console.log(e.message);
    //   }
    // };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Deleting fanfic: {props.text && props.text.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          // onClick={() => deleteTextHandler({ id: text._id, index: index })}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
