import React, { Component } from 'react';
import Memos from './Memos';

class SearchedMemo extends Component {
    render() {        
        return(
            <Memos username = {this.props.match.params.username}/>
        );
    }
}

export default SearchedMemo;
