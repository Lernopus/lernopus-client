import React, { Component } from 'react';
import {
    withRouter, Link
} from 'react-router-dom';
import './LernopusSider.css';
import { Layout, Menu, Avatar, Row, Typography, Rate, Button, Statistic, Col } from 'antd';
import { getAvatarColor } from '../util/Colors';
import 'antd/dist/antd.css';
import { UserOutlined, BookOutlined, HomeOutlined, FileTextOutlined, ShoppingCartOutlined, ScheduleOutlined } from '@ant-design/icons';
const { Sider } = Layout;
const { Title, Text } = Typography;
    
class LernopusSider extends Component {
    constructor(props) {
        super(props);   
    }

    render() {
      if(!this.props.currentUser)
      {
        return null;
      }
        return (
          <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        
      }}
      onCollapse={(collapsed, type) => {
        
      }}
      className = 'lernopus-app-sider'
    >
      <div className="lernopus-app-logo" />
      <div className="lernopus-user-details">
      <Row>
          {
            this.props.currentUser.laImagePath ? (
              <img className="lernopus-user-avatar-circle" src={this.props.currentUser.laImagePath} alt={this.props.currentUser.name}/>
              ) : 
            <Avatar className="lernopus-user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.props.currentUser.name)}}>
              {this.props.currentUser.name[0].toUpperCase()}
            </Avatar>
            }
      </Row>
      <Row>
      <Title className = 'lernopus-user-name' level={3}>{this.props.currentUser.laUserFullName}</Title>
      </Row>
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
      <Row>
      <Link to={`/users/${this.props.currentUser.laUserName}`}>
      <Button className = 'lernopus-user-profile' type="primary" shape="round" size='large'>
          View Profile
      </Button>
      </Link>
      </Row>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
      
          <Menu.Item key="1">
          <Link to="/">
            <HomeOutlined />
            <span className="nav-text">Home</span>
          </Link>
          </Menu.Item>
        <Menu.Item key="2">
        <Link to={`/users/${this.props.currentUser.laUserName}`}>
          <BookOutlined />
          <span className="nav-text">My Courses</span>
        </Link>
        </Menu.Item>
        <Menu.Item key="3">
        <Link to={`/cliqueDetails/${this.props.currentUser.laUserName}`}>
          <FileTextOutlined />
          <span className="nav-text">My Clique</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
        <Link to={`/courseDetailList/${this.props.currentUser.laUserId}/purchased`}>
          <ShoppingCartOutlined />
          <span className="nav-text">Purchased Courses</span>
        </Link>
        </Menu.Item>
        <Menu.Item key="5">
        <Link to={`/courseDetailList/${this.props.currentUser.laUserId}/bookmarked`}>
          <ScheduleOutlined />
          <span className="nav-text">Bookmarked Courses</span>
        </Link>
        </Menu.Item>
        <Menu.Item key="6">
        <Link to={`/studentDetails/${this.props.currentUser.laUserId}`}>
          <UserOutlined />
          <span className="nav-text">Students</span>
        </Link>
        </Menu.Item>
      </Menu>
    </Sider>
        );
    }
}


export default withRouter(LernopusSider);