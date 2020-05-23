import React, { Component } from 'react';
import { getAllCourses, getUserCreatedCourses} from '../util/APIUtils';
import TabWithScrollableCardComponent from './TabWithScrollableCardComponent';
import { COURSE_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import { ReadOutlined } from '@ant-design/icons';

class BecauseYouSearchedCourses extends Component {
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
            isLoading: false
        };
        this.loadCourseList = this.loadCourseList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadCourseList(page = 0, size = COURSE_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_COURSES') {
                promise = getUserCreatedCourses(this.props.username, page, size);
            }
        } else {
            promise = getAllCourses(page, size);
        }

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
        this.loadCourseList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated && !this.state.isLoading) {
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
        }
    }

    handleLoadMore() {
        if(!this.state.isLoading)
        {
            if(((this.state.page + 1) < this.state.totalPages))
            {
                this.loadCourseList(this.state.page + 1);
            }
        }
    }

    render() {
        
        return (

            <TabWithScrollableCardComponent data = {this.state.courses} seeAll = 'See All' 
            tabName = 'Because You Searched PostgreSQL' handleLoadMore = {this.handleLoadMore} 
            isLoading = {this.state.isLoading} page = {this.state.page} noDataFoundMsg = 'No Courses Matching to Your Search Found.'
            seeAllLink = {`/courseDetailList/${this.props.currentUser.laUserId}/searchresults`} tabIcon = {<ReadOutlined />} tabKey = {'1'} isCourse = {true} isUser = {false} isCategory = {false}/>
        );
    }
}

export default withRouter(BecauseYouSearchedCourses);