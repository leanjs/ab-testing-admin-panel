import React from 'react'
import {Modal, Button, closeButton} from 'react-bootstrap'

const ModalYN = ({showModal, close, doAction, title, textModal}) => (
  <Modal show={showModal} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {textModal}
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={close}>Close</Button>
      <Button bsStyle='primary' onClick={doAction}>Accept</Button>
    </Modal.Footer>
  </Modal>
)

export default ModalYN