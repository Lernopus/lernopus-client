import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import NotFound from '../common/NotFound';
import ServerError from '../common/ServerError';
import { getStudentsDetails } from '../util/APIUtils';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { COURSE_LIST_SIZE } from '../constants';
import StudentsDetailList from './StudentsDetailList';
import PageHeaderComponent from './PageHeaderComponent';
const {Content} = Layout;

class StudentsDetail extends Component {
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
    this.loadStudentsDetails = this.loadStudentsDetails.bind(this);
}

loadStudentsDetails(laUserId, page = 0, size = COURSE_LIST_SIZE) {
    this.setState({
        isLoading: true
    });

    getStudentsDetails(laUserId,page, size)
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
    this.loadStudentsDetails(laUserId);
}

handleLoadMore() {
    const laUserId = this.props.match.params.laUserId;
    this.loadStudentsDetails(laUserId,this.state.page + 1);
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
          }}>
            <div className="new-course-content">
                <PageHeaderComponent laUserName = {''} 
                    laUserFullName = {''} laCreatedAt = {''} 
                    laLearnCourseName = {'Students'} learnCourseId = {'1'} 
                    isLoading = {this.state.isLoading} laTechTag = {[]}
                    currentUser  = {this.state.currentUser} />
                <StudentsDetailList isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} handleLogout={this.handleLogout} isSearch = {false} />
            </div>
            </Content>
           
        );
    }
}

export default withRouter(StudentsDetail);