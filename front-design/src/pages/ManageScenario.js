import React, {Component} from 'react';
import './ManageScenario.css';
import ScenarioModal from '../components/ScenarioModal'

class ManageScenario extends Component {
    constructor(props) {
        super(props);
        this.state={
            language:'english',
            somevalue:1
        };
    }

    render() {
        return(
            <div className="managescenario">
                <p>
                    {(()=>{
                        if(this.state.language==="english") return "You can manage scenarios here";
                        if(this.state.language==="korean") return "여기서 시나리오를 관리하실 수 있습니다";
                        if(this.state.language==="japanese") return "ここでのシナリオを管理することができます";
                    })()}
                </p>
                <ScenarioModal />
            </div>

        )
    }
}

export default ManageScenario;
