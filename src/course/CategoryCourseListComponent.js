import React, { Component } from 'react';
import { getCategoryCourseList} from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Collapse, Tabs, List, Avatar, Spin, Typography, message } from 'antd';
import { USER_LIST_SIZE } from '../constants';
import { Link, withRouter } from 'react-router-dom';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { LeftCircleFilled , RightCircleFilled, SnippetsOutlined, StarTwoTone, HeartOutlined } from '@ant-design/icons';
import PostgresSQL from '../pictures/PostgresSQL.jpg';
import InfiniteScroll from 'react-infinite-scroller';
import './CategoryDetailCourseList.css';
import { getAvatarColor } from '../util/Colors';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Paragraph } = Typography;

class CategoryDetailCourseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            actualCourseCount : 0,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            // currentVotes: [],
            isLoading: false
        };
        this.loadCategoryCourseList = this.loadCategoryCourseList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadCategoryCourseList(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getCategoryCourseList(this.props.categoryId, page, size, this.props.currentUser.laUserId);
        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise            
        .then(function(response)  {
            const courses = this.state.courses.slice();

            this.setState({
                actualCourseCount : response.content.length,
                courses: courses.concat(response.content),
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
        this.loadCategoryCourseList();
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
                    this.loadCategoryCourseList(this.state.page + 1);
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
                                dataSource={this.state.courses}
                                size="large"
                                itemLayout="vertical"
                                renderItem={item => (
                                <List.Item
                                    key={item.learnCourseId}
                                    actions={[
                                        <IconText icon={StarTwoTone} text="2.5" key="list-vertical-star-o" />,
                                        <IconText icon={HeartOutlined} text="1234" key="list-vertical-like-o" />
                                    ]}
                                    extra={
                                        <img
                                            width={272}
                                            alt="logo"
                                            src={PostgresSQL}
                                        />
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={(<div >
                                            <Link to={`/users/${item.createdBy.laUserName}`}>
                                            <div >
                                            {
                                                item.createdBy.laImagePath ? (
                                                    <img className="ant-avatar" src={item.createdBy.laImagePath} alt={item.createdBy.laUserName}/>
                                                ) : <Avatar style={{ backgroundColor: getAvatarColor(item.createdBy.laUserName)}}>
                                                {item.createdBy.laUserName[0].toUpperCase()}
                                                </Avatar>
                                            }
                                            </div>
                                            </Link>
                                        </div>)}
                                        title={<a href={`/learnCourseId/${item.learnCourseId}`}>{item.laLearnCourseName}</a>}
                                        description={
                                            'Ant Design, a design language for background applications, is refined by Ant UED Team.'
                                        }
                                    />
                                    {'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'}
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
                    !this.state.isLoading && this.state.courses.length === 0 && (this.state.page === 0) ? (
                        <div className="no-users-found">
                            <span>No Related Courses Found.</span>
                        </div>    
                    ): null
                }                
                {
                    this.state.isLoading && this.state.courses.length === 0 ? 
                    <LoadingIndicator />: null                     
                }
                </div>
        );
    }
}

export default withRouter(CategoryDetailCourseList);