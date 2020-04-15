import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';
export default class Confession extends Component {
    render() {
      return (
        <div className="center">
		  <Image src={require('../../Assets/Images/confession.jpeg')} />
		  <Image src={require('../../Assets/Images/confession2.jpg')} />
        </div>
      )
    }
}