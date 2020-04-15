import React, {Component} from 'react';
import img from '../resources/daib2.jpg';
import './Home.css';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state={
            language:'english',
            somevalue:1
        };
    }

    render() {
        return(
            <div className="home">
                <img src={img}/>
                <p>
                    {(()=>{
                        if(this.state.language==="english") return "Hello! This is Daib!";
                        if(this.state.language==="korean") return "안녕하세요! Daib입니다!";
                        if(this.state.language==="japanese") return "こんにちは！ これはDaibです!";
                    })()}
                </p>
            </div>
        )
    }
}

export default Home;
