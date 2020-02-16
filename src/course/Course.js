import React, { Component } from 'react';
import './Course.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Course extends Component {

    render() {
        
        return (
            <div className="course-content">
            <Link className="creator-link" to={`/learnCourseId/${this.props.course.learnCourseId}`}>
                <div className="course-header">
                    <div className="course-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.course.createdBy.laUserName}`}>
                            <Avatar className="course-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.course.createdBy.laUserFullName)}} >
                                {this.props.course.createdBy.laUserFullName[0].toUpperCase()}
                            </Avatar>
                            <span className="course-creator-name">
                                {this.props.course.createdBy.laUserFullName}
                            </span>
                            <span className="course-creator-username">
                                @{this.props.course.createdBy.laUserName}
                            </span>
                            <span className="course-creation-date">
                                {formatDateTime(this.props.course.laCreatedAt)}
                            </span>
                        </Link>
                    </div>
                    <div className="course-question">
                        {this.props.course.laLearnCourseName}
                    </div>
                </div>
            </Link>
            </div>
        );
    }
}


export default Course;