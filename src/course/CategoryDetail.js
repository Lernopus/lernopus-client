import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getCategoryDetails } from '../util/APIUtils';
import { Layout} from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import { CheckCircleFilled, ReadOutlined, ProfileOutlined } from '@ant-design/icons';
import SubCategoryList from './SubCategoryList';
import CategoryAuthorToFollowList from './CategoryAuthorToFollowList';
import PageHeaderComponent from './PageHeaderComponent';
import CategoryDetailCourseList from './CategoryDetailCourseList';
import RatingAndRatingInfoTabComponent from './RatingAndRatingInfoTabComponent';
import RequirementTabComponent from './RequirementTabComponent';
const {Content} = Layout;

class CategoryDetail extends Component {
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
            }],
            options: [],
            searchResult : ''
        };
        this.loadCategoryDetails = this.loadCategoryDetails.bind(this);
    }

    loadCategoryDetails(learnCourseId,page = 0, size = COURSE_LIST_SIZE) {
        this.setState({
            isLoading: true
        });

        getCategoryDetails(learnCourseId,page, size)
        .then(response => {
                this.setState({
                    course: response,
                    isLoading: false,
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
        const categoryId = this.props.match.params.categoryId;
        this.loadCategoryDetails(categoryId);
    }

    handleLoadMore() {
        const categoryId = this.props.match.params.categoryId;
        this.loadCategoryDetails(categoryId,this.state.page + 1);
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
            <PageHeaderComponent laUserName = {''} 
            laUserFullName = {''} laCreatedAt = {''} 
            laLearnCourseName = {this.state.course.name} learnCourseId = {this.state.course.laTechCategory} 
            isLoading = {this.state.isLoading} laTechTag = {[]}
            currentUser  = {this.state.currentUser} />
            <RequirementTabComponent tabContent = {this.state.prerequisiteContent}>
            </RequirementTabComponent>
                <SubCategoryList categoryId = {this.state.laTechCategory} isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} />
                <CategoryAuthorToFollowList categoryId = {this.state.laTechCategory} isAuthenticated={this.state.isAuthenticated} 
                  currentUser={this.state.currentUser} handleLogout={this.handleLogout} isScrollCard = {true} isScrollList = {false} />
                <CategoryDetailCourseList  categoryId = {this.state.laTechCategory} isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout} />
                <RatingAndRatingInfoTabComponent tabName = 'Students Feedback' tabIcon = {<ReadOutlined />} 
                        statTitle = 'Feedback' statValue = {1128} 
                        statIcon = {<ReadOutlined/>} overallStarValue = {4}
                        fiveStarPercentage = {43} fourStarPercentage = {32}
                        threeStarPercentage = {10} twoStarPercentage = {10}
                        oneStarPercentage = {5} 
                      />                      
            </div>
            </Content>
           
        );
    }
}

export default withRouter(CategoryDetail);