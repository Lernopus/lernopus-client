import React, { Component } from 'react';
import './Course.css';
import { Avatar, Icon, Card, Tooltip, Tag } from 'antd';
import { StarTwoTone , HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import PostgresSQL from '../pictures/PostgresSQL.jpg';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;
const { Meta } = Card;

class Course extends Component {

    render() {
        
        return (
            <div>
            <Link to={`/learnCourseId/${this.props.course.learnCourseId}`}>
            <Card className = 'course-card'
                cover={
                    <img
                        alt="PostgresSQL"
                        src={PostgresSQL}
                />
            }
            actions={[
                <Tag color="#87d068">₹420</Tag>,
                 <span key=' key="rating"'>
        <Tooltip title="rating">
          {React.createElement(StarTwoTone, {})}
        </Tooltip>
        <span>{2.5}</span>
      </span>,
      <span key=' key="whishlist"'>
      <Tooltip title="Add to Whishlist">
        {React.createElement(HeartOutlined, {})}
      </Tooltip>
    </span>,
            ]}
            >
            <Meta
                avatar={<div >
                <Link to={`/users/${this.props.course.createdBy.laUserName}`}>
                    <Avatar  
                        style={{ backgroundColor: getAvatarColor(this.props.course.createdBy.laUserFullName)}} >
                        {this.props.course.createdBy.laUserFullName[0].toUpperCase()}
                    </Avatar>
                </Link>
            </div>}
                title={this.props.course.laLearnCourseName}
            />
            </Card>
            </Link>
            </div>
        );
    }
}


export default Course;