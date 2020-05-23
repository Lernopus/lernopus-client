import React, { Component } from 'react';
import {
    Link,
    withRouter, NavLink 
} from 'react-router-dom';
import './AppHeader.css';
import courseIcon from '../course.svg';
import { Layout, Menu, Dropdown, Icon, Row, Col } from 'antd';
const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" className="home-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/search">
              <Link to="/search">
              <Icon type="search" alt="search" className="search-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/course/new">
            <Link to="/course/new">
              <img src={courseIcon} alt="course" className="course-icon" />
            </Link>
          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>                  
          ];
        }

        return (
          <Header className="app-header">
            <Row>
              <Col flex={4} className = 'app-header-icon-responsive'>
                <div className="app-title" >
                  <Link to="/">Learn Opus</Link>
                </div>
              </Col>
              <Col flex = {1} >
                <Menu
                  theme = "dark"
                  className="app-menu"
                  mode="horizontal"
                  selectedKeys={[this.props.location.pathname]}
                  style={{ lineHeight: '64px' }} >
                    {menuItems}
                </Menu>
              </Col>
            </Row>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.laUserFullName}
        </div>
        <div className="username-info">
          @{props.currentUser.laUserName}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.laUserName}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="user-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);