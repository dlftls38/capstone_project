import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './LeftNavBars.css'
import {Nav} from 'react-bootstrap';

class LeftNavBars extends Component {
    constructor(props) {
        super(props);
        this.state={
            page:1
        }
    }

    handleDirect=(e)=>{
        this.setState({
            page:e.target.value
        });
    }

    render(){
        return(
            <div className="leftnavbars">
                <Nav variant="pills" defaultActiveKey={(()=>{
                    if(this.state.page===1) return "/project";
                    if(this.state.page===2) return "/entity";
                    if(this.state.page===3) return "/scenario";
                    if(this.state.page===4) return "/server";
                    if(this.state.page===5) return "/settings";
                })()} style={{flexDirection: 'column'}}>
                    <Nav.Item>
                        <Nav.Link href="/project">To Project Page</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/entity">To Entity Page</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/scenario">To Scenario Page</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/server">To Server Page</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/settings">To Setting Page</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        )
    }
};

export default LeftNavBars;