import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from'prop-types';


class Authentication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            id: "",
            password: "",
            password_check: "",
            phone_number: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let id = this.state.id;
        let pw = this.state.password;

        this.props.onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleRegister() {
        let username = this.state.username;
        let id = this.state.id;
        let password = this.state.password;
        let password_check = this.state.password_check;
        let phone_number = this.state.phone_number;

        this.props.onRegister(username, id, password, password_check, phone_number).then(
            (success) => {
                if(!success) {
                    this.setState({
                        username: '',
                        id: '',
                        password: '',
                        password_check: '',
                        phone_number: ''
                    });
                }
            }
        );
    }

    handleKeyPress(e) {
        if(e.charCode ===13 ){
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {
        const loginBoxes = (
            <div>
                <div>
                    <input
                    name="id"
                    placeholder="ID"
                    type="text"
                    className="input"
                    value={this.state.id}
                    onChange={this.handleChange}
                    />
                </div>
                <div className="input-field col s12">
                    <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="input"
                    value={this.state.password}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}/>
                </div>
            </div>
        );
        const registerBoxes = (
            <div>
                <div >
                    <input
                    name="username"
                    placeholder="UserName"
                    type="text"
                    className="input"
                    value={this.state.username}
                    onChange={this.handleChange}
                    />
                </div>
                <div >
                    <input
                    name="id"
                    placeholder="ID"
                    type="text"
                    className="input"
                    value={this.state.id}
                    onChange={this.handleChange}
                    />
                </div>
                <div >
                    <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="input"
                    value={this.state.password}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}/>
                </div>
                <div >
                    <input
                    name="password_check"
                    placeholder="Password Check"
                    type="password"
                    className="input"
                    value={this.state.password_check}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}/>
                </div>
                <div >
                    <input
                    name="phone_number"
                    placeholder="Phone Number"
                    type="text"
                    className="input"
                    value={this.state.phone_number}
                    onChange={this.handleChange}
                    />
                </div>
            </div>
        );

        const loginView = (
            <div className='authentication'>
                <h1>DAIB</h1>
                { loginBoxes }
                <a onClick={this.handleLogin} className='button'>Sign In</a>
                <Link to="/signup" className='button'>Sign Up</Link>
            </div>
        );

        const registerView = (
            <div className='authentication'>
                <h1>DAIB</h1>
                { registerBoxes }
                <a onClick={this.handleRegister} className='button'>Create</a>
                <Link to="/" className='button'>Cancel</Link>
            </div>
       );

        return(
            <div >
                <div >
                    {this.props.mode ? loginView : registerView }
                </div>
            </div>
        );
    }

}

Authentication.propTypes = {
    mode: PropTypes.bool,
    onLogin: PropTypes.func,
    onRegister: PropTypes.func
};

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("onLogin not defined"); },
    onRegister: (username, id, password, password_check, phone_number) => { console.error("onRegister not defined"); }
};

export default Authentication;
