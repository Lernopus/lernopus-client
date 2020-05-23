import React, { Component } from 'react';
import './ServerError.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {INTERNAL_SERVER , SOMETHING_WENT_WRONG , GO_BACK} from '../constants/index'

class ServerError extends Component {
    render() {
        return (
            <div className="server-error-page">
                <h1 className="server-error-title">
                    {INTERNAL_SERVER}
                </h1>
                <div className="server-error-desc">
                    {SOMETHING_WENT_WRONG}
                </div>
                <Link to="/"><Button className="server-error-go-back-btn" type="primary" size="large">{GO_BACK}</Button></Link>
            </div>
        );
    }
}

export default ServerError;