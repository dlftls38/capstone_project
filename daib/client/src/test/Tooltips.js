import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './Tooltips.css'
import noti from '../Assets/Images/noti.png'
import chat from '../Assets/Images/chat.png'
import home from '../Assets/Images/home.png'
import accept from '../Assets/Images/accept.png'
import user from '../Assets/Images/user.png'
import {Dropdown,DropdownButton,Button} from 'react-bootstrap';

class Tooltips extends Component {
    constructor(props) {
        super(props);
        this.state={
            language:'english'
        }
    }

    render(){
        return(
            <div className="tooltips">
                <DropdownButton title="언어" style={{position: 'absolute', right: 440, top: 15}}>
                    <Dropdown.Item onClick={()=>this.setState({language:'english'})}>English</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.setState({language:'korean'})}>한글</Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.setState({language:'japanese'})}>日本語</Dropdown.Item>
                </DropdownButton>
                <Button style={{position: 'absolute', right: 360, top: 15}} variant="primary" onClick={()=>alert('알림(미구현)')}><img src={noti}/></Button>
                <Button style={{position: 'absolute', right: 310, top: 15}} variant="success" onClick={()=>alert('메시지(미구현)')}><img src={chat}/></Button>
                <Button style={{position: 'absolute', right:260, top: 15}} variant="warning" onClick={()=>alert('브리핑(미구현)')}><img src={accept}/></Button>
                <Button href="/" style={{position: 'absolute', right:210, top: 15}} variant="danger"><img src={home}/></Button>
                <DropdownButton title=<img src={user}/> variant="light" style={{position: 'absolute', right: 130, top: 15, width:64, height:64}}>
                    <Dropdown.Item onClick={()=>alert('미구현')}>내 정보</Dropdown.Item>
                    <Dropdown.Item onClick={()=>alert('미구현')}>챗봇 현황</Dropdown.Item>
                    <Dropdown.Item onClick={()=>alert('미구현')}>더 보기</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={()=>alert('로그아웃 되었습니다(미구현)')}>로그아웃</Dropdown.Item>
                </DropdownButton>
            </div>

        )
    }
};

export default Tooltips;