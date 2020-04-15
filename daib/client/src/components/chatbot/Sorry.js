import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';
export default class Sorry extends Component {
    render() {
      return (
        <div className="center">
		  <Image src={require('../../Assets/Images/sorry.jpeg')} />
        </div>
      )
    }
}