import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LearnopusApp from './app/LearnopusApp';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <LearnopusApp />
    </Router>, 
    document.getElementById('root')
);

registerServiceWorker();
