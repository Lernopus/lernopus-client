import React, { Component } from 'react';
import './AuthorDetailsComponent.css';
import { Typography, Card } from 'antd';
import { Tabs } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import UserCard from './UserCard';
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;

class AuthorDetailsComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
              <Tabs defaultActiveKey="1">
                      <TabPane
                        tab={
                            <span>
                            <EditOutlined />
                                {this.props.tabName}
                            </span>
                            }
                            key="1"
                      >
                      <div className = 'course-author-details'>
                          <AuthorInfoComponent author = {this.props.author} currentUser  = {this.props.currentUser}
                          authorDescription = {this.props.authorDescription} ></AuthorInfoComponent>
                      </div>
                      </TabPane>
              </Tabs>
        );
    }
}

  function AuthorInfoComponent(props){
    return (
        <div>
        <Row>
        <Col span = {8} className = 'course-detail-author-info-card-col'>
        <UserCard key={props.author.laUserId} 
      user={props.author} bordered = {false}></UserCard>
        </Col>
        <Col  span = {16} className = 'course-detail-author-info-detail-card-col'>
        <AuthorInfoDetailsComponent key={props.author.laUserId} 
      author={props.author} authorDescription = {props.authorDescription} ></AuthorInfoDetailsComponent>
        </Col>
        </Row>
        </div>
    );
  };

  function AuthorInfoDetailsComponent(props){
    return (
        <div>
        <Card bordered = {false}>
            <Meta bordered = {false}
            title={
                <Link to={`/users/${props.author.laUserName}`}>
                    {props.author.laUserFullName}
                </Link>
            }
            description = {
              props.authorDescription
            }
            />
            </Card>
        </div>
    );
  };

export default withRouter(AuthorDetailsComponent);