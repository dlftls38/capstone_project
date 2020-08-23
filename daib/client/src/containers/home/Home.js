import React from 'react';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from '../../actions/account/authentication';
import history from '../../history';
import { Link, Route } from 'react-router-dom'

import {Nav, NavItem, Navbar, NavDropdown, DropdownItem, Form, FormControl, Button, Row, Col, Image} from 'react-bootstrap';

import {ChatbotBuilder} from '../';
import LeftNavBars from '../../test/LeftNavBars';
import Tooltips from '../../test/Tooltips';

const $ = window.$;
const Materialize = window.Materialize;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                 Materialize.toast('Good Bye!', 2000, 'black');

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
		// console.log("holly shit", document.cookie)
        if (!localStorage.getItem("userInfo")) {
            // console.log(1);
            this.goBackToLogin();
            return;
        }
		// console.log("holly shit2")
        if(!document.cookie){
            // console.log(0);
            this.goBackToLogin();
            return;
        }
		// console.log("holly shit3")
		
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
		// console.log("holly shit4")
        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn){
            // console.log(4);
            this.goBackToLogin();
            return;
        }
		// console.log("holly shit5")
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
                    Materialize.toast($toastContent, 4000, 'black');
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
				<div className="center lock">
					<ul>
						{ this.props.status.isLoggedIn ? logoutButton : loginButton }
					</ul>
				</div>
                <Route path="/home" component={ChatbotBuilder} />
				
				
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);