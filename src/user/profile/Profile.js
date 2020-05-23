import React, { Component } from 'react';
import { getUserProfile, getUserCreatedCourses, getUserCreatedCoursesForSearchSuggestion, getUserCreatedCoursesForSearch } from '../../util/APIUtils';
import { Tabs, Layout, AutoComplete, Typography, Row } from 'antd';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import UserCard from '../../course/UserCard';
import { COURSE_LIST_SIZE } from '../../constants';
import TabWithScrollableCardComponent from '../../course/TabWithScrollableCardComponent';
import { ReadOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
const {Content} = Layout;
const TabPane = Tabs.TabPane;
const { Option } = AutoComplete;
const { Title} = Typography;


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            user: null,
            actualCourseCount : 0,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            isCourseLoading: false,
            options: [],
            searchResult : '',
            isSearchLoading : false,
        };
        this.loadCourseList = this.loadCourseList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.onSearchComplete = this.onSearchComplete.bind(this);
        this.handleSearchWithOptionTag = this.handleSearchWithOptionTag.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }

    loadCourseList(username, page = 0, size = COURSE_LIST_SIZE) {
        let promise;
        promise = getUserCreatedCourses(username, page, size);
        if(!promise) {
            return;
        }

        this.setState({
            isCourseLoading: true
        });
        promise            
        .then(function(response)  {
            const courses = this.state.courses.slice();

            this.setState({
                actualCourseCount : response.content.length,
                courses: response.page === 0 ? response.content : courses.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isCourseLoading: false,
                searchResult : ''
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isCourseLoading: false
            })
        }.bind(this));  
        
    }

    handleLoadMore() {
        if(!this.state.isCourseLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                this.loadCourseList(this.props.match.params.username, this.state.page + 1);
            }
        }
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
        this.loadCourseList(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(this.props.match.params.username);
            this.loadCourseList(this.props.match.params.username);
        }        
    }

    handleSearchWithOptionTag(searchedValue) {
        let promise;
        if(searchedValue !== null && searchedValue !== undefined && searchedValue !== '') {
            promise = getUserCreatedCoursesForSearchSuggestion(this.props.match.params.username, 0, 8, searchedValue);
        }
        else
        {
            this.setState({
                options : [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            })
        }

        if(!promise) {
            return;
        }

        this.setState({
            isSearchLoading: true,
            searchResult : ''
        });
        promise            
        .then(function(response)  {

            var searchResult = [];
            var searchedCourseId = [];
            
            var searchedCourseResultMap = [];
            
            response.forEach((searchResultValue, courseIndex) => {
                var searchValue;
            
                if(searchResultValue['laSearchCourseResults'] !== null && searchResultValue['laSearchCourseResults'] !== undefined)
                {
                    if(!searchedCourseId.includes(searchResultValue['laSearchCourseResults']['value']))
                    {
                        searchValue = searchResultValue['laSearchCourseResults'];
                        searchedCourseId.push(searchResultValue['laSearchCourseResults']['value']);
                        searchedCourseResultMap.push(<Option key={'' + searchValue['value'] + ''} value={'' + searchValue['label'] + ''}>
                            {searchValue['label']}
                        </Option>);      
                    }
                }
            })

            if(searchedCourseResultMap.length === 0)
            {
                searchResult = [<Option key={''} value={''}>
                {'Not Applicable'}
              </Option>]
            }
            else
            {
                searchResult = searchedCourseResultMap;

            }  
            this.setState({
                options : searchResult,
                isSearchLoading : false
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isSearchLoading: false
            })
        }.bind(this));  
        
    }

    onSearchComplete(searchedValue) {
        let promise;
        promise = getUserCreatedCoursesForSearch(this.props.match.params.username, 0, 5, searchedValue);
        if(!promise) {
            return;
        }

        this.setState({
            isCourseLoading: true,
            searchResult : searchedValue
        });
        promise            
        .then(function(response)  {
            const courses = this.state.courses.slice();

            this.setState({
                actualCourseCount : response.content.length,
                courses: response.page === 0 ? response.content : courses.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isCourseLoading: false
            })
        }.bind(this)).catch(function (error) {
            this.setState({
                isCourseLoading: false
            })
        }.bind(this));  
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <Content
          className="site-layout-background course-detail-content"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
            <div className="profile">
                { 
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                            <UserCard key={this.state.user.laUserId} 
                            user={this.state.user} bordered = {false}></UserCard>
                            </div>
                            <div className="user-course-details">    
                                <Tabs defaultActiveKey="1" 
                                    animated={false}
                                    tabBarStyle={tabBarStyle}
                                    size="large"
                                    className="profile-tabs">
                                    <TabPane tab={`${this.state.user.courseCount} Course`} key="1">
                                    <Row>
                                        <Title className = 'lernopus-course-create-header' level={3}>Learn Opus Search</Title>
                                    </Row>
                                    <Row>    
                                        <AutoComplete
                                            dropdownMatchSelectWidth={true}
                                            style={{
                                            width: '100%'
                                        }}
                                        onSelect={this.onSearchComplete}
                                        onSearch={this.handleSearchWithOptionTag}
                                        >
                                            {
                                                !this.state.isSearchLoading ? (this.state.options) : null
                                            }
                                        </AutoComplete>
                                    </Row>
                                    <TabWithScrollableCardComponent data = {this.state.courses} seeAll = 'See All' 
                                    tabName = 'Courses taught by the Author' handleLoadMore = {this.handleLoadMore} 
                                    isLoading = {this.state.isCourseLoading} page = {this.state.page} noDataFoundMsg = 'No Courses by this Author.'
                                    seeAllLink = {`/`} tabIcon = {<ReadOutlined />} tabKey = {'1'} isCourse = {true} isUser = {false} isCategory = {false}/>
                                    </TabPane>
                                </Tabs>
                            </div>  
                        </div>  
                    ): null               
                }
            </div>
        </Content>
        );
    }
}

export default withRouter(Profile);