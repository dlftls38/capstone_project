import React, { useState } from 'react';
import {Button, Form, Dropdown, InputGroup, DropdownButton, FormControl, Modal} from "react-bootstrap";

function ScenarioModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => {setShow(false); console.log('closed')};
    const handleRegister= () => {setShow(false); console.log('launched name with num')};
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                시나리오 설정하기
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>시나리오 설정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    입력된 블록 분석 실패시
                    <InputGroup className="repeatLimit">
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-secondary"
                            title="되묻기 횟수"
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item href="#">1회</Dropdown.Item>
                            <Dropdown.Item href="#">2회</Dropdown.Item>
                            <Dropdown.Item href="#">3회</Dropdown.Item>
                            <Dropdown.Item href="#">제한 없음</Dropdown.Item>
                        </DropdownButton>
                        <FormControl placeholder="잘 모씀다?" aria-describedby="basic-addon1" />
                    </InputGroup>

                    다음 블록 입력 지연시간
                    <InputGroup className="inputDelay">
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-secondary"
                            title="최대 지연시간"
                            id="input-group-dropdown-2"
                        >
                            <Dropdown.Item href="#">30초</Dropdown.Item>
                            <Dropdown.Item href="#">1분</Dropdown.Item>
                            <Dropdown.Item href="#">3분</Dropdown.Item>
                            <Dropdown.Item href="#">제한 없음</Dropdown.Item>
                        </DropdownButton>
                        <FormControl placeholder="바로바로 입력해주세요" aria-describedby="basic-addon1" />
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleRegister}>
                        설정 완료
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ScenarioModal;