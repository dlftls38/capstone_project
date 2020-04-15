import React, {Component} from 'react';
import './Settings.css';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state={
            language:'english',
            somevalue:1
        };
    }

    render() {
        return(
            <div className="settings">
                <p>
                    {(()=>{
                        if(this.state.language==="english") return "You can manage settings here";
                        if(this.state.language==="korean") return "여기서 설정을 관리하실 수 있습니다";
                        if(this.state.language==="japanese") return "ここで設定を管理することができます";
                    })()}
                </p>
            </div>

        )
    }
}

export default Settings;
