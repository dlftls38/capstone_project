import React from 'react';
import { Route } from 'react-router-dom'
import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col} from 'react-bootstrap';

class Domain extends React.Component {
    render() {        
        return(
            <div>
                <h1>Domain area</h1>
                {' '}
                <Nav.Link href="/chatbot">빌더 실행하기</Nav.Link>
            </div>
        );
    }
}

export default Domain;
