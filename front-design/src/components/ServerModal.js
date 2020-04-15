import React, { useState } from 'react';
import {Button, Form, Modal} from "react-bootstrap";

function ServerModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false); console.log('closed')};
    const handleRegister= () => {setShow(false); console.log('launched name with num')};
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                서버 등록하기
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>서버 등록하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formServerName">
                            <Form.Label>서버 이름</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">
                                이미 사용중인 서버와 동일한 서버명은 사용할 수 없습니다
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formServerPort">
                            <Form.Label>서버 포트</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">
                                이미 사용중인 포트와 동일한 포트넘버는 사용할 수 없습니다
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleRegister}>
                        서버 등록
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ServerModal;