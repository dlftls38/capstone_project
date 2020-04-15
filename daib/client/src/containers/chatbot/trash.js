import React from 'react';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from '../../actions/account/authentication';
import history from '../../history';
import { Link, Route } from 'react-router-dom'

import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';

// import Dashboard from './Dashboard';
// import Domain from './Domain';

const $ = window.$;
const Materialize = window.Materialize;

class Trash extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                 Materialize.toast('Good Bye!', 2000);

                 // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                this.goBackToLogin();
            }
        );
    }

    goBackToLogin(){
        history.push('/');
    }
    componentDidMount() {
        if (!localStorage.getItem("userInfo")) {
            console.log(1);
            this.goBackToLogin();
            return;
        }

        if(!document.cookie){
            console.log(0);
            this.goBackToLogin();
            return;
        }


        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            var ans = parts.pop().split(";").shift();
            // console.log("value ", value ,"value");
            // console.log("parts ", parts ,"parts");
            // console.log("return ", ans ,"return");
            //if(part)
            return ans;
        }

        // get login data from cookie
        let loginData = getCookie('key');
        // console.log("cookie ", document.cookie ,"cookie");
        // console.log("loginData ", loginData ,"loginData");

        let localstor = JSON.parse(localStorage.getItem("userInfo"));
        // console.log("localstor ", loginData ,"localstor");
        // console.log("localstor.username ", localstor.username ,"localstor.username");
        // console.log("btoa(JSON.stringify(localstor)) ", btoa(JSON.stringify(localstor)) ,"btoa(JSON.stringify(localstor))");
        // console.log("비교 ", loginData === btoa(JSON.stringify(localstor)) ,"비교");

        if(loginData === btoa(JSON.stringify(localstor))){
            // console.log(2);
            //return;
        }
        // if loginData is undefined, do nothing

        if(typeof loginData === "undefined"){
            // console.log(3);
            this.goBackToLogin();
            return;
        }

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn){
            // console.log(4);
            this.goBackToLogin();
            return;
        }
        // console.log(5);
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                if(!this.props.status.valid) {
                    // console.log(6);
                    // if session is not valid
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        username: ''
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    // and notify
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);
                    this.goBackToLogin();
                }
            }
        );

    }

    render(){
        const loginButton = (
            <li>
                <Link to="/"><i className="material-icons">vpn_key</i></Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.handleLogout}><i className="material-icons">lock_open</i></a>
            </li>
        );

        return (
            <div >
                <Row>
                    <Col className="">
                        <h2>DAIB Chatbot</h2>
                        <br></br>
                        <Image src={require('../../Assets/Images/chatbot.png')} roundedCircle />
                        <Nav fill variant="tabs" activeKey={this.props.location.pathname} className="flex-column">
                            <Nav.Item>
                                <Nav.Link href="/home/dashboard">Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/home/domain">Domain</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/home/management">Management</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/home/subscription">Subscription</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Navbar bg="dark" variant="dark" >
                            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                            <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                            </Nav>
                            <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
                            </Form>
                        </Navbar>
                        <br />
                        <Navbar bg="primary" variant="dark">
                            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                            <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                            </Nav>
                            <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-light">Search</Button>
                            </Form>
                        </Navbar>

                        <br />
                        <Navbar bg="light" variant="light">
                            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                            <Nav className="mr-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                            </Nav>
                            <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-primary">Search</Button>
                            </Form>
                        </Navbar>
                    </Col>
                    <Col xs={8} className="">
                        <div className="center lock">
                            <ul>
                                { this.props.status.isLoggedIn ? logoutButton : loginButton }
                            </ul>
                        </div>
                        <h1>챗봇 설정</h1>
                        {/* <Route path="/home/dashboard" component={Dashboard} />
                        <Route path="/home/domain" component={Domain} /> */}
                    </Col>
                </Row>
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trash);