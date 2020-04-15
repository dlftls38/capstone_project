import React, {Component} from 'react';
import './ManageServer.css';
import ServerModal from '../components/ServerModal'

class ManageServer extends Component {
    constructor(props) {
        super(props);
        this.state={
            language:'english',
            somevalue:1
        };
    }

    render() {
        return(
            <div className="manageserver">
                <p>
                    {(()=>{
                        if(this.state.language==="english") return "You can manage servers here";
                        if(this.state.language==="korean") return "여기서 서버를 관리하실 수 있습니다";
                        if(this.state.language==="japanese") return "ここでサーバーを管理することができます";
                    })()}
                </p>
                <ServerModal />
            </div>

        )
    }
}

export default ManageServer;
