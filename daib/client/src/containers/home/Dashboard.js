import React from 'react';
import About from '../../components/home/About';
import { Route } from 'react-router-dom'

class Dashboard extends React.Component {
    render() {        
        return(
            <div>
                <h1>Dashboard area</h1>
                <About></About>
            </div>
        );
    }
}

export default Dashboard;
