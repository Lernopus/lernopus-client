import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import Chips, { Chip } from 'react-chips'
import './CourseDetail.css';
import Course from './Course';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCourseDetails } from '../util/APIUtils';
import { Button, Icon } from 'antd';
import { Avatar, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import { COURSE_LIST_SIZE } from '../constants';
import theme from './ReactChipTheme';

class CourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: [],
            isLoading: true
        };
        this.loadCourseDetails = this.loadCourseDetails.bind(this);
    }

    loadCourseDetails(learnCourseId,page = 0, size = COURSE_LIST_SIZE) {
        this.setState({
            isLoading: true
        });

        getCourseDetails(learnCourseId,page, size)
        .then(response => {
            
            if(response.childCoursePageResponse!== null && response.childCoursePageResponse.courses!== null)
            {
                const courses = [];
                this.setState({
                    course: response,
                    courses: courses.concat(response.childCoursePageResponse.content),
                    page: response.childCoursePageResponse.page,
                    size: response.childCoursePageResponse.size,
                    totalElements: response.childCoursePageResponse.totalElements,
                    totalPages: response.childCoursePageResponse.totalPages,
                    last: response.childCoursePageResponse.last,
                    isLoading: false
                });
            }
            else
            {
                this.setState({
                    course: response,
                    isLoading: false
                });
            }
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
      
    componentDidMount() {
        const learnCourseId = this.props.match.params.learnCourseId;
        this.loadCourseDetails(learnCourseId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                courses: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                // currentVotes: [],
                isLoading: false
            });    
            const learnCourseId = this.props.match.params.learnCourseId;
            this.loadCourseDetails(learnCourseId);
        }
    }

    handleLoadMore() {
        const learnCourseId = this.props.match.params.learnCourseId;
        this.loadCourseDetails(learnCourseId,this.state.page + 1);
    }

    componentWillReceiveProps(nextProps, state) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                courses: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                // currentVotes: [],
                isLoading: false
            });    
            var learnCourseId = nextProps.match.params.learnCourseId;
            this.loadCourseDetails(learnCourseId);
        }
        else
        {
            if(!!nextProps.match.params.learnCourseId && !isNaN(nextProps.match.params.learnCourseId))
            {
                var learnCourseId = nextProps.match.params.learnCourseId;
                this.loadCourseDetails(learnCourseId);
            }
        }
    }

    render() {
        const courseViews = [];
        if(this.state.courses !== null && this.state.courses !== undefined)
        {
            this.state.courses.forEach((course, courseIndex) => {
                courseViews.push(<Course 
                    key={course.learnCourseId} 
                    course={course}
                    />)            
            });
        }

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            
            <div className="new-course-container">
                    <div className="course-creator-info">
                        <Link className="creator-link" to={`/users/${this.state.course.createdBy.laUserName}`}>
                            <Avatar className="course-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.state.course.createdBy.laUserFullName)}} >
                                {this.state.course.createdBy.laUserFullName[0].toUpperCase()}
                            </Avatar>
                            <span className="course-creator-name">
                                {this.state.course.createdBy.laUserFullName}
                            </span>
                            <span className="course-creator-username">
                                @{this.state.course.createdBy.laUserName}
                            </span>
                            <span className="course-creation-date">
                                {formatDateTime(this.state.course.laCreatedAt)}
                            </span>
                        </Link>
                    </div>
                    <div className="new-course-content">
                        <div className="course-question">
                            {this.state.course.laLearnCourseName}
                        </div>
                        <div  id = 'tech-tag-div'>
                            <Chips id = 'tech-tag'
                                value={this.state.course.laTechTag}
                                theme = {theme}
                            />
                        </div>
                    </div>
                    {
                    courseViews.length>0 ?(
                            <div>
                            <div>
                            <span className="course-creator-name">
                                Sub Courses:
                            </span>
                            <div>
                            </div>
                            </div>
                                {courseViews}  
                                {
                                    !this.state.isLoading && !this.state.last ? (
                                        <div className="load-more-courses"> 
                                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                            <Icon type="plus" /> Load more
                                        </Button>
                                    </div>): null
                                }
                            </div>
                    ) : null
                    }
                    <div>
                    <span dangerouslySetInnerHTML={{__html: this.state.course.laCourseContentHtml}} />
                    </div>

                    {
                        this.state.course.laLearnAttachments.length > 0
                        ? <div className='files-list'>
                          <ul>{this.state.course.laLearnAttachments.map((file) =>
                            <li className='files-list-item' key={file.laAttachName}>
                              <div className='files-list-item-preview'>
                                {file.laAttachPreview.type === 'image'
                                ? <img className='files-list-item-preview-image' src={file.laAttachPreview.url} /> // eslint-disable-line
                                : <div className='files-list-item-preview-extension'>{file.laAttachExtension}</div>}
                              </div>
                              <div className='files-list-item-content'>
                                <div className='files-list-item-content-item files-list-item-content-item-1'>{file.laAttachName}</div>
                                <div className='files-list-item-content-item files-list-item-content-item-2'>{file.laAttachmentSize}</div>
                              </div>
                            </li>
                          )}</ul>
                        </div>
                        : null
                      }
                        
            </div>
            // <div className="profile">
            //     { 
            //         this.state.user ? (
            //             <div className="user-profile">
            //                 <div className="user-details">
            //                     <div className="user-avatar">
            //                         <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
            //                             {this.state.user.name[0].toUpperCase()}
            //                         </Avatar>
            //                     </div>
            //                     <div className="user-summary">
            //                         <div className="full-name">{this.state.user.name}</div>
            //                         <div className="username">@{this.state.user.username}</div>
            //                         <div className="user-joined">
            //                             Joined {formatDate(this.state.user.joinedAt)}
            //                         </div>
            //                     </div>
            //                 </div>
            //                 <div className="user-course-details">    
            //                     <Tabs defaultActiveKey="1" 
            //                         animated={false}
            //                         tabBarStyle={tabBarStyle}
            //                         size="large"
            //                         className="profile-tabs">
            //                         <TabPane tab={`${this.state.user.courseCount} courses`} key="1">
            //                             <courseList username={this.props.match.params.username} type="USER_CREATED_courseS" />
            //                         </TabPane>
            //                         <TabPane tab={`${this.state.user.voteCount} Votes`}  key="2">
            //                             <courseList username={this.props.match.params.username} type="USER_VOTED_courseS" />
            //                         </TabPane>
            //                     </Tabs>
            //                 </div>  
            //             </div>  
            //         ): null               
            //     }
            // </div>
        );
    }
}

export default CourseDetail;