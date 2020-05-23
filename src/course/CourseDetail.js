import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import './CourseDetail.css';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCourseDetails } from '../util/APIUtils';
import { Typography, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import { CheckCircleFilled, ReadOutlined, ProfileOutlined } from '@ant-design/icons';
import RatingAndRatingInfoTabComponent from './RatingAndRatingInfoTabComponent';
import PageHeaderComponent from './PageHeaderComponent';
import RequirementTabComponent from './RequirementTabComponent';
import FeedbackCommentComponent from './FeedbackCommentComponent';
import AuthorDetailsComponent from './AuthorDetailsComponent';
import CourseContentHTMLComponent from './CourseContentHTMLComponent';
import TabWithCardPaginationComponent from './TabWithCardPaginationComponent';
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
                    isLoading: false,
                    studentsFeedback : [
                      {
                        laUserName : 'amernath555',
                        laUserFullName : 'Amernath V',
                        'laImagePath' : 'https://lh3.googleusercontent.com/a-/AOh14Ghk-sWTvRopvskysvSkSasyoFL07nebOu5mPIdc4g',
                        laCommentContent : 'This Course is really useful. Have Learnt a Lot....',
                        actions : {likes : '42', dislikes : '31'}
                      }
                      ],
                      commentContent : '',
                      prerequisiteContent : [{
                        tabId : 'whatwillilearn',
                        tabName : 'What Will I Learn',
                        tabContent : ['Become an expert in SQL',
                        'Boost your resume by learning an in-demand skill',
                        'Create, design, and operate with SQL databases',
                        'Prepare for SQL developer, Database administrator, Business Analyst, and Business Intelligence job opportunities',
                        'Approach more advanced topics in programming like SQL’s triggers, sequences, local and global variables, indexes, and more',
                        'The ability to take control of your dataset – insert, update, and delete records from your database',
                        'Tons of exercises that will solidify your knowledge',
                        'Study relational database management theory that you will need in your workplace every day'
                      ],
                        tabIcon : <ProfileOutlined />
                      }, {
                        tabId : 'prerequisite',
                        tabName : 'PreRequisite',
                        tabContent : ['Basic IT Skills',
                        'No Linux, programming or hacking knowledge required.',
                        'Computer with a minimum of 4GB ram/memory.',
                        'Operating System: Windows / OS X / Linux.',
                        'For WiFi cracking (10 lectures ONLY) - Wireless adapter that supports monitor mode (more info provided in the course).'
                      ],
                        tabIcon : <CheckCircleFilled />
                      }]
                });
            }
            else
            {
                this.setState({
                    course: response,
                    isLoading: false,
                    studentsFeedback : [
                      {
                        laUserName : 'amernath555',
                        laUserFullName : 'Amernath V',
                        'laImagePath' : 'https://lh3.googleusercontent.com/a-/AOh14Ghk-sWTvRopvskysvSkSasyoFL07nebOu5mPIdc4g',
                        laCommentContent : 'This Course is really useful. Have Learnt a Lot....',
                        actions : {likes : '42', dislikes : '31'}
                      }
                      ],
                      commentContent : '',
                      prerequisiteContent : [{
                        tabId : 'whatwillilearn',
                        tabName : 'What Will I Learn',
                        tabContent : ['Become an expert in SQL',
                        'Boost your resume by learning an in-demand skill',
                        'Create, design, and operate with SQL databases',
                        'Prepare for SQL developer, Database administrator, Business Analyst, and Business Intelligence job opportunities',
                        'Approach more advanced topics in programming like SQL’s triggers, sequences, local and global variables, indexes, and more',
                        'The ability to take control of your dataset – insert, update, and delete records from your database',
                        'Tons of exercises that will solidify your knowledge',
                        'Study relational database management theory that you will need in your workplace every day'
                      ],
                        tabIcon : <ProfileOutlined />
                      }, {
                        tabId : 'prerequisite',
                        tabName : 'PreRequisite',
                        tabContent : ['Basic IT Skills',
                        'No Linux, programming or hacking knowledge required.',
                        'Computer with a minimum of 4GB ram/memory.',
                        'Operating System: Windows / OS X / Linux.',
                        'For WiFi cracking (10 lectures ONLY) - Wireless adapter that supports monitor mode (more info provided in the course).'
                      ],
                        tabIcon : <CheckCircleFilled />
                      }]
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
      var commentContentFormed = [{
        laUserName : this.state.currentUser.laUserName,
        laUserFullName : this.state.currentUser.laUserFullName,
        laCommentContent : commentContent,
        'laImagePath' : this.state.currentUser.laImagePath,
        actions : {likes : '42', dislikes : '31'}
      }];
      studentsFeedBack = studentsFeedBack.concat(commentContentFormed);
      this.setState ({
        studentsFeedback : studentsFeedBack,
        commentContent : ''
      });
      
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
            Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
            easier for designers to have a clear psychological expectation of color when adjusting colors,
            as well as facilitate communication in teams.
          </Paragraph>
          <Paragraph>
            Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
            easier for designers to have a clear psychological expectation of color when adjusting colors,
            as well as facilitate communication in teams.
          </Paragraph>
          <Paragraph>
            Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
            easier for designers to have a clear psychological expectation of color when adjusting colors,
            as well as facilitate communication in teams.
          </Paragraph>
          <Paragraph>
          Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
          easier for designers to have a clear psychological expectation of color when adjusting colors,
          as well as facilitate communication in teams.
        </Paragraph>
        <Paragraph>
          Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
          easier for designers to have a clear psychological expectation of color when adjusting colors,
          as well as facilitate communication in teams.
        </Paragraph>
        <Paragraph>
          Ant Design&#x27;s design team preferred to design with the HSB color model, which makes it
          easier for designers to have a clear psychological expectation.
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
            currentUser  = {this.state.currentUser} />
            <RequirementTabComponent tabContent = {this.state.prerequisiteContent}>
            </RequirementTabComponent>
            <TabWithCardPaginationComponent data = {this.state.courses} currentUser  = {this.state.currentUser}>
            </TabWithCardPaginationComponent>
            <CourseContentHTMLComponent tabName = 'Course Content' htmlData = {this.state.course.laCourseContentHtml} >
            </CourseContentHTMLComponent>
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
              <AuthorDetailsComponent tabName = 'Author Details'  author = {this.state.course.createdBy} currentUser  = {this.state.currentUser} 
              authorDescription = {authorDescription} >
              </AuthorDetailsComponent>
              <RatingAndRatingInfoTabComponent tabName = 'Students Feedback' tabIcon = {<ReadOutlined />} 
                        statTitle = 'Feedback' statValue = {1128} 
                        statIcon = {<ReadOutlined/>} overallStarValue = {4}
                        fiveStarPercentage = {43} fourStarPercentage = {32}
                        threeStarPercentage = {10} twoStarPercentage = {10}
                        oneStarPercentage = {5} 
                      />
              <FeedbackCommentComponent tabName = 'Discussions' studentsFeedback = {this.state.studentsFeedback} 
              handleAddCommentChange = {this.handleAddCommentChange}
              handleCommentTextInputChange = {this.handleCommentTextInputChange}
              commentContent = {this.state.commentContent} currentUser  = {this.state.currentUser} ></FeedbackCommentComponent>                         
            </div>
            </Content>
           
        );
    }
}

export default withRouter(CourseDetail);