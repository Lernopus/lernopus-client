import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import './CourseDetail.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCourseDetails, uploadComment, uploadRating } from '../util/APIUtils';
import { Typography, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import { CheckCircleFilled, TeamOutlined, UserOutlined, ProfileOutlined, LinkOutlined, DesktopOutlined, VideoCameraOutlined, LikeOutlined } from '@ant-design/icons';
import RatingAndRatingInfoTabComponent from './RatingAndRatingInfoTabComponent';
import PageHeaderComponent from './PageHeaderComponent';
import RequirementTabComponent from './RequirementTabComponent';
import FeedbackCommentComponent from './FeedbackCommentComponent';
import AuthorDetailsComponent from './AuthorDetailsComponent';
import CourseContentHTMLComponent from './CourseContentHTMLComponent';
import TabWithCardPaginationComponent from './TabWithCardPaginationComponent';
import URLSildeVideoReferenceTabComponent from './URLSildeVideoReferenceTabComponent';
import AttachmentPreviewTabComponent from './AttachmentPreviewTabComponent';
const { Paragraph } = Typography;
const {Content} = Layout;

class CourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: [],
            isLoading: true,
            studentsFeedback : [],
            commentContent : '',
            isAuthenticated : props.isAuthenticated,
            currentUser : props.currentUser,
            prerequisiteContent : [{
              tabId : '',
              tabName : '',
              tabContent : '',
              tabIcon : ''
            }]
        };
        this.loadCourseDetails = this.loadCourseDetails.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleAddCommentChange = this.handleAddCommentChange.bind(this);
        this.handleCommentTextInputChange = this.handleCommentTextInputChange.bind(this);
        this.handleAddRatingChange = this.handleAddRatingChange.bind(this);
    }

    loadCourseDetails(learnCourseId,page = 0, size = COURSE_LIST_SIZE) {
        this.setState({
            isLoading: true
        });

        getCourseDetails(learnCourseId,page, size)
        .then(response => {
            
          const urlReference = [];
                const slideshowReference = [];
                const videoReference = [];
                const studentsFeedBackReference = [];
                var attachmentMetaReference;
                var currentUserRatingReference = 0;
                if(response.laUrlReference !== null && response.laUrlReference !== undefined) {
                  const urlReferenceData = JSON.parse(response.laUrlReference);
                  urlReferenceData.forEach((urlReferenceObj, urlIndex) => {
                    if(Object.keys(urlReferenceObj).length > 0 && Object.values(urlReferenceObj).length > 0) {
                      var urlReferenceFormed = {};
                      urlReferenceFormed['key'] = urlIndex;
                      urlReferenceFormed['type'] = 'url';
                      urlReferenceFormed['title'] = Object.keys(urlReferenceObj)[0];
                      urlReferenceFormed['content'] = Object.values(urlReferenceObj)[0];
                      urlReference.push(urlReferenceFormed);
                    }
                  });
                }
                if(response.laSlideShowUrlReference !== null && response.laSlideShowUrlReference !== undefined) {
                  const slideshowReferenceData = JSON.parse(response.laSlideShowUrlReference);
                  slideshowReferenceData.forEach((slideshowReferenceObj, slideshowIndex) => {
                    if(Object.keys(slideshowReferenceObj).length > 0 && Object.values(slideshowReferenceObj).length > 0) {
                      var slideshowReferenceFormed = {};
                      slideshowReferenceFormed['key'] = slideshowIndex;
                      slideshowReferenceFormed['type'] = 'slide';
                      slideshowReferenceFormed['title'] = Object.keys(slideshowReferenceObj)[0];
                      slideshowReferenceFormed['content'] = Object.values(slideshowReferenceObj)[0];
                      slideshowReference.push(slideshowReferenceFormed);
                    }
                  });
                }
                if(response.laVideoUrlReference !== null && response.laVideoUrlReference !== undefined) {
                  const videoReferenceData = JSON.parse(response.laVideoUrlReference);
                  videoReferenceData.forEach((videoReferenceObj, videoIndex) => {
                    if(Object.keys(videoReferenceObj).length > 0 && Object.values(videoReferenceObj).length > 0) {
                      var videoReferenceFormed = {};
                      videoReferenceFormed['key'] = videoIndex;
                      videoReferenceFormed['type'] = 'video';
                      videoReferenceFormed['title'] = Object.keys(videoReferenceObj)[0];
                      videoReferenceFormed['content'] = Object.values(videoReferenceObj)[0];
                      videoReference.push(videoReferenceFormed);
                    }
                  });
                }

                if(response.attachmentMeta !== null && response.attachmentMeta !== undefined) {
                  const attachmentMetaData = JSON.parse(response.attachmentMeta);
                  if(attachmentMetaData !== null && attachmentMetaData !== undefined && Object.values(attachmentMetaData).length > 0) {
                    attachmentMetaReference = Object.values(attachmentMetaData);
                  }
                }

                if(response.laLearnCourseComments !== null && response.laLearnCourseComments !== undefined) {
                  if(response.laLearnCourseComments !== null && response.laLearnCourseComments !== undefined) {
                    response.laLearnCourseComments.forEach((commentDataObj, videoIndex) => {
                      if(commentDataObj !== null && commentDataObj !== undefined && commentDataObj['laCommentId'] !== null && commentDataObj['laCommentId'] !== undefined && commentDataObj['laCommentContent'] !== null && commentDataObj['laCommentContent'] !== undefined) {
                        studentsFeedBackReference.push(JSON.parse(commentDataObj['laCommentContent']));
                      }
                    });
                  }
                }

                if(response.laLearnCourseRating !== null && response.laLearnCourseRating !== undefined) {
                  response.laLearnCourseRating.forEach((courseRating, ratingIndex) => {
                    if(courseRating !== null && courseRating !== undefined && courseRating['laUserId'] !== null && courseRating['laUserId'] !== undefined && courseRating['laUserId'] == this.state.currentUser.laUserId) {
                      currentUserRatingReference = courseRating['laUserRating'];
                    }
                  });
                }

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
                    isLoading: false,
                    studentsFeedback : studentsFeedBackReference,
                      commentContent : '',
                      prerequisiteContent : [{
                        tabId : 'whatwillilearn',
                        tabName : 'What Will I Learn',
                        tabContent : (response.laWhatWillILearn !== null && response.laWhatWillILearn !== undefined) ? JSON.parse(response.laWhatWillILearn) : [],
                        tabIcon : <ProfileOutlined />
                      }, {
                        tabId : 'prerequisite',
                        tabName : 'PreRequisite',
                        tabContent : (response.laPrerequisite !== null && response.laPrerequisite !== undefined) ? JSON.parse(response.laPrerequisite) : [],
                        tabIcon : <CheckCircleFilled />
                      }],
                      urlReferenceContent : {
                        tabId : 'urlRefernce',
                        tabName : 'URL Reference',
                        tabContent : urlReference,
                        tabIcon : <ProfileOutlined />
                      },
                      slideReferenceContent : {
                        tabId : 'slideRefernce',
                        tabName : 'Slide Show Reference',
                        tabContent : slideshowReference,
                        tabIcon : <ProfileOutlined />
                      },
                      videoReferenceContent : {
                        tabId : 'videoRefernce',
                        tabName : 'Video Reference',
                        tabContent : videoReference,
                        tabIcon : <ProfileOutlined />
                      },
                      attachmentMetaReference: attachmentMetaReference,
                      userRating : currentUserRatingReference,
                      overallRating : response.laLearnCourseOverallRating
                });
            }
            else
            {
                this.setState({
                    course: response,
                    isLoading: false,
                    studentsFeedback : studentsFeedBackReference,
                      commentContent : '',
                      prerequisiteContent : [{
                        tabId : 'whatwillilearn',
                        tabName : 'What Will I Learn',
                        tabContent : JSON.parse(response.laWhatWillILearn),
                        tabIcon : <ProfileOutlined />
                      }, {
                        tabId : 'prerequisite',
                        tabName : 'PreRequisite',
                        tabContent : JSON.parse(response.laPrerequisite),
                        tabIcon : <CheckCircleFilled />
                      }],
                      urlReferenceContent : {
                        tabId : 'urlRefernce',
                        tabName : 'URL Reference',
                        tabContent : urlReference,
                        tabIcon : <ProfileOutlined />
                      },
                      slideReferenceContent : {
                        tabId : 'slideRefernce',
                        tabName : 'Slide Show Reference',
                        tabContent : slideshowReference,
                        tabIcon : <ProfileOutlined />
                      },
                      videoReferenceContent : {
                        tabId : 'videoRefernce',
                        tabName : 'Video Reference',
                        tabContent : videoReference,
                        tabIcon : <ProfileOutlined />
                      },
                      attachmentMetaReference: attachmentMetaReference,
                      userRating : currentUserRatingReference,
                      overallRating : response.laLearnCourseOverallRating
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

    handleLoadMore() {
        const learnCourseId = this.props.match.params.learnCourseId;
        this.loadCourseDetails(learnCourseId,this.state.page + 1);
    }

    handleCommentChange(commentInfo) {
      var studentsFeedBack = this.state.studentsFeedback;
      
    }

    handleAddCommentChange() {
      var studentsFeedBack = this.state.studentsFeedback;
      var commentContent = this.state.commentContent;
      if(commentContent !== null && commentContent !== undefined && commentContent !== '') {
        var commentContentFormed = [{
          laUserName : this.state.currentUser.laUserName,
          laUserFullName : this.state.currentUser.laUserFullName,
          laCommentContent : commentContent,
          laImagePath : this.state.currentUser.laImagePath,
          actions : {likes : '0', dislikes : '0'},
          laCommentTime: new Date().toDateString() + " " + new Date().toLocaleTimeString()
        }];
  
        var laCourseComment = {
          laCourseId: JSON.stringify(this.state.course.learnCourseId),
          laCourseCommentsContent: JSON.stringify(commentContentFormed)  
        };
        uploadComment(laCourseComment)
          .then(response => {
            if(response !== null && response !== undefined) {
              studentsFeedBack = studentsFeedBack.concat(commentContentFormed);
              this.setState ({
                studentsFeedback : studentsFeedBack,
                commentContent : ''
              });
            }
          });
      }
    }

    handleAddRatingChange(providedUserRating) {
      var overallRating = this.state.overallRating;
      if(providedUserRating !== null && providedUserRating !== undefined) {  
        var laCourseRating = {
          laCourseId: JSON.stringify(this.state.course.learnCourseId),
          laUpvoteCount: 0,
          laDownvoteCount: 0,
          laUserRating: providedUserRating,
          laUserId: this.state.currentUser.laUserId
        };
        uploadRating(laCourseRating)
          .then(response => {
            if(response !== null && response !== undefined) {
              overallRating = (overallRating + providedUserRating);
              this.setState ({
                userRating : providedUserRating,
                overallRating : overallRating
              });
            }
          });
      }

    }

    handleCommentTextInputChange(commentInfo){
      this.setState ({
        commentContent : commentInfo["target"]["value"],
        submitting : true
      });
      
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

        const authorDescription = (<div>
          <Paragraph>
            -
          </Paragraph>
          </div>)
        
        return (
            <Content
          className="site-layout-background course-detail-content"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
            <div className="new-course-content">
            <PageHeaderComponent laUserName = {this.state.course.createdBy.laUserName} 
            laUserFullName = {this.state.course.createdBy.laUserFullName} laCreatedAt = {this.state.course.laCreatedAt} 
            laLearnCourseName = {this.state.course.laLearnCourseName} learnCourseId = {this.state.course.learnCourseId} 
            isLoading = {this.state.isLoading} laTechTag = {this.state.course.laTechTag}
            laCourseBackgroundImage = {this.state.course.laCourseBackgroundImage}
            laCourseDescription = {this.state.course.laCourseDescription}
            currentUser  = {this.state.currentUser} />
            <RequirementTabComponent tabContent = {this.state.prerequisiteContent}>
            </RequirementTabComponent>
            <TabWithCardPaginationComponent tabName = 'Sub Courses' data = {this.state.courses} currentUser  = {this.state.currentUser}>
            </TabWithCardPaginationComponent>
            <CourseContentHTMLComponent tabName = 'Course Content' htmlData = {this.state.course.laCourseContentHtml} >
            </CourseContentHTMLComponent>
            <AttachmentPreviewTabComponent  tabName = 'Course Attachment' tabContent = {this.state.attachmentMetaReference} >
            </AttachmentPreviewTabComponent>
            <URLSildeVideoReferenceTabComponent tabContent = {this.state.urlReferenceContent} tabIcon = {<LinkOutlined />}>
            </URLSildeVideoReferenceTabComponent>
            <URLSildeVideoReferenceTabComponent tabContent = {this.state.slideReferenceContent} tabIcon = {<DesktopOutlined />}>
            </URLSildeVideoReferenceTabComponent>
            <URLSildeVideoReferenceTabComponent tabContent = {this.state.videoReferenceContent} tabIcon = {<VideoCameraOutlined />}>
            </URLSildeVideoReferenceTabComponent>
            <AuthorDetailsComponent tabName = 'Author Details'  author = {this.state.course.createdBy} currentUser  = {this.state.currentUser} 
            authorDescription = {authorDescription} >
            </AuthorDetailsComponent>
            {
              this.state.course.laAllowRating
              ?
              (
                <RatingAndRatingInfoTabComponent tabName = 'Students Feedback' tabIcon = {<LikeOutlined />} 
                  userStatTitle= 'Your Rating' userRatingValue = {this.state.userRating} userRatingIcon = {<UserOutlined />}
                  statTitle = 'Overall Rating' statValue = {1128} 
                  statIcon = {<TeamOutlined />} overallStarValue = {this.state.overallRating}
                  fiveStarPercentage = {43} fourStarPercentage = {32}
                  threeStarPercentage = {10} twoStarPercentage = {10}
                  oneStarPercentage = {5} handleAddRatingChange = {this.handleAddRatingChange} />
              )
              : null
            }
            {
              this.state.course.laAllowComment
              ?
              (
                <FeedbackCommentComponent tabName = 'Discussions' studentsFeedback = {this.state.studentsFeedback} 
                  handleAddCommentChange = {this.handleAddCommentChange}
                  handleCommentTextInputChange = {this.handleCommentTextInputChange}
                  commentContent = {this.state.commentContent} currentUser  = {this.state.currentUser} ></FeedbackCommentComponent>
              )
              : null
            }                         
            </div>
            </Content>
           
        );
    }
}

export default withRouter(CourseDetail);