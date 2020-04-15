import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import {Home, ManageEntity, ManageScenario, ManageServer, Settings} from 'pages';
import LeftNavBars from '../containers/LeftNavBars';
import Tooltips from '../containers/Tooltips';

class App extends Component {
    state={
        language:'english',
        somevalue:1
    };
    render() {
        return (
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/entity/:language" component={ManageEntity}/>
                <Route path="/scenario" component={ManageScenario}/>
                <Route path="/server" component={ManageServer}/>
                <Route path="/settings" component={Settings}/>
                <Tooltips/>
                <LeftNavBars/>
            </div>
        );
    }
}

export default App;