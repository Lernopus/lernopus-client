import React, { Component } from 'react';
import { getCategoryAuthorsToFollow} from '../util/APIUtils';
import { USER_LIST_SIZE } from '../constants';
import { withRouter, Link } from 'react-router-dom';
import { SnippetsOutlined, StarTwoTone, HeartOutlined, UserAddOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';
import InfiniteScroll from 'react-infinite-scroller';
import { List, Tooltip, Button, Avatar, Row, Col, Statistic, Rate, Spin, Typography } from 'antd';
import { getAvatarColor } from '../util/Colors';

const { Text } = Typography;

class CategoryAuthorToFollowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            actualUserCount : 0,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadUserList = this.loadUserList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadUserList(categoryId, page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getCategoryAuthorsToFollow(categoryId, page, size, this.props.currentUser.laUserId);
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(function(response)  {
            const users = this.state.users.slice();

            this.setState({
                actualUserCount : response.content.length,
                users: users.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isLoading: false
            })
        }.bind(this));  
        
    }

    componentDidMount() {
        const categoryId = this.props.match.params.categoryId;
        if(categoryId !== null && categoryId !== undefined && categoryId !== '')
        {
            this.loadUserList(categoryId);
        }
        else if(this.props.categoryId !== null && this.props.categoryId !== undefined && this.props.categoryId !== '')
        {
            this.loadUserList(this.props.categoryId);
        }
        
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated && !this.state.isLoading) {
            // Reset State
            this.setState({
                users: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
        }
    }

    handleLoadMore() {
        if(!this.state.isLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                const categoryId = this.props.match.params.categoryId;
                if(categoryId !== null && categoryId !== undefined && categoryId !== '')
                {
                    this.loadUserList(categoryId,this.state.page + 1);
                }
                else if(this.props.categoryId !== null && this.props.categoryId !== undefined && this.props.categoryId !== '')
                {
                    this.loadUserList(this.props.categoryId,this.state.page + 1);
                }
            }
        }
    }

    render() {
        if(this.props.isScrollCard)
        {
            return (
                <TabWithScrollableCardComponent data = {this.state.users} seeAll = 'See All' 
                tabName = 'Talents To Follow' handleLoadMore = {this.handleLoadMore} 
                isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Talents To Follow Found.'
                seeAllLink = {`/`} tabIcon = {<SnippetsOutlined />} tabKey = {'1'} isCourse = {false} isUser = {true} isCategory = {false}/>
            );
        }
        else if(this.props.isScrollList)
        {
            const IconText = ({ icon, text }) => (
                <span>
                    {React.createElement(icon, { style: { marginRight: 8 } })}
                    {text}
                </span>
            );
            
            return (
                <div className="demo-infinite-container-1">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.handleLoadMore}
                            hasMore={!this.state.isLoading && !this.state.last}
                            useWindow={false}
                        >
                            <List
                                dataSource={this.state.users}
                                size="large"
                                itemLayout="vertical"
                                renderItem={item => (
                                <List.Item
                                    key={item.laUserId}
                                    actions={[
                                        <IconText icon={StarTwoTone} text="2.5" key="list-vertical-star-o" />,
                                        <IconText icon={HeartOutlined} text="1234" key="list-vertical-like-o" />,
                                        <div>
                                        <span key='whishlist'>
                                            <Tooltip title="Get Course Suggestions By this Author">
                                                <Button type = 'primary' icon={<UserAddOutlined/>}>Follow</Button>
                                            </Tooltip>
                                        </span>
                                        </div>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={(<div >
                                            <Link to={`/users/${item.laUserName}`}>
                                            <div >
                                            {
                                                item.laImagePath ? (
                                                    <img className="ant-avatar" src={item.laImagePath} alt={item.laUserName}/>
                                                ) : <Avatar style={{ backgroundColor: getAvatarColor(item.laUserName)}}>
                                                {item.laUserName[0].toUpperCase()}
                                                </Avatar>
                                            }
                                            </div>
                                            </Link>
                                        </div>)}
                                        title={<a href={`/users/${item.laUserName}`}>{item.laUserFullName}</a>}
                                        description={
                                            <div>
                                        <Row>
                                            <Text className = 'lernopus-user-designation'>Instructor / Student</Text>
                                        </Row>
                                        <Row>
                                            <Text>Ant Design, a design language for background applications, is refined by Ant UED Team.</Text>
                                        </Row>
                                        <Row>
                                            <Rate className = 'lernopus-user-rating' disabled defaultValue={4} />
                                        </Row>
                                        <Row gutter={24} className = 'lernopus-statistics-row'>
                                            <Col span={8}>
                                                <Statistic title="Students" value={19496} prefix={<UserOutlined />} />
                                            </Col>
                                            <Col span={8}>
                                                <Statistic title="Courses" value={93} prefix={<BookOutlined />} />
                                            </Col>
                                            <Col span = {8}>
                                            <Statistic title="Tests Completed" value={64} prefix={<BookOutlined />} />
                                        </Col>
                                        </Row>
                                        </div>
                                        }
                                    />
                                </List.Item>
                                )}
                            >
                            {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                            )}
                            </List>
                        </InfiniteScroll>
                    </div>
            );
        }
    }
}

export default withRouter(CategoryAuthorToFollowList);