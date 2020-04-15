import React from 'react';
import Authentication from '../../components/account/Authentication';
import { connect } from 'react-redux';
import { loginRequest } from '../../actions/account/authentication';
import history from '../../history';
//import Materialize from 'react-materialize';

const $ = window.$;
const Materialize = window.Materialize;

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(id, pw) {
        return this.props.loginRequest(id, pw).then(
            (username) => {
                if(this.props.status === "SUCCESS") {
                    let loginData = {
                        isLoggedIn: true,
                        username: username
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('Welcome ' + username + '!', 2000, 'black');
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify({
                            isLoggedIn: true,
                            username: username
                        })
                    );
                    history.push('/home');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect id or password</span>');
                    Materialize.toast($toastContent, 2000, 'black');
                    return false;
                }
            }
        );
    }

    render() {
        return (
            <div>
                <Authentication mode={true}
                    onLogin={this.handleLogin}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id,pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
