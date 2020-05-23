import React, { Component } from 'react';
import { getStudentList, getAuthorsListForSearch} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Tabs, List, Avatar, Spin, Typography, message, Row, Col, Tooltip, Button, Rate, Statistic } from 'antd';
import { USER_LIST_SIZE } from '../constants';
import { Link, withRouter } from 'react-router-dom';
import { SnippetsOutlined, StarTwoTone, HeartOutlined, UserAddOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import './StudentsDetailList.css';
import { getAvatarColor } from '../util/Colors';

const { TabPane } = Tabs;
const { Text } = Typography;

class StudentsDetailList extends Component {
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
        this.loadStudentDetailList = this.loadStudentDetailList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadStudentDetailList(page = 0, size = USER_LIST_SIZE) {
        let promise;
        if(this.props.isSearch)
        {
            promise = getAuthorsListForSearch(page, size, this.props.currentUser.laUserId, this.props.searchValue);
        }
        else
        {
            promise = getStudentList(page, size, this.props.currentUser.laUserId);
        }
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
        this.loadStudentDetailList();
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
                    this.loadStudentDetailList(this.state.page + 1);
                }
            }
        }
    }

    render() {
        
        if(this.props.isSearch && this.state.users.length === 0)
        {
            return(null);
        }
        
        const IconText = ({ icon, text }) => (
            <span>
                {React.createElement(icon, { style: { marginRight: 8 } })}
                {text}
            </span>
        );
        
        return (
            <div className = 'category-accordion'>
            <Tabs defaultActiveKey="2">
                    <TabPane
                      tab={
                          <span>
                          <SnippetsOutlined />
                          My Students 
                          </span>
                          }
                          key="1"
                    >
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
                    </TabPane>
            </Tabs>             
                {
                    this.state.isLoading && this.state.users.length === 0 ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

function IconLinkComponent(props) {
    return (
        <div>
            <a className="example-link">
                <img className="example-link-icon" src={props.src} alt={props.text} />
                {props.text}
            </a>
        </div>
      );
  }

export default withRouter(StudentsDetailList);