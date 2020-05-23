import React, { Component } from 'react';
import { getCliqueList} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { List, Avatar, Spin, Typography, message, Row, Col, Tooltip, Button, Rate, Statistic } from 'antd';
import { USER_LIST_SIZE } from '../constants';
import { Link, withRouter } from 'react-router-dom';
import { StarTwoTone, HeartOutlined, UserAddOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import './CliqueDetailIUserList.css';
import { getAvatarColor } from '../util/Colors';

const { Text } = Typography;

class CliqueDetailIUserList extends Component {
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
            isLoading: false,
            cliqueId : '',
            cliqueName : ''
        };
        this.loadCliqueDetailList = this.loadCliqueDetailList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadCliqueDetailList(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getCliqueList(page, size, this.props.currentUser.laUserId, this.props.cliqueId);
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
                isLoading: false,
                cliqueId : this.props.cliqueId,
                cliqueName : this.props.cliqueName
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isLoading: false
            })
        }.bind(this));  
        
    }

    componentDidMount() {
        this.loadCliqueDetailList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated && !this.state.isLoading) {
            // Reset State
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
        }
    }

    handleLoadMore() {
        if(!this.state.isLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                if(this.state.last)
                {
                    message.warning('Infinite List loaded all');
                }
                else
                {
                    this.loadCliqueDetailList(this.state.page + 1);
                }
            }
        }
    }

    render() {
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
            {
                !this.state.isLoading && this.state.users.length === 0 && (this.state.page === 0) ? (
                    <div className="no-users-found">
                        <span>No Students Found.</span>
                    </div>    
                ): null
            }                
            {
                this.state.isLoading && this.state.users.length === 0 ? 
                <LoadingIndicator />: null                     
            }
        </div>
        );
    }
}

export default withRouter(CliqueDetailIUserList);