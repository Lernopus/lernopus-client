import React, { Component } from 'react';
import Course from './Course';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Tabs, Layout, Typography } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { LeftCircleFilled , RightCircleFilled, ReadOutlined } from '@ant-design/icons';
import './TabWithScrollableCardComponent.css';
import UserCard from './UserCard';
import Category from './Category';

const { TabPane } = Tabs;
const {Content} = Layout;
const { Text } = Typography;

class TabWithScrollableCardComponent extends Component {
    constructor(props) {
        super(props);   
    }

    render() {
        const dataList = [];

        this.props.isCourse  ? (
            this.props.data.forEach((course, courseIndex) => {
                dataList.push(<Course
                    key={course.learnCourseId} 
                    course={course}
                    />)            
            })    
        ): this.props.isUser  ? (this.props.data.forEach((user, userIndex) => {
            dataList.push(<UserCard
                key={user.laUserId}
                bordered = {true} 
                user={user}
                />)            
        })) : this.props.data.forEach((category, categoryIndex) => {
            dataList.push(<Category
                key={category.techId} 
                category={category}
                />)            
        });

        return (
            <div className = 'course-accordion'>
            <Content
          className="site-layout-background course-detail-content">
            <Tabs defaultActiveKey="1" 
            tabBarExtraContent={<div>
                <Link to = {this.props.seeAllLink}>
                <Text className = 'lernopus-see-all'>{this.props.seeAll}</Text>
                </Link>
                </div>}>
                      <TabPane
                        tab={
                            <span>
                            {this.props.tabIcon}
                                {this.props.tabName}
                            </span>
                            }
                            key={this.props.tabKey}
                      >
                      <ScrollMenu
                            data={dataList}
                            arrowLeft={<LeftCircleFilled/>}
                            arrowRight={<RightCircleFilled/> }
                            hideArrows = {false} transition = {0.7} hideSingleArrow = {true} onLastItemVisible = {this.props.handleLoadMore}
                        />
                      </TabPane>
              </Tabs>
                {
                    !this.props.isLoading && this.props.data.length === 0 && (this.props.page === 0) ? (
                        <div className="no-courses-found">
                            <span>{this.props.noDataFoundMsg}</span>
                        </div>    
                    ): null
                }                
                {
                    this.props.isLoading && this.props.data.length === 0 ? 
                    <LoadingIndicator />: null                     
                }
            </Content>
            </div>
        );
    }
}

export default withRouter(TabWithScrollableCardComponent);