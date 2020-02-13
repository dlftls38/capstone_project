import React from 'react';
import Authentication from '../../components/account/Authentication';
import { connect } from 'react-redux';
import { registerRequest } from '../../actions/account/authentication';
import history from '../../history';
//import Materialize from 'react-materialize';

const Materialize = window.Materialize;
const $ = window.$;

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister(username, id, password, password_check, phone_number) {
        return this.props.registerRequest(username, id, password, password_check, phone_number).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    Materialize.toast('Success! Please log in', 2000);
                    history.push('/');
                    return true;
                } else {
                    /*
                       ERROR CODES:
                           1: BAD USERNAME
                           2: BAD PASSWORD
                           3: USERNAME EXISTS
                   */
                   let errorMessage = [
                       'Invalid Username',
                       'Invalid ID',
                       'Invalid Password',
                       'Invalid Phone Number',
                       'ID already exists'
                   ];
                   let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }
    render() {
        return (
            <div>
                <Authentication mode={false} onRegister={this.handleRegister}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (username, id, password, password_check, phone_number) => {
            return dispatch(registerRequest(username, id, password, password_check, phone_number));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
