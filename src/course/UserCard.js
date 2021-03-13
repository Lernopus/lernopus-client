import React, { Component } from 'react';
import './UserCard.css';
import { Avatar, Card, Tooltip, Row, Col, Statistic, Typography, Rate } from 'antd';
import { UserOutlined, BookOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { Button } from 'antd';
import { addFollowersForUser} from '../util/APIUtils';
const { Meta } = Card;
const { Text } = Typography;

class UserCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toBeFollowed: true,
            currentUser: props.currentUser,
            displayedUser: props.user
        };

        this.handleUserFollowingChange = this.handleUserFollowingChange.bind(this);
    }

    handleUserFollowingChange() {
        var tobefollowedUserId = this.state.displayedUser.laUserId;
        var currentUserId = this.state.currentUser.laUserId;
        if(tobefollowedUserId !== null && tobefollowedUserId !== undefined && currentUserId !== null && currentUserId !== undefined) {  
          var laUserFollowing = {
            laUserId: JSON.stringify(currentUserId),
            laUserFollowerId: JSON.stringify(tobefollowedUserId)
          };
          addFollowersForUser(laUserFollowing)
            .then(response => {
              if(response !== null && response !== undefined) {
                this.setState ({
                    toBeFollowed: !this.state.toBeFollowed
                });
              }
            });
        }
  
      }

    render() {
        
        return (
            <div>
            <Card className = 'course-card user-to-follow-card'
                bordered = {this.props.bordered}
                cover={
                    <Link to={`/users/${this.props.user.laUserName}`}>
                    <div >
                    {
                        this.props.user.laImagePath ? (
                            <img className="user-avatar-circle user-card-avatar-circle" src={this.props.user.laImagePath} alt={this.props.user.name}/>
                        ) : 
                        <Avatar className="user-avatar-circle user-card-avatar-circle" style={{ backgroundColor: getAvatarColor(this.props.user.name)}}>
                            {this.props.user.name[0].toUpperCase()}
                         </Avatar>
                    }
                    </div>
                    </Link>
            }
            actions={[
      <span key=' key="whishlist"'>
      <Tooltip title="Get Course Suggestions By this Author">
        <Button type = 'primary' icon={<UserAddOutlined/>} onClick={this.handleUserFollowingChange} block>{this.state.toBeFollowed ? 'Follow' : 'Unfollow'}</Button>
      </Tooltip>
    </span>]}
            >
            <Meta
            bordered = {this.props.bordered}
            title={
                <Link to={`/users/${this.props.user.laUserName}`}>
                    {this.props.user.laUserFullName}
                </Link>
            }
            description = {
                <Link to={`/users/${this.props.user.laUserName}`}>
                <div>
                <Row>
                    <Text className = 'lernopus-user-designation'>Instructor / Student</Text>
                </Row>
                <Row>
                    <Rate className = 'lernopus-user-rating' disabled defaultValue={4} />
                </Row>
                <Row gutter={16} className = 'lernopus-statistics-row'>
                <Col span={12}>
                    <Statistic title="Students" value={19496} prefix={<UserOutlined />} />
                </Col>
                <Col span={12}>
                    <Statistic title="Courses" value={93} prefix={<BookOutlined />} />
                </Col>
                </Row>
                </div>
                </Link>
            }
            />
            </Card>
            </div>
        );
    }
}


export default UserCard;