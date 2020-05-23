import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getWhishlistCourseDetails, getPurchasedCourseDetails, getAllCourses } from '../util/APIUtils';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import PageHeaderComponent from './PageHeaderComponent';
import TabWithCardListComponent from './TabWithCardListComponent';
const {Content} = Layout;

class CourseListDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        course: [],
        isLoading: true,
        studentsFeedback : [],
        commentContent : '',
        isAuthenticated : props.isAuthenticated,
        currentUser : props.currentUser
    };
    this.loadCourseListDetailComponents = this.loadCourseListDetailComponents.bind(this);
}

loadCourseListDetailComponents(laUserId, page = 0, size = COURSE_LIST_SIZE) {
    this.setState({
        isLoading: true
    });

    let promise;
    if(this.props.match.params.categoryType === 'bookmarked')
    {
        promise = getWhishlistCourseDetails(laUserId,page, size);
    }
    else if(this.props.match.params.categoryType === 'purchased')
    {
        promise = getPurchasedCourseDetails(laUserId,page, size);
    }
    else
    {
        promise = getAllCourses(page, size);
    }
    if(!promise) {
        return;
    }

    promise
    .then(response => {
            this.setState({
                course: response,
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
  
componentDidMount() {
    const laUserId = this.props.match.params.laUserId;
    this.loadCourseListDetailComponents(laUserId);
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
            isLoading: false
        });    
        var laUserId = nextProps.match.params.laUserId;
        this.loadCourseListDetailComponents(laUserId);
    }
    else
    {
        if(!!nextProps.match.params.laUserId && !isNaN(nextProps.match.params.laUserId))
        {
            var laUserId = nextProps.match.params.laUserId;
            this.loadCourseListDetailComponents(laUserId);
        }
    }
}

handleLoadMore() {
    const laUserId = this.props.match.params.laUserId;
    this.loadCourseListDetailComponents(laUserId,this.state.page + 1);
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

        var pageHeaderName = '';
        var tabName = '';
        var noDataMsg = '';
        if(this.props.match.params.categoryType === 'purchased')
        {
            pageHeaderName = 'Purchased Courses';
            tabName = 'Purchased Courses';
            noDataMsg = 'No Purchased Courses Found';
        }

        else if(this.props.match.params.categoryType === 'bookmarked')
        {
            pageHeaderName = 'Bookmarked Courses';
            tabName = 'Bookmarked Courses';
            noDataMsg = 'No Bookmarked Courses Found';
        }
        else if(this.props.match.params.categoryType === 'searchresults')
        {
            pageHeaderName = 'Courses relevant to your searches';
            tabName = 'Courses relevant to your searches';
            noDataMsg = 'No Courses matches your search history';
        }
        else if(this.props.match.params.categoryType === 'bestresults')
        {
            pageHeaderName = 'Best of Learn Opus Prime';
            tabName = 'Best of Learn Opus Prime';
            noDataMsg = 'No Best Courses Found Yet.';
        }
        else if(this.props.match.params.categoryType === 'continueresults')
        {
            pageHeaderName = 'Continue Reading';
            tabName = 'Continue Reading';
            noDataMsg = 'No Courses to Continue Found.';
        }
        else if(this.props.match.params.categoryType === 'samecategoryresults')
        {
            pageHeaderName = 'Students are also learning';
            tabName = 'Students are also learning';
            noDataMsg = 'No Same Category Courses Found.';
        }
        else if(this.props.match.params.categoryType === 'toppicks')
        {
            pageHeaderName = 'Top Picks in Learn Opus For You';
            tabName = 'Top Picks in Learn Opus For You';
            noDataMsg = 'No Top Picks Found Yet.';
        }
        else if(this.props.match.params.categoryType === 'trending')
        {
            pageHeaderName = 'Trending Courses in Learn Opus';
            tabName = 'Trending Courses in Learn Opus';
            noDataMsg = 'No Trending Courses Found Yet.';
        }
        else if(this.props.match.params.categoryType === 'latest')
        {
            pageHeaderName = 'Latest Courses in Learn Opus';
            tabName = 'Latest Courses in Learn Opus';
            noDataMsg = 'No Latest Courses Found Yet.';
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
            laLearnCourseName = {pageHeaderName} learnCourseId = {'1'} 
            isLoading = {this.state.isLoading} laTechTag = {[]}
            currentUser  = {this.state.currentUser} />
            <TabWithCardListComponent  isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} handleLogout={this.handleLogout} 
            tabName = {tabName} noDataMsg = {noDataMsg}
            cardListType = {this.props.match.params.categoryType} isSearch = {false} />
            </div>
            </Content>
           
        );
    }
}

export default withRouter(CourseListDetailComponent);