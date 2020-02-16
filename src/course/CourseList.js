import React, { Component } from 'react';
import { getAllCourses, getUserCreatedCourses} from '../util/APIUtils';
import Course from './Course';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { COURSE_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './CourseList.css';

class CourseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            // currentVotes: [],
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
            //const currentVotes = this.state.currentVotes.slice();

            this.setState({
                courses: courses.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
              //  currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
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
            this.loadCourseList();
        }
    }

    handleLoadMore() {
        this.loadCourseList(this.state.page + 1);
    }

    render() {
        const courseViews = [];
        this.state.courses.forEach((course, courseIndex) => {
            courseViews.push(<Course 
                key={course.learnCourseId} 
                course={course}
                />)            
        });

        return (
            <div className="courses-container">
                {courseViews}
                {
                    !this.state.isLoading && this.state.courses.length === 0 ? (
                        <div className="no-courses-found">
                            <span>No Subscribed Courses Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-courses"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(CourseList);