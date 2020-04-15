import React, { useState } from 'react';
import {Button, Form, Modal, ListGroup} from "react-bootstrap";

function EntityModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false); console.log('closed')};
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                엔티티 등록하기
            </Button>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>엔티티 등록하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEntityName">
                            <Form.Label>엔티티 이름</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>
                        <Button>등록</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ListGroup style={{flexDirection:'col', flex:1}}>
                        <ListGroup.Item>정의된 엔티티1 <Button>발화</Button></ListGroup.Item>
                        <ListGroup.Item>정의된 엔티티2 <Button>발화</Button></ListGroup.Item>
                        <ListGroup.Item>정의된 엔티티3 <Button>발화</Button></ListGroup.Item>
                        <ListGroup.Item>정의된 엔티티4 <Button>발화</Button></ListGroup.Item>
                        <ListGroup.Item>정의된 엔티티5 <Button>발화</Button></ListGroup.Item>
                    </ListGroup>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EntityModal;