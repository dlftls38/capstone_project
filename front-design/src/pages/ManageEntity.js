import React, {Component} from 'react';
import './ManageEntity.css';
import EntityModal from '../components/EntityModal'
import {RouteComponentProps} from 'react-router-dom';

class ManageEntity extends Component<RouteComponentProps> {
    constructor(props) {
        super(props);
        this.state={
            language:props.match.params.language,
            somevalue:1
        };
        console.log(props.match.params.language);
    }

    render() {
        return(
            <div className="manageentity">
                <p>
                    {(()=>{
                        if(this.state.language==="english") return "You can manage entities here";
                        if(this.state.language==="korean") return "여기서 엔티티를 관리하실 수 있습니다";
                        if(this.state.language==="japanese") return "ここでエンティティを管理することができます";
                    })()}
                </p>
                <EntityModal />
            </div>
        )
    }
}

export default ManageEntity;
