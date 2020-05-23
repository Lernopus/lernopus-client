import React, { Component } from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { NOT_FOUND_CODE, PAGE_NOT_FOUND , GO_BACK} from '../constants/index';

class NotFound extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    {NOT_FOUND_CODE}
                </h1>
                <div className="desc">
                    {PAGE_NOT_FOUND}
                </div>
                <Link to="/"><Button className="go-back-btn" type="primary" size="large">{GO_BACK}</Button></Link>
            </div>
        );
    }
}

export default NotFound;